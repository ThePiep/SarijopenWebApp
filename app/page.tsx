// 'use client';
// Dit moet uiteindelijk weer een server component worden
import { ExampleCard } from '@/components/Card/ExampleCard';
import { KPCard } from '@/components/Card/KPCard';
import { NieuwsCard } from '@/components/Card/NieuwsCard';
import { QuotesCard } from '@/components/Card/QuotesCard';
import { extendedColors } from '@/lib/tailwind-types';
import dayjs from 'dayjs';

export default function HomePage() {
  const experimenteel = true;
  const kookploegRender = () => {
    const weekendDays = [0, 5, 6];
    const isWeekend = weekendDays.includes(dayjs().subtract(30, 'days').day());
    const gebruikerKP: number = 1; //TODO: get from db
    const cool = (
      <KPCard
        className={`${isWeekend ? 'col-span-1' : 'col-span-2'} `}
        color='bg-porange-100'
        kookploeg={1}
      />
    );
    const hot = (
      <KPCard
        className={`${isWeekend ? 'col-span-1' : 'col-span-2'} `}
        color='bg-porange-100'
        kookploeg={2}
      />
    );
    const wk = (
      <KPCard
        className={`${isWeekend ? 'col-span-2' : 'col-span-1'} `}
        color='bg-porange-100'
        kookploeg={3}
      />
    );
    if (isWeekend)
      return (
        <>
          {wk}
          {cool}
          {hot}
        </>
      );
    else {
      if (gebruikerKP === 1) {
        return (
          <>
            {cool}
            {hot}
            {wk}
          </>
        );
      } else {
        return (
          <>
            {hot}
            {cool}
            {wk}
          </>
        );
      }
    }
  };
  return (
    <main className='text-slate-900 '>
      <div className='grid grid-flow-row-dense grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6'>
        {kookploegRender()}
        <NieuwsCard
          className='col-span-2 lg:col-span-4 xl:col-span-6 '
          color='bg-pgreen-100'
        />
        {experimenteel && (
          <>
            <ExampleCard
              className='col-span-1 '
              color='bg-pgreen-100'
              title={'Voorbeeld'}
            />
            <ExampleCard
              className='col-span-1 '
              color='bg-pblue-100'
              title={'Voorbeeld'}
            />
            <ExampleCard
              className='col-span-1 '
              color='bg-pgreen-100'
              title={'Voorbeeld'}
            />
          </>
        )}
        <QuotesCard color='bg-pblue-100' className='col-span-1 ' />
        {experimenteel && (
          <>
            <ExampleCard
              className='col-span-2 '
              color='bg-pocean-50'
              title={'Uitgelichte bewoner'}
              text='Bewoner foto + verhaaltje'
            />
            <ExampleCard
              className='col-span-2 '
              color='bg-pocean-50'
              title={'Het Weer'}
              text={
                'Beschrijving van het weer (misschien met die leipe plaatjes van de originele website'
              }
            />
            <ExampleCard
              className='col-span-1 '
              color='bg-porange-100'
              title={'Random Jopen'}
              text={'Je weet wel wat ik bedoel'}
            />
            <ExampleCard
              className='col-span-2 '
              color='bg-pgreen-100'
              title={'Bierlijst'}
              text='Link naar bierlijst'
            />
            <ExampleCard
              className='col-span-1 '
              color='bg-porange-100'
              title={'Foto album'}
              text='Random foto uit fotoalbum (link naar google photos(?))'
            />
            <ExampleCard
              className='col-span-2 '
              color='bg-pblue-100'
              title={'Voorbeeld'}
            />
            <ExampleCard
              className='col-span-1 '
              color='bg-porange-100'
              title={'Voorbeeld'}
            />
          </>
        )}
      </div>
    </main>
  );
}
