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
import { isNil } from 'lodash';
import { getVoorspellingMoment } from './kookploeg-voorspellingen';

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
