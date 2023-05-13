import { kookploeg_eters } from '@/models/kookploeg_eters';
import { kookploeg_momenten } from '@/models/kookploeg_momenten';
import sequelize from '@/lib/sequelize';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { isUndefined } from 'lodash';
import { getKookploegEters } from './kookploeg';

const DAGEN_VOORUIT = 5; // Op dit moment kijken KP Cool, KP Hot en KP Weekend allemaal 5 dagen vooruit.
const SALDO_KPS = [3]; // TODO: get from db, voor nu Weekend KP
const LAATSTGEKOOKT_KPS = [1, 2]; // TODO: get from db, voor nu KP Cool en KP Hot

export const getVoorspellingMoment = async (
  momentID: number,
  _momenten?: kookploeg_momenten[], // Dit voorkomt verkeerde recursie en is voor intern gebruik, bij het extern callen van deze funcite _momenten leeg laten
  _inschrijvingen?: kookploeg_eters[]
): Promise<{
  kok: number | null;
  reserveKok: number | null;
  afwas1: number | null;
  afwas2: number | null;
  reserveAfwas: number | null;
} | null> => {
  kookploeg_momenten.initModel(sequelize);
  kookploeg_eters.initModel(sequelize);
  const moment = await kookploeg_momenten.findOne({
    where: { ID: momentID },
  });

  if (moment == null) {
    throw new Error(
      `Voorspelling aangevraagd voor niet bestaand moment met ID: ${momentID}`
    );
  }

  const vandaag = dayjs();
  //Een schat uit de php server: 27-11-2013 AANP @Pieter aantalDagen naar (aantalDagen +3) => week vooruit kijken, zodat deze hard werkende man zich voor maandag kan intekenen als kok en dan de week ervoor niet meer hoeft te koken:P
  const dagVooruit = vandaag.add(DAGEN_VOORUIT + 3, 'day');
  const momentDatum = dayjs(moment.Datum, 'YYYY-MM-DD');

  // We voorspellen data tussen vandaag en X dagen vooruit, wanneer de datum is gespecificeerd en die buiten die range valt returnen we null;
  if (!momentDatum.isBetween(vandaag, dagVooruit, 'day', '[]')) {
    console.log('Moment wordt niet voorspeld, dat moment is buiten de range');
    return null;
  }

  // Eters voor dit specifieke moment
  const eters = (await getKookploegEters(momentID)).filter(
    // Filter away any duplicates
    (eter, index, array) =>
      array.findIndex((e) => e.GebruikerID === eter.GebruikerID) === index
  );

  let momenten =
    _momenten ??
    (await kookploeg_momenten.findAll({
      where: {
        KookploegID: moment.KookploegID,
        Datum: {
          [Op.lt]: dagVooruit.format('YYYY-MM-DD'),
        },
      },
      order: [['Datum', 'DESC']],
      raw: true,
    }));

  console.time('Inschrijvingen ophalen');
  let inschrijvingen: kookploeg_eters[] | undefined = _inschrijvingen;
  if (SALDO_KPS.includes(moment.KookploegID) && !inschrijvingen) {
    inschrijvingen = await kookploeg_eters.findAll({
      where: {
        // Tijdstempel: { [Op.gt]: '2012-09-13 00:00:00' },
        MomentID: { [Op.gt]: 1797 }, // Kookmoment op 2012-09-13, het startmoment van WeekendKP (uit database). We nemen alleen mee van na dit moment. TODO: Haal dit uit database
      },
      raw: true,
    });
  }
  console.timeLog('Inschrijvingen ophalen');
  console.timeEnd('Inschrijvingen ophalen');

  if (!_momenten) {
    const voorspellingsMomenten = momenten
      .filter((m) => {
        // We houden rekening met de dagen voor het moment tot en met vandaag
        return dayjs(m.Datum).isBetween(vandaag, momentDatum, 'day', '[)');
      })
      .reverse();

    // Die dagen moeten we een voor een langs gaan vanaf vandaag en die momenten met de voorspelling updaten
    console.log({
      teBerekenenMomenten: voorspellingsMomenten.map((m) => m.Datum),
    });

    // TODO: voorspelling van vorige dagen tot vandaag overschrijven
    // op volgorde van vandaag tot dit moment
    for (let i = 0; i < voorspellingsMomenten.length; i++) {
      const m = voorspellingsMomenten[i];
      const berekening = await getVoorspellingMoment(m.ID, momenten);
      console.log('Berekenening voor moment', m.ID, 'is', { berekening });
      const index = momenten.findIndex((_m) => _m.ID === m.ID);
      momenten[index].Kok = berekening?.kok ?? undefined;
      momenten[index].Afwas1 = berekening?.afwas1 ?? undefined;
      momenten[index].Afwas2 = berekening?.afwas2 ?? undefined;
      console.log('Moment', m.ID, 'is nu', momenten[index]);
    }
  }

  if (SALDO_KPS.includes(moment.KookploegID) && !isUndefined(inschrijvingen)) {
    const laagsteKookSaldo = berekenKookSaldos(eters, momenten, inschrijvingen);
    const laatstAfgewassen = berekenAfwasVolgorde(eters, momenten);

    return berekenKokEnAfwas(moment, laagsteKookSaldo, laatstAfgewassen);
  } // TODO: Saldo implementatie
  if (LAATSTGEKOOKT_KPS.includes(moment.KookploegID)) {
    const laatstGekookt = berekenLaatstGekookt(eters, momenten);
    const laatstAfgewassen = berekenAfwasVolgorde(eters, momenten);

    return berekenKokEnAfwas(moment, laatstGekookt, laatstAfgewassen);
  }
  return null;
};

const berekenAfwasVolgorde = (
  eters: kookploeg_eters[],
  momenten: kookploeg_momenten[]
): { id: number; datum: string | null }[] => {
  return eters
    .map((e) => {
      const laatst = momenten.find(
        (m) => m.Afwas1 === e.GebruikerID || m.Afwas2 === e.GebruikerID
      );
      return { id: e.GebruikerID, datum: laatst?.Datum ?? null };
    })
    .sort((a, b) => {
      return a.datum
        ? b.datum
          ? a.datum > b.datum
            ? 1
            : a.datum === b.datum
            ? afwasDecider(a.id, b.id, momenten)
              ? 1
              : -1
            : -1
          : 1
        : -1;
    });
};

// Return true als eter 1 heeft het meest recent afgewassen, false als eter 2
const afwasDecider = (
  eter1ID: number,
  eter2ID: number,
  momenten: kookploeg_momenten[]
): boolean => {
  // Teruggaan tot er een decider is gevonden
  let laatsteAfwas1Index = momenten.findIndex((m) => m.Afwas1 === eter1ID);
  let laatsteAfwas2Index = momenten.findIndex((m) => m.Afwas2 === eter2ID);
  for (let i = laatsteAfwas1Index; i < momenten.length; i++) {
    const match1 = momenten[i].Afwas1 === eter1ID;
    const match2 = momenten[i].Afwas2 === eter2ID;
    if (match1 && match2) {
      // Eters hebben op dit kookmoment samen afgewassen, zoek verder
      continue;
    } else if (match1) {
      // Eter 1 heeft het meest recent afgewassen
      return true;
    } else {
      // Eter 2 heeft het meest recent afgewassen
      return false;
    }
  }
  return true;
};

const berekenLaatstGekookt = (
  eters: kookploeg_eters[],
  momenten: kookploeg_momenten[]
): { id: number; datum: string | null }[] => {
  // TODO: Implementeer Karel Klausule voor oud huisgenoten
  return eters
    .map((e) => {
      const laatst = momenten.find((m) => m.Kok === e.GebruikerID);
      return { id: e.GebruikerID, datum: laatst?.Datum ?? null };
    })
    .sort((a, b) => {
      return a.datum ? (b.datum ? (a.datum > b.datum ? 1 : -1) : 0) : 1;
    });
};

const berekenKookSaldos = (
  eters: kookploeg_eters[],
  momenten: kookploeg_momenten[],
  alleInschrijvingen: kookploeg_eters[]
): { id: number; saldo: number }[] => {
  console.time('Kooksaldo berekening');
  // Dit kan veel sneller met een joint query...

  const vandaag = dayjs();
  const vandaagString = vandaag.format('YYYY-MM-DD');

  console.time('stap0: momentenMap');
  let momentenMap = new Map();
  for (let i = 0; i < momenten.length; i++) {
    momentenMap.set(momenten[i].ID, momenten[i]);
  }
  console.timeLog('stap0: momentenMap');
  console.timeEnd('stap0: momentenMap');

  console.time('stap0: momentenSet');
  let momentIdSet = new Set();
  for (let i = 0; i < momenten.length; i++) {
    momentIdSet.add(momenten[i].ID);
  }
  console.timeLog('stap0: momentenSet');
  console.timeEnd('stap0: momentenSet');

  console.time('stap1: relevanteInschrijvingen');
  let relevanteInschrijvingen: kookploeg_eters[] = [];
  for (let i = 0; i < alleInschrijvingen.length; i++) {
    const ins = alleInschrijvingen[i];
    if (momentIdSet.has(ins.MomentID)) {
      relevanteInschrijvingen.push(ins);
    }
  }
  console.timeLog('stap1: relevanteInschrijvingen');
  console.timeEnd('stap1: relevanteInschrijvingen');
  const result = eters
    .map((e) => {
      console.time('stap2: keerGegeten');
      const keerMeegegeten = relevanteInschrijvingen.reduce((acc, k) => {
        return (
          acc +
          (k.GebruikerID === e.GebruikerID &&
          momentenMap.get(k.MomentID)?.Datum <= vandaag
            ? 1
            : 0)
        );
      }, 0);
      console.timeLog('stap2: keerGegeten');
      console.timeEnd('stap2: keerGegeten');
      console.time('stap3: kookPunten');
      // Dit is het langzaamste stukje code, vandaar de for loop ipv .map() .filter() etc...
      let kookPunten = 0;
      for (let i = 0; i < relevanteInschrijvingen.length; i++) {
        const ins = relevanteInschrijvingen[i];
        if (momentenMap.get(ins.MomentID)?.Kok === e.GebruikerID) {
          kookPunten++;
        }
      }

      console.timeLog('stap3: kookPunten');
      console.timeEnd('stap3: kookPunten');
      return { id: e.GebruikerID, saldo: kookPunten - keerMeegegeten };
    })
    .sort((a, b) => (a.saldo > b.saldo ? 1 : -1));
  console.timeLog('Kooksaldo berekening');
  console.timeEnd('Kooksaldo berekening');
  return result;
};

const berekenKokEnAfwas = (
  moment: kookploeg_momenten,
  kookVolgorde: { id: number }[],
  afwasVolgorde: { id: number }[]
) => {
  const kok = moment.Kok ?? kookVolgorde[0]?.id ?? null;
  const reserveKok = kookVolgorde.find((e) => e.id !== kok)?.id ?? null;
  const afwas1 =
    moment.Afwas1 ?? afwasVolgorde.find((e) => e.id !== kok)?.id ?? null;
  const afwas2 =
    moment.Afwas2 ??
    afwasVolgorde.find((e) => e.id !== kok && e.id !== afwas1)?.id ??
    null;
  const reserveAfwas =
    afwasVolgorde.find(
      (e) => e.id !== kok && e.id !== afwas1 && e.id !== afwas2
    )?.id ?? null;
  return {
    kok,
    reserveKok,
    afwas1,
    afwas2,
    reserveAfwas,
  };
};
