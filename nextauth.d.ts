import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: number;
    naam: string;
    kookploeg_voorkeur_id: number | null;
    kookploeg_gebruiker_id: number | null;
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
  }
}
