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

export const QuotesCard = async ({ ...props }: CardProps) => {
  const count = await getCount();

  return (
    <Link href='/quotes'>
      <Card {...props} title={'Citaten boek'}>
        <div className='stats bg-inherit text-inherit'>
          <div className='stat place-items-center'>
            <div className='stat-value'>{count}</div>
            <div className='stat-desc text-inherit'>Sinds Oktober 2000</div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
