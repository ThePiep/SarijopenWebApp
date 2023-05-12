import {
  getKookploegGebruikerIdByName,
  getKookploegVoorkeurByGebruikerId,
} from '@/util/kookploeg';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface LoginResponse {
  success: number;
  userId?: number;
  message: string;
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://authjs.dev/reference/providers/
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    // colorScheme: 'light',
    brandColor: '#1E90FF',
    logo: '/img/titel.gif',
    buttonText: '#FF0000',
  },
  providers: [
    CredentialsProvider({
      id: '1',
      type: 'credentials',
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'boots' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'bierislekker',
        },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (
          credentials?.password === undefined ||
          credentials.username === undefined
        ) {
          return null;
        }

        const data = new URLSearchParams();
        if (credentials) {
          data.append('naam', credentials?.username);
          data.append('pwd', credentials?.password);
        }

        const res = await fetch(
          `${process.env.SARIJOPEN_URL}/flatpage/controller/login.php`,
          {
            method: 'POST',
            body: data,
          }
        );

        const obj: LoginResponse = await res.json();
        if (res.ok && obj !== undefined) {
          console.log('json', obj);
          if (obj.success !== 1) {
            // obj.message will hold error message
            // throw new Error(obj.message) <- Example of possible use to show error message
            return null;
          }
          if (obj.success && obj.userId !== undefined) {
            const kookploeg_gebruiker_id = await getKookploegGebruikerIdByName(
              credentials.username
            );
            let kookploeg_id = null;

            if (kookploeg_gebruiker_id) {
              kookploeg_id = await getKookploegVoorkeurByGebruikerId(
                kookploeg_gebruiker_id
              );
            }
            return {
              id: obj.userId.toString(),
              name: credentials.username,
              naam: credentials.username,
              kookploeg_voorkeur_id: kookploeg_id,
              kookploeg_gebruiker_id: kookploeg_gebruiker_id ?? null,
            };
          } else {
            // userId is unexpectedly undefined
            return null;
          }
        } else {
          const text = await res.text();
          console.log('error, enexpected auth server response: ', text);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.name && session.user) {
        session.user.naam = token.name;
        session.user.kookploeg_voorkeur_id = token.kookploeg_voorkeur_id;
        session.user.kookploeg_gebruiker_id = token.kookploeg_gebruiker_id;
      }
      return session;
    },
    jwt({ token, trigger, session, user }) {
      if (user) {
        token.naam = user.naam;
        token.kookploeg_voorkeur_id = user.kookploeg_voorkeur_id;
        token.kookploeg_gebruiker_id = user.kookploeg_gebruiker_id;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
