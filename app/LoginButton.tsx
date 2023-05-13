import { LinkButton } from '@/components/Button/LinkButton';
import { LogoutButton } from '@/components/nav/LogoutButton';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';

export default async function LoginButton() {
  const { user } = (await getServerSession(authOptions)) ?? {};

  if (user) {
    return (
      <>
        <LogoutButton />
      </>
    );
  } else {
    return <>Error</>;
  }
}
