import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { AuthOptions } from "next-auth";
import { sendRequest } from "@/utils/api";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Login",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          method: "POST",
          body: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });

        if (res.data) {
          return res.data as any;
        } else {
          throw new Error(res.message);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      if (trigger === "signIn" && account?.provider !== "credentials") {
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
          method: "POST",
          body: {
            type: account?.provider.toLocaleUpperCase(),
            username: user.email,
          },
        });

        if (res.data) {
          token = res.data;
        }
      }

      if (trigger === "signIn" && account?.provider === "credentials") {
        //@ts-ignore
        token.access_token = user.access_token;
        //@ts-ignore
        token.refresh_token = user.refresh_token;
        //@ts-ignore
        token.user = user.user;
      }
      return token;
    },
    session({ session, token, user }) {
      if (token) {
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };