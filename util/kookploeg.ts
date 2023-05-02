import { kookploeg_gebruikers } from '@/models/kookploeg_gebruikers';
import { kookploegGebruikersCache, kookploegMomentenCache } from './cache';
import sequelize from '@/lib/sequelize';
import { kookploeg_momenten } from '@/models/kookploeg_momenten';
import { kookploeg_eters } from '@/models/kookploeg_eters';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';

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

export const getKookploegMomenten = async (kp_id: number) => {
  const cached = await kookploegMomentenCache.get(
    `kookploeg_momenten_${kp_id}`
  );
  if (cached) {
    console.log('returning cached kookploeg_momenten');
    return cached;
  } else {
    kookploeg_momenten.initModel(sequelize);
    const result = await kookploeg_momenten.findAll({
      where: { KookploegID: kp_id },
      order: [['ID', 'DESC']],
      raw: true,
    });
  }
};

export const getKookploegEters = async (moment_id: number) => {
  kookploeg_eters.initModel(sequelize);
  const result = await kookploeg_eters.findAll({
    where: { MomentID: moment_id },
    raw: true,
  });
  return result;
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

export const getKookploegMomentEnEters = async (
  kp_id: number,
  datum: Dayjs
) => {
  const moment = await getKookploegMoment(kp_id, datum);
  if (isNil(moment)) {
    return { moment: null, eters: null };
  } else {
    const eters = await getKookploegEters(moment.ID);
    const gebruikers = await getKookploegGebruikers();
    return {
      moment,
      eters: eters
        .map((eter) => {
          const naam = gebruikers.find((g) => g.ID === eter.GebruikerID)?.Naam;
          const isKok = eter.GebruikerID === moment.Kok;
          const isAfwasser1 = eter.GebruikerID === moment.Afwas1;
          const isAfwasser2 = eter.GebruikerID === moment.Afwas2;
          return { naam, isKok, isAfwasser1, isAfwasser2, ...eter };
        })
        .sort((a, b) => {
          return a.isKok
            ? -1
            : a.isAfwasser1 && !b.isKok
            ? -1
            : a.isAfwasser2 && !b.isKok && !b.isAfwasser1
            ? -1
            : 0;
        }),
    };
  }
};
