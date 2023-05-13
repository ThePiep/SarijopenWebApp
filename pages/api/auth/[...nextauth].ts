import { getRechtenVoorGebruiker } from '@/util/bewoners';
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

export enum Rechten {
  bata,
  bewoners,
  bier,
  boots,
  diensten,
  flatbak,
  flatrekening,
  fotoalbum,
  koffie,
  kooksysteem,
  webmaster,
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

        const authResponse = await fetch(
          `${process.env.SARIJOPEN_URL}/flatpage/controller/login.php`,
          {
            method: 'POST',
            body: data,
          }
        );

        const obj: LoginResponse = await authResponse.json();
        if (authResponse.ok && obj !== undefined) {
          console.log('auth response json', obj);
          if (obj.success !== 1) {
            // obj.message will hold error message
            return null;
          }
          if (obj.success && obj.userId !== undefined) {
            const kookploeg_gebruiker_id =
              (await getKookploegGebruikerIdByName(credentials.username)) ??
              null;
            let kookploeg_id = null;
            if (kookploeg_gebruiker_id) {
              kookploeg_id =
                (await getKookploegVoorkeurByGebruikerId(
                  kookploeg_gebruiker_id
                )) ?? null;
            }

            const rechten: Rechten[] = await getRechtenVoorGebruiker(
              obj.userId
            );
            console.log({ rechten });
            return {
              id: obj.userId,
              name: credentials.username,
              naam: credentials.username,
              kookploeg_voorkeur_id: kookploeg_id,
              kookploeg_gebruiker_id: kookploeg_gebruiker_id ?? null,
              rechten: rechten,
            };
          } else {
            throw new Error(
              'Unexpected auth server response, userId is undefined'
            );
          }
        } else {
          const text = await authResponse.text();
          console.log('Login failed, auth response text: ', text);
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
        session.user.rechten = token.rechten;
      }
      return session;
    },
    jwt({ token, trigger, session, user }) {
      if (user) {
        token.naam = user.naam;
        token.kookploeg_voorkeur_id = user.kookploeg_voorkeur_id;
        token.kookploeg_gebruiker_id = user.kookploeg_gebruiker_id;
        token.rechten = user.rechten;
      }
      return token;
    },
    redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);
