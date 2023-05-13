import sequelize from '@/lib/sequelize';
import { bewoners } from '@/models/bewoners';
import { bewonersCache } from './cache';
import { rechten } from '@/models/rechten';
import { Rechten } from '@/pages/api/auth/[...nextauth]';

export const getBewoners = async (): Promise<bewoners[]> => {
  const cachedBewoners = await bewonersCache.get('bewoners');
  if (cachedBewoners) {
    console.log('returning cached kookploeg_gebruikers');
    return cachedBewoners;
  } else {
    bewoners.initModel(sequelize);
    const result = await bewoners.findAll({
      attributes: ['id', 'naam', 'kamer', 'huidig', 'bierlijst'],
      order: [['id', 'ASC']],
      raw: true,
    });
    bewonersCache.put('bewoners', result, 1000 * 60 * 30); // 30 minutes
    console.log('new bewoners cache created');
    return result;
  }
};

export const getRechtenVoorGebruiker = async (bewonerID: number) => {
  rechten.initModel(sequelize);
  const _rechten = await rechten.findAll({
    attributes: ['systeem'],
    where: { bewoner_id: bewonerID },
    raw: true,
  });

  const result = _rechten
    .map((r) => {
      if (Object.values(Rechten).includes(r.systeem)) {
        const res: Rechten = (<any>Rechten)[r.systeem];
        return res;
      } else {
        return null;
      }
    })
    .filter((r): r is Rechten => r !== null);
  return result;
};
