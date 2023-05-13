import LoginButton from '@/app/LoginButton';
import Link from 'next/link';
import { NavMenu } from './NavMenu';
import { headers } from 'next/dist/client/components/headers';

export const Nav = () => {
  const pathname = headers();

  return (
    <nav className={'navbar bg-inherit h-20  fixed top-0 z-50  shadow-md '}>
      <div className={'navbar-start'}>
        <NavMenu />
      </div>
      <div className='navbar-center'>
        <Link
          href='/'
          className='btn btn-ghost relative normal-case text-xl  md:text-3xl lg:text-5xl font-kelly text-gray-900'
        >
          Sarijopen Telegraph
          <div className='absolute -right-[38px] -top-1 rotate-12 text-red-800 border-red-800 border-2 font-serif  text-xs md:text-xs lg:text-sm lg:font-extrabold px-1'>
            MOBILE EDITION
          </div>
        </Link>
      </div>

      <div className='navbar-end'>
        <LoginButton />
      </div>
    </nav>
  );
};
