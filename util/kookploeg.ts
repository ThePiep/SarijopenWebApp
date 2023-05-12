import { kookploeg_gebruikers } from '@/models/kookploeg_gebruikers';
import { kookploegGebruikersCache, kookploegMomentenCache } from './cache';
import sequelize from '@/lib/sequelize';
import { kookploeg_momenten } from '@/models/kookploeg_momenten';
import {
  kookploeg_eters,
  kookploeg_etersAttributes,
} from '@/models/kookploeg_eters';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { isNil, isNull, isUndefined } from 'lodash';
import { Op, Sequelize } from 'sequelize';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const getKookploegGebruikers = async () => {
  const cached = await kookploegGebruikersCache.get('kookploeg_gebruikers');
  if (cached) {
    console.log('returning cached kookploeg_gebruikers');
    return cached;
  } else {
    kookploeg_gebruikers.initModel(sequelize);
    const result = await kookploeg_gebruikers.findAll({
      attributes: ['ID', 'Naam', 'actief'],
      order: [['ID', 'DESC']],
    });
    kookploegGebruikersCache.put(
      'kookploeg_gebruikers',
      result,
      1000 * 60 * 30
    ); // cache for 30 minutes
    console.log('returning fresh kookploeg_gebruikers');
    return result; // return fresh data from db.
  }
};

export const getKookploegGebruikerIdByName = async (naam: string) => {
  const gebruikers = await getKookploegGebruikers();
  return gebruikers.find((g) => g.Naam.toLowerCase() === naam.toLowerCase())
    ?.ID;
};

export const getKookploegVoorkeurByGebruikerId = async (
  gebruiker_id: number
) => {
  kookploeg_gebruikers.initModel(sequelize);
  const result = await kookploeg_gebruikers.findOne({
    where: { ID: gebruiker_id },
    attributes: ['voorkeur'],
  });
  return result?.voorkeur;
};

export const getKookploegMoment = async (kp_id: number, datum: Dayjs) => {
  kookploeg_momenten.initModel(sequelize);
  const result = await kookploeg_momenten.findAll({
    where: { KookploegID: kp_id, Datum: datum.format('YYYY-MM-DD') },
    raw: true,
  });
  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
};

export const getKookploegMomenten = async (kp_id: number) => {
  kookploeg_momenten.initModel(sequelize);
  const result = await kookploeg_momenten.findAll({
    where: { KookploegID: kp_id },
    order: [['ID', 'DESC']],
    raw: true,
  });
};

export const getKookploegEters = async (moment_id: number) => {
  kookploeg_eters.initModel(sequelize);
  const result = await kookploeg_eters.findAll({
    where: { MomentID: moment_id },
    raw: true,
  });
  return result;
};

export interface KookploegMomentEter extends kookploeg_etersAttributes {
  naam: string;
  isKok: boolean;
  isVoorspeldeKok: boolean;
  isVoorspeldeReserveKok: boolean;
  isAfwas1: boolean;
  isVoorspeldeAfwas1: boolean;
  isAfwas2: boolean;
  isVoorspeldeAfwas2: boolean;
  isVoorspeldeReserveAfwas: boolean;
}

export const getKookploegMomentEnEters = async (
  kpID: number,
  datum: Dayjs
): Promise<
  { moment: kookploeg_momenten; eters: KookploegMomentEter[] } | undefined
> => {
  const moment = await getKookploegMoment(kpID, datum);
  if (isNil(moment)) {
    console.log(
      `Moment in kookploeg ${kpID} op ${datum.format(
        'YYYY-MM-DD'
      )} bestaat nog niet`
    );
    return undefined;
  } else {
    const eters = await getKookploegEters(moment.ID);
    const gebruikers = await getKookploegGebruikers();
    console.time('Totaal voorspelling ophalen');
    const voorspelling = await getVoorspellingMoment(moment.ID);
    console.timeLog('Totaal voorspelling ophalen');
    console.timeEnd('Totaal voorspelling ophalen');

    return {
      moment,
      eters: eters
        .map((eter) => {
          const naam =
            gebruikers.find((g) => g.ID === eter.GebruikerID)?.Naam ??
            `Gebruiker ${eter.GebruikerID} `;
          const isKok = eter.GebruikerID === moment.Kok;
          const isVoorspeldeKok = eter.GebruikerID === voorspelling?.kok;
          const isVoorspeldeReserveKok =
            eter.GebruikerID === voorspelling?.reserveKok;
          const isAfwas1 = eter.GebruikerID === moment.Afwas1;
          const isVoorspeldeAfwas1 = eter.GebruikerID === voorspelling?.afwas1;
          const isAfwas2 = eter.GebruikerID === moment.Afwas2;
          const isVoorspeldeAfwas2 = eter.GebruikerID === voorspelling?.afwas2;
          const isVoorspeldeReserveAfwas =
            eter.GebruikerID === voorspelling?.reserveAfwas;
          return {
            naam,
            isKok,
            isVoorspeldeKok,
            isVoorspeldeReserveKok,
            isAfwas1,
            isVoorspeldeAfwas1,
            isAfwas2,
            isVoorspeldeAfwas2,
            isVoorspeldeReserveAfwas,
            ...eter,
          };
        })
        .sort((a, b) => (a.naam > b.naam ? 1 : -1)) // Sorteer eerst op naam
        .sort((a, b) => {
          // Dan sorteren op kok/afwas1/afwas2
          return a.isKok || a.isVoorspeldeKok
            ? 1
            : (a.isAfwas1 || a.isVoorspeldeAfwas1) &&
              !b.isKok &&
              !b.isVoorspeldeKok
            ? 1
            : (a.isAfwas2 || a.isVoorspeldeAfwas2) &&
              !b.isKok &&
              !b.isVoorspeldeKok &&
              !b.isAfwas1 &&
              !b.isVoorspeldeAfwas1
            ? 1
            : -1;
        })
        .reverse(),
    };
  }
};

const DAGEN_VOORUIT = 5; // Op dit moment kijken KP Cool, KP Hot en KP Weekend allemaal 5 dagen vooruit.
const SALDO_KPS = [3]; // TODO: get from db, voor nu Weekend KP
const LAATSTGEKOOKT_KPS = [1, 2]; // TODO: get from db, voor nu KP Cool en KP Hot

const getVoorspellingMoment = async (
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

  kookploeg_eters.initModel(sequelize);

  // Eters voor dit specifieke moment
  const eters = (
    await kookploeg_eters.findAll({
      where: {
        MomentID: moment.ID,
      },
    })
  ).filter(
    // Filter away any duplicates
    (eter, index, array) =>
      array.findIndex((e) => e.GebruikerID === eter.GebruikerID) === index
  );

  console.time('Momenten ophalen');
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

  console.timeLog('Momenten ophalen');
  console.timeEnd('Momenten ophalen');

  let inschrijvingen: kookploeg_eters[] | undefined = undefined;
  if (SALDO_KPS.includes(moment.KookploegID) && !_inschrijvingen) {
    inschrijvingen = await kookploeg_eters.findAll({
      where: {
        // Tijdstempel: { [Op.gt]: '2012-09-13 00:00:00' },
        MomentID: { [Op.gt]: 1797 }, // Kookmoment op 2012-09-13, het startmoment van WeekendKP (uit database). We nemen alleen mee van na dit moment. TODO: Haal dit uit database
      },
      raw: true,
    });
  }

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
    console.time('stap2: laatst gekookt');
    const laagsteKookSaldo = berekenKookSaldos(eters, momenten, inschrijvingen);
    console.timeLog('stap2: laatst gekookt');
    console.timeEnd('stap2: laatst gekookt');
    console.time('stap3: laatst afgewassen');
    const laatstAfgewassen = berekenAfwasVolgorde(eters, momenten);
    console.timeLog('stap3: laatst afgewassen');
    console.timeEnd('stap3: laatst afgewassen');

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
  console.time('stap1: relevanteInschrijvingen');
  // Dit kan veel sneller met een joint query...
  // Waarschijnlijk ook mooi op te lossen met een new Map voor momenten
  let relevanteInschrijvingen: kookploeg_eters[] = [];
  for (let i = 0; i < alleInschrijvingen.length; i++) {
    const ins = alleInschrijvingen[i];
    for (let j = 0; j < momenten.length; j++) {
      const m = momenten[j];
      if (m.ID === ins.MomentID) {
        relevanteInschrijvingen.push(ins);
        break;
      }
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
          dayjs(
            momenten.find((m) => m.ID === k.MomentID)?.Datum
          ).isSameOrBefore(dayjs(), 'day')
            ? 1
            : 0)
        );
      }, 0);
      console.timeLog('stap2: keerGegeten');
      console.timeEnd('stap2: keerGegeten');
      console.time('stap3: kookPunten');
      // Dit is het langzaamste stukje code, vandaar de for loop ipv .map() .filter() etc...
      let kookPunten = 0;
      for (let i = 0; i < momenten.length; i++) {
        const m = momenten[i];
        if (m.Kok === e.GebruikerID) {
          for (let j = 0; j < relevanteInschrijvingen.length; j++) {
            const ins = relevanteInschrijvingen[j];
            if (ins.MomentID === m.ID) {
              kookPunten++;
            }
          }
        }
      }
      console.timeLog('stap3: kookPunten');
      console.timeEnd('stap3: kookPunten');
      // console.log({
      //   id: e.GebruikerID,
      //   kookPunten,
      //   keerMeegegeten,
      //   saldo: kookPunten - keerMeegegeten,
      // });
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

export const tekenInVoorMoment = async (
  momentID: number,
  gebruikerID: number
) => {
  kookploeg_eters.initModel(sequelize);

  const eter = await kookploeg_eters.findOne({
    where: { GebruikerID: gebruikerID, MomentID: momentID },
  });
  await kookploeg_eters.create({
    GebruikerID: gebruikerID,
    MomentID: momentID,
    Tijdstempel: new Date(),
    Gast: eter ? 1 : 0, // Zet Gast op 1 als wanneer huisgenoot al is ingetekend
  });
};

export const tekenInVoorKpOpDatum = async (
  gebruikerID: number,
  kookploegID: number,
  datum: Dayjs
) => {
  kookploeg_momenten.initModel(sequelize);
  const moment = await kookploeg_momenten.findOne({
    where: {
      KookploegID: kookploegID,
      Datum: datum.format('YYYY-MM-DD'),
    },
  });
  if (moment) {
    // Moment bestaat al
    await tekenInVoorMoment(moment.ID, gebruikerID);
  } else {
    // We maken een nieuwe moment
    const nieuwMoment = await kookploeg_momenten.create({
      KookploegID: kookploegID,
      Datum: datum.format('YYYY-MM-DD'),
    });
    await tekenInVoorMoment(nieuwMoment.ID, gebruikerID);
  }
};

export const tekenUitVoorMoment = async (
  momentID: number,
  gebruikerID: number
) => {
  kookploeg_eters.initModel(sequelize);
  await kookploeg_eters.destroy({
    limit: 1,
    where: {
      MomentID: momentID,
      GebruikerID: gebruikerID,
    },
  });
  valideerKokEnAfwassers(momentID);

  //Cleanup, wanneer laatste eter is uitgeschreven.
  const eters = await getKookploegEters(momentID);
  if (!eters.length) {
    kookploeg_momenten.initModel(sequelize);
    await kookploeg_momenten.destroy({
      limit: 1,
      where: {
        ID: momentID,
      },
    });
  }
};

export const valideerKokEnAfwassers = async (momentID: number) => {
  kookploeg_eters.initModel(sequelize);
  const eters = await kookploeg_eters.findAll({
    where: {
      MomentID: momentID,
    },
  });

  kookploeg_momenten.initModel(sequelize);
  const moment = await kookploeg_momenten.findOne({
    where: {
      ID: momentID,
    },
  });

  if (moment?.Kok && !eters.find((e) => moment.Kok === e.GebruikerID)) {
    removeKokFromKookploegMoment(momentID);
  }
  if (moment?.Afwas1 && !eters.find((e) => moment.Afwas1 === e.GebruikerID)) {
    removeAfwas1FromKookploegMoment(momentID);
  }
  if (moment?.Afwas2 && !eters.find((e) => moment.Afwas2 === e.GebruikerID)) {
    removeAfwas2FromKookploegMoment(momentID);
  }
};

export const removeKokFromKookploegMoment = async (
  momentID: kookploeg_momenten['ID']
) => {
  kookploeg_momenten.initModel(sequelize);
  await kookploeg_momenten.update(
    // @ts-ignore: Set Kok to null
    { Kok: null },
    {
      where: {
        ID: momentID,
      },
    }
  );
};

export const removeAfwas1FromKookploegMoment = async (
  momentID: kookploeg_momenten['ID']
) => {
  kookploeg_momenten.initModel(sequelize);
  await kookploeg_momenten.update(
    // @ts-ignore: Set Afwas1 to null
    { Afwas1: null },
    {
      where: {
        ID: momentID,
      },
    }
  );
};

export const removeAfwas2FromKookploegMoment = async (
  momentID: kookploeg_momenten['ID']
) => {
  kookploeg_momenten.initModel(sequelize);
  await kookploeg_momenten.update(
    // @ts-ignore: Set Afwas2 to null
    { Afwas2: null },
    {
      where: {
        ID: momentID,
      },
    }
  );
};

export const setKokForKookploegMoment = async (
  momentID: kookploeg_momenten['ID'],
  gebruikerID: kookploeg_gebruikers['ID']
) => {
  kookploeg_momenten.initModel(sequelize);
  await kookploeg_momenten.update(
    { Kok: gebruikerID },
    { where: { ID: momentID } }
  );
};

export const setAfwas1ForKookploegMoment = async (
  momentID: kookploeg_momenten['ID'],
  gebruikerID: kookploeg_gebruikers['ID']
) => {
  kookploeg_momenten.initModel(sequelize);
  await kookploeg_momenten.update(
    { Afwas1: gebruikerID },
    { where: { ID: momentID } }
  );
};

export const setAfwas2ForKookploegMoment = async (
  momentID: kookploeg_momenten['ID'],
  gebruikerID: kookploeg_gebruikers['ID']
) => {
  kookploeg_momenten.initModel(sequelize);
  await kookploeg_momenten.update(
    { Afwas2: gebruikerID },
    { where: { ID: momentID } }
  );
};
