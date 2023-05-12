'use client';
import { LinkButton } from '@/components/Button/LinkButton';
import { Spinner } from '@/components/Spinner';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return (
      <button disabled className='btn-primary btn-sm '>
        <Spinner />
      </button>
    );
  }
  if (session) {
    return (
      <>
        <div className='text-black h-6 font-semibold pr-2'>
          {session.user.naam} -
        </div>
        <LinkButton
          color='black'
          className={' h-8 px-4'}
          onClick={() => signOut()}
        >
          Uitloggen
        </LinkButton>
      </>
    );
  }
  return (
    <>
      <LinkButton
        color='black'
        className={'text-black h-6'}
        onClick={() => signIn()}
      >
        Inloggen
      </LinkButton>
    </>
  );
}
