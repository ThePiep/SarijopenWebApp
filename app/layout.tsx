import { SessionProvider, useSession } from 'next-auth/react';
import './globals.css';
import { Nav } from '@/components/nav/Nav';
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
        <Nav />

        <div className={'container mx-auto px-2 pt-24 pb-6 '}>{children}</div>
        {/* <ContentWrapper>{children}</ContentWrapper> */}
      </body>
    </html>
  );
}
