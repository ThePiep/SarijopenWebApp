'use client';

import { signOut } from 'next-auth/react';
import { LinkButton } from '../Button/LinkButton';
import { MdLogout } from 'react-icons/md';
import { CircleButton } from '../Button/CircleButton';

export const LogoutButton = () => {
  return (
    <>
      <LinkButton
        color='black'
        className={'hidden md:block h-8 text-xs md:text-base px-4'}
        onClick={() => signOut()}
      >
        <span className=' text-red-800'>[Uitloggen]</span>
      </LinkButton>
      <CircleButton className='block md:hidden' onClick={() => signOut()}>
        <MdLogout size='20' className='text-red-800' />
      </CircleButton>
    </>
  );
};
