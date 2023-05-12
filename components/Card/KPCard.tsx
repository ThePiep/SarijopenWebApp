export const revalidate = 60;

import { getKookploegMomentEnEters } from '@/util/kookploeg';
import { Card, CardProps } from './Card';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import dayjs, { Dayjs } from 'dayjs';
import { TbChefHat } from 'react-icons/tb';
import { GiSoap } from 'react-icons/gi';
import Link from 'next/link';
import { FaArrowDown } from 'react-icons/fa';
import { KPCardActions } from './KPCardActions';
import { getToken } from 'next-auth/jwt';

export type KookploegId = 1 | 2 | 3;

const kookploegRecord: Record<KookploegId, string> = {
  1: 'KP Cool',
  2: 'KP Hot',
  3: 'Weekend KP',
};

interface Props extends Omit<CardProps, 'title'> {
  kookploeg: KookploegId;
  showForm?: boolean;
  showDetails?: boolean;
  datum?: Dayjs;
}

export const KPCard = async ({
  kookploeg,
  showDetails = false,
  datum = dayjs(),
  ...props
}: Props) => {
  console.log({ datumKPCard: datum.format('YYYY-MM-DD') });

  const extraCols = [
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
  ];
  const showExtra = extraCols.some((el) => props.className?.includes(el));

  const { moment, eters } =
    (await getKookploegMomentEnEters(kookploeg, datum)) || {};

  const kok = eters?.find((e) => e.isKok);
  const voorspeldeKok = eters?.find((e) => e.isVoorspeldeKok);
  const voorspeldeReserveKok = eters?.find((e) => e.isVoorspeldeReserveKok);
  const afwas1 = eters?.find((e) => e.isAfwas1);
  const voorspeldeAfwas1 = eters?.find((e) => e.isVoorspeldeAfwas1);
  const afwas2 = eters?.find((e) => e.isAfwas2);
  const voorspeldeAfwas2 = eters?.find((e) => e.isVoorspeldeAfwas2);
  const voorspeldeReserveAfwas = eters?.find((e) => e.isVoorspeldeReserveAfwas);
  const restEters = eters?.filter(
    (e) => !e.isKok && !e.isAfwas1 && !e.isAfwas2
  );

  return (
    <Card
      {...props}
      title={kookploegRecord[kookploeg]}
      titleIcon={moment && moment.Gesloten ? <RxLockClosed /> : <RxLockOpen1 />}
      lockHeight={!showDetails}
      href={
        showDetails
          ? undefined
          : `/kookploeg/${kookploeg}/${datum.format('YYYY-MM-DD')}`
      }
    >
      <div className='flex '>
        {showExtra && (
          <div className='mt-2 flex-grow'>
            {eters && eters.length ? (
              eters?.map((eter) => (
                <div
                  key={eter.ID}
                  className={`badge border-0 ${
                    eter.isKok || eter.isVoorspeldeKok
                      ? 'bg-pblue-800 text-pblue-100 shadow-lg '
                      : eter.isAfwas1 ||
                        eter.isAfwas2 ||
                        eter.isVoorspeldeAfwas1 ||
                        eter.isVoorspeldeAfwas2
                      ? 'bg-porange-900 text-porange-100'
                      : 'text-gray-200'
                  } mr-0.5 `}
                >
                  {`${eter.naam}${
                    eter.isVoorspeldeKok ||
                    eter.isVoorspeldeAfwas1 ||
                    eter.isVoorspeldeAfwas2
                      ? '!?'
                      : ''
                  }`}
                  {eter.isKok && <TbChefHat className='ml-0.5' />}
                  {(eter.isAfwas1 || eter.isAfwas2) && (
                    <GiSoap className='ml-1' />
                  )}
                </div>
              ))
            ) : (
              <>Er zijn helaas geen eters voor deze dag ingetekent </>
            )}
          </div>
        )}
        <div
          className={`grid grid-cols-1 place-items-center align-middle justify-center mt-4 mb-4 h-16 ${
            showExtra ? ' mr-4' : 'flex-grow'
          }`}
        >
          <div className='stat-value text-secondary'>
            {eters ? eters.length : 0}
          </div>
          <div className='stat-desc text-secondary'>Eters</div>
        </div>
      </div>

      <p className={'overflow-auto'}>
        {JSON.stringify({
          kok: kok?.naam,
          voorspeldeKok: voorspeldeKok?.naam,
          voorspeldeReserveKok: voorspeldeReserveKok?.naam,
          afwas1: afwas1?.naam,
          voorspeldeAfwas1: voorspeldeAfwas1?.naam,
          afwas2: afwas2?.naam,
          voorspeldeAfwas2: voorspeldeAfwas2?.naam,
          voorspeldeReserveAfwas: voorspeldeReserveAfwas?.naam,
        })}
      </p>

      {showDetails && (
        <KPCardActions
          kok={kok}
          eters={eters}
          moment={moment}
          kookploeg_id={kookploeg}
          day_string={datum.format('YYYY-MM-DD')}
        />
      )}
    </Card>
  );
};
