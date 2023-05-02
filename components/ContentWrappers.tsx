import { useSession } from 'next-auth/react';

export const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  return (
    <div className={'container mx-auto px-2 pt-24 pb-6 '}>
      {status === 'loading' ? (
        'Loading...'
      ) : session ? (
        children
      ) : (
        <>Log in om deze pagina te bekijken</>
      )}
    </div>
  );
};
