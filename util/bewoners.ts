import sequelize from '@/lib/sequelize';
import { bewoners } from '@/models/bewoners';
import { bewonersCache } from './cache';

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
