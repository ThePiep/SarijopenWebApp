import { ExampleCard } from '@/components/Card/ExampleCard';
import { KPCard } from '@/components/Card/KPCard';
import { NieuwsCard } from '@/components/Card/NieuwsCard';
import { QuotesCard } from '@/components/Card/QuotesCard';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function HomePage() {
  const experimenteel = true;
  const kookploegRender = () => {
    const day = dayjs().subtract(30, 'days').day();
    const isWeekend = day === 0 || day === 5 || day === 6;
    const gebruikerKP: number = 1; //TODO: get from db
    const cool = (
      <KPCard
        colSpan={
          !isWeekend
            ? // && gebruikerKP === 1
              2
            : 1
        }
        color='orange'
        kookploeg={1}
      />
    );
    const hot = (
      <KPCard
        colSpan={
          !isWeekend
            ? // && gebruikerKP === 2
              2
            : 1
        }
        color='orange'
        kookploeg={2}
      />
    );
    const wk = (
      <KPCard colSpan={isWeekend ? 2 : 1} color='orange' kookploeg={3} />
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
      <div className='grid grid-flow-row-dense grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6'>
        {kookploegRender()}
        <NieuwsCard colSpan={12} colSpanMd={4} colSpanXl={6} />
        {experimenteel && (
          <>
            <ExampleCard colSpan={1} title={'Voorbeeld'} color='green' />
            <ExampleCard colSpan={1} title={'Voorbeeld'} color='blue' />
            <ExampleCard colSpan={1} title={'Voorbeeld'} color='purple' />
          </>
        )}
        <QuotesCard colSpan={1} color='pink' />
        {experimenteel && (
          <>
            <ExampleCard
              colSpan={2}
              title={'Uitgelichte bewoner'}
              color='purple'
              text='Bewoner foto + verhaaltje'
            />
            <ExampleCard
              colSpan={2}
              title={'Het Weer'}
              text={
                'Beschrijving van het weer (misschien met die leipe plaatjes van de originele website'
              }
              color='red'
            />
            <ExampleCard
              colSpan={1}
              title={'Random Jopen'}
              text={'Je weet wel wat ik bedoel'}
              color='orange'
            />
            <ExampleCard
              colSpan={2}
              title={'Bierlijst'}
              text='Link naar bierlijst'
              color='yellow'
            />
            <ExampleCard
              colSpan={1}
              title={'Foto album'}
              text='Random foto uit fotoalbum (link naar google photos(?))'
              color='orange'
            />
            <ExampleCard colSpan={2} title={'Voorbeeld'} color='blue' />
            <ExampleCard colSpan={1} title={'Voorbeeld'} color='orange' />
          </>
        )}
      </div>
    </main>
  );
}
