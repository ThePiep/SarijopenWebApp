'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import './globals.css';
import { IconContext } from 'react-icons';
import { Nav } from '@/components/Nav';
import { ContentWrapper } from '@/components/ContentWrappers';

export const metadata = {
  title: 'Huize Sarijopen',
  description: 'Responsive homepage of Huize Sarijopen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' data-theme='lofi'>
      <meta name='viewport' content='width=device-width' />
      <meta name='description' content={metadata.description} />
      <meta name='theme-color' content='#6495ed' />
      <title>{metadata.title}</title>

      <link rel='manifest' href='/manifest.json' />
      <body className='bg-orange-50 min-h-screen font-gooper'>
        <SessionProvider>
          <IconContext.Provider
            value={{ color: 'black', className: 'global-class-name' }}
          >
            <Nav />
            <ContentWrapper>{children}</ContentWrapper>
          </IconContext.Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
