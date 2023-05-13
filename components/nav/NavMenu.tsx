'use client';

import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { CircleButton } from '../Button/CircleButton';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const NavMenu = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();
  return pathname === '/' ? (
    <label
      tabIndex={0}
      className='btn btn-ghost btn-circle'
      onClick={() => setMenuOpen(!menuOpen)}
      onBlur={() => setMenuOpen(false)}
    >
      <FiMenu className='fill-primary' size='20' />
    </label>
  ) : (
    <Link href='/'>
      <CircleButton className='w-12 h-12'>
        <FaArrowLeft />
      </CircleButton>
    </Link>
  );
};
