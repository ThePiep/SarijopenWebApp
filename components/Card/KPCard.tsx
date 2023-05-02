export const revalidate = 60;

import { getKookploegMomentEnEters } from '@/util/kookploeg';
import { Card, CardProps } from './Card';
import { FaBan } from 'react-icons/fa';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import dayjs from 'dayjs';
import { TbChefHat } from 'react-icons/tb';
import { GiSoap } from 'react-icons/gi';

export type kookploegId = 1 | 2 | 3;

const kookploegRecord: Record<kookploegId, string> = {
  1: 'KP Cool',
  2: 'KP Hot',
  3: 'Weekend KP',
};

interface Props extends Omit<CardProps, 'title'> {
  showForm?: boolean;
  kookploeg: kookploegId;
}

export const KPCard = async ({ kookploeg, ...props }: Props) => {
  const showExtra = props.colSpan && props.colSpan > 1;

  const { moment, eters } = await getKookploegMomentEnEters(
    kookploeg,
    dayjs().subtract(30, 'days')
  );

  return (
    <Card
      {...props}
      title={kookploegRecord[kookploeg]}
      titleIcon={false ? <RxLockClosed /> : <RxLockOpen1 />}
    >
      <div className='grid grid-cols-12'>
        {showExtra && (
          <div className='col-span-8 mt-2'>
            {eters?.map((eter) => (
              <div
                key={eter.ID}
                className={`badge border-0 ${
                  eter.isKok
                    ? 'bg-pblue-800'
                    : eter.isAfwasser1 || eter.isAfwasser2
                    ? 'bg-porange-800'
                    : ''
                } mr-0.5 `}
              >
                {`${eter.naam}`}
                {eter.isKok && <TbChefHat className='ml-0.5' />}
                {(eter.isAfwasser1 || eter.isAfwasser2) && (
                  <GiSoap className='ml-1' />
                )}
              </div>
            ))}
          </div>
        )}
        <div
          className={`stat place-items-center ${
            showExtra ? 'col-span-4' : 'col-span-12'
          }`}
        >
          <div className='stat-value text-secondary'>
            {eters ? eters.length : 0}
          </div>
          <div className='stat-desc text-secondary'>Eters ↗︎ 40 (2%)</div>
        </div>
      </div>
    </Card>
  );
};
