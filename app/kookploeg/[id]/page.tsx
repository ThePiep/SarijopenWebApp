import { KPCard, kookploegId } from '@/components/Card/KPCard';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  const kookploegId = parseInt(params.id) as kookploegId;
  if (kookploegId !== 1 && kookploegId !== 2 && kookploegId !== 3) {
    redirect('/');
  }
  return <KPCard kookploeg={kookploegId} colSpan={2} />;
}
