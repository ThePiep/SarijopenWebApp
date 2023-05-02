export const revalidate = 60;

import Link from 'next/link';
import { Card, CardProps } from './Card';
import { FaBan } from 'react-icons/fa';
import { getServerSession } from 'next-auth';
import { uitspraken } from '@/models/uitspraken';
import sequelize from '@/lib/sequelize';

const getCount = async () => {
  uitspraken.initModel(sequelize);
  return await uitspraken.count();
};

export const QuotesCard = async ({ ...props }: Omit<CardProps, 'title'>) => {
  const count = await getCount();

  return (
    <Link href='/quotes'>
      <Card {...props} title={'Citatenboek'}>
        <div className='flex justify-center items-center h-full '>
          <div className='text-center'>
            <div className='text-3xl font-extrabold'>{count}</div>
            <div className='text-2xs mt-2'>
              Dwaze uitspraken sinds Oktober 2000
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
