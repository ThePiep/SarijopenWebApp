revalidate: 10;

import { LinkButton } from '@/components/Button/LinkButton';
import { KPCard, KookploegId, revalidate } from '@/components/Card/KPCard';
import updateLocale from 'dayjs/plugin/updateLocale';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import { redirect } from 'next/navigation';
import Link from 'next/link';

dayjs.extend(updateLocale);

dayjs.extend(calendar);

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

interface Props {
  params: {
    id: string;
    dag: string;
  };
}

export default function Page({ params }: Props) {
  const kookploegId = parseInt(params.id) as KookploegId;
  const dag = dayjs(params.dag, 'YYYY-MM-DD');

  const prevDay = dag.subtract(1, 'day');
  const nextDay = dag.add(1, 'day');

  console.log({ locale: [dag.locale(), prevDay.locale(), nextDay.locale] });

  if (
    !dag.isValid() ||
    (kookploegId !== 1 && kookploegId !== 2 && kookploegId !== 3)
  ) {
    redirect('/');
  }
  return (
    <>
      <div className='flex justify-between'>
        <LinkButton>
          <Link
            prefetch={false}
            href={`/kookploeg/${kookploegId}/${prevDay.format('YYYY-MM-DD')}`}
          >
            {prevDay.calendar()}
          </Link>
        </LinkButton>
        <LinkButton>
          <Link
            prefetch={false}
            href={`/kookploeg/${kookploegId}/${nextDay.format('YYYY-MM-DD')}`}
          >
            {nextDay.calendar()}
          </Link>
        </LinkButton>
      </div>
      <KPCard
        kookploeg={kookploegId}
        className='col-span-6'
        color='bg-porange-100'
        showDetails={true}
        datum={dag}
      />
    </>
  );
}
