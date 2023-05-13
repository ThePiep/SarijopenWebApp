export const revalidate = 60;

import { getKookploegMomentEnEters } from '@/util/kookploeg';
import { Card, CardProps } from './Card';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import updateLocale from 'dayjs/plugin/updateLocale';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/nl';
import { TbChefHat } from 'react-icons/tb';
import { GiSoap } from 'react-icons/gi';
import { KPCardActions } from './KPCardActions';
import { Rechten, authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
dayjs.extend(updateLocale);

dayjs.extend(calendar);

dayjs.extend(customParseFormat);

dayjs.updateLocale('nl', {
  calendar: {
    lastDay: '[Gisteren]',
    sameDay: '[Vandaag]',
    nextDay: '[Morgen]',
    lastWeek: '[Afgelopen] dddd',
    nextWeek: 'dddd',
    sameElse: 'DD/MM/YYYY',
  },
});

dayjs.locale('nl');

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

  const { user } = (await getServerSession(authOptions)) ?? {};

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

  const vandaag = dayjs();

  const kok = eters?.find((e) => e.isKok);
  const voorspeldeKok = eters?.find((e) => e.isVoorspeldeKok);
  const voorspeldeReserveKok = eters?.find((e) => e.isVoorspeldeReserveKok);
  const afwas1 = eters?.find((e) => e.isAfwas1);
  const voorspeldeAfwas1 = eters?.find((e) => e.isVoorspeldeAfwas1);
  const afwas2 = eters?.find((e) => e.isAfwas2);
  const voorspeldeAfwas2 = eters?.find((e) => e.isVoorspeldeAfwas2);
  const voorspeldeReserveAfwas = eters?.find((e) => e.isVoorspeldeReserveAfwas);

  const geslotenOfTeLaat =
    (moment && moment.Gesloten) ||
    datum.isBefore(vandaag, 'day') ||
    (datum.isSame(vandaag, 'day') && datum.isAfter(vandaag.set('h', 14), 'h'));

  // 18:00:00 is de default tijd in de database, wanneer de seconde afwijkt dan is de tijd handmatig gezet.
  const ETA =
    moment && moment.Tijd !== '18:00:00'
      ? dayjs(moment?.Tijd, 'HH:mm:ss').format('HH:mm')
      : '--';

  return (
    <Card
      {...props}
      title={kookploegRecord[kookploeg]}
      afterTitle={showDetails ? `${datum.calendar()} om ${ETA}` : undefined}
      titleIcon={geslotenOfTeLaat ? <RxLockClosed /> : <RxLockOpen1 />}
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
                  {(eter.isVoorspeldeKok && !eter.isKok) ||
                  (eter.isVoorspeldeAfwas1 && !eter.isAfwas1) ||
                  (eter.isVoorspeldeAfwas2 && !eter.isAfwas2)
                    ? `(${eter.naam})?`
                    : `${eter.naam}`}
                  {eter.isKok && <TbChefHat className='ml-0.5' />}
                  {(eter.isAfwas1 ||
                    eter.isAfwas2 ||
                    eter.isVoorspeldeAfwas1 ||
                    eter.isVoorspeldeAfwas2) && <GiSoap className='ml-1' />}
                </div>
              ))
            ) : (
              <>Er zijn helaas geen eters voor deze dag ingetekent </>
            )}
          </div>
        )}
        <div
          className={`grid grid-cols-1 place-items-center align-middle justify-center m-4 h-16 
          ${showDetails ? '' : 'flex-grow'}`}
        >
          <div className='stat-value text-secondary'>
            {eters ? eters.length : 0}
          </div>
          <div className='stat-desc text-secondary'>Eters</div>
        </div>
      </div>

      {showDetails && user && (
        <>
          {user.rechten.includes(Rechten.webmaster) && (
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
          )}
          <KPCardActions
            kok={kok}
            eters={eters}
            moment={moment}
            kookploeg_id={kookploeg}
            day_string={datum.format('YYYY-MM-DD')}
            gebruiker={user}
          />
        </>
      )}
    </Card>
  );
};
