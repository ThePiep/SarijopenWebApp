import LoginButton from '@/app/LoginButton';
import Link from 'next/link';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={'navbar bg-inherit h-20 fixed top-0 z-50  shadow-md '}>
      <div className={'navbar-start'}>
        <label
          tabIndex={0}
          className='btn btn-ghost btn-circle'
          onClick={() => setMenuOpen(!menuOpen)}
          onBlur={close}
        >
          <FiMenu className='fill-primary' size='20' />
        </label>
        <ul
          tabIndex={1}
          className={`${
            menuOpen ? '' : 'hidden'
          }  menu menu-compact dropdown-content 
            p-2 shadow 
              bg-base-100 rounded-box w-52
            fixed top-16 left-0 `}
        >
          <li>
            <a href={'/api/hello'}>Test</a>
          </li>
          <li>
            <a href={'/api/bewoners'}>Bewoner api</a>
          </li>
        </ul>
      </div>
      <div className='navbar-center'>
        <Link
          href='/'
          className='btn btn-ghost normal-case text-5xl font-kelly text-gray-900'
        >
          Sarijopen Telegraph
        </Link>
        <div className='relative right-[110px] bottom-4 rotate-12 text-red-800 border-red-800 border-2 font-serif text-sm font-extrabold px-1'>
          MOBILE EDITION
        </div>
      </div>

      <div className='navbar-end'>
        <LoginButton />
      </div>
    </nav>
  );
};
