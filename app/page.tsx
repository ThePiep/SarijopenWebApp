import { ExampleCard } from '@/components/Card/ExampleCard';
import { KPCard } from '@/components/Card/KPCard';
import { QuotesCard } from '@/components/Card/QuotesCard';

export default function HomePage() {
  return (
    <main className='text-slate-700 '>
      <div className='grid grid-flow-row-dense grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6'>
        <KPCard colSpan={2} title='KP Cool' color='red' />
        <KPCard colSpan={1} title='KP Hot' color='orange' />
        <KPCard colSpan={1} title='Weekend KP' color='yellow' />
        <ExampleCard colSpan={1} title={'Voorbeeld'} color='green' />
        <ExampleCard colSpan={1} title={'Voorbeeld'} color='blue' />
        <ExampleCard colSpan={1} title={'Voorbeeld'} color='purple' />
        <QuotesCard colSpan={1} color='pink' />
        <ExampleCard colSpan={3} title={'Voorbeeld'} color='purple' />
        <ExampleCard colSpan={3} title={'Voorbeeld'} color='red' />
        <ExampleCard colSpan={4} title={'Voorbeeld'} color='orange' />
        <ExampleCard colSpan={2} title={'Voorbeeld'} color='yellow' />
        <ExampleCard colSpan={1} title={'Voorbeeld'} color='orange' />
        <ExampleCard colSpan={2} title={'Voorbeeld'} color='blue' />
        <ExampleCard colSpan={1} title={'Voorbeeld'} color='orange' />
      </div>
    </main>
  );
}
