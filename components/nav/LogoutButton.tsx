'use client';

import { signOut } from 'next-auth/react';
import { LinkButton } from '../Button/LinkButton';

export const LogoutButton = () => {
  return (
    <LinkButton color='black' className={' h-8 px-4'} onClick={() => signOut()}>
      <span className='text-porange-900'>[Uitloggen]</span>
    </LinkButton>
  );
};
