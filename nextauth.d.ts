import NextAuth from 'next-auth';
import { Rechten } from '@/pages/api/auth/[...nextauth]';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: number;
    naam: string;
    kookploeg_voorkeur_id: number | null;
    kookploeg_gebruiker_id: number | null;
    rechten: Rechten[];
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    naam: string;
    kookploeg_voorkeur_id: number | null;
    kookploeg_gebruiker_id: number | null;
    rechten: Rechten[];
  }
}
