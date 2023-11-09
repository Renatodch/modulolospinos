import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginUser } from "./login-controller";
import { getUserByEmail, getUserById } from "./user-controller";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        id: {
          label: "Id",
          type: "number",
          placeholder: "0004",
        },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.id || !credentials.password)
          return null;

        const res = await loginUser(+credentials.id, credentials.password);

        if (res) {
          const { password, ...dbUserWithoutPassword } = {
            ...res,
            id: "" + res.id,
          };
          return dbUserWithoutPassword;
        }
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      const isGoogle = !!session.user?.image;
      const id = token.sub;
      const _user = isGoogle
        ? await getUserByEmail(session.user?.email!)
        : await getUserById(+id!);
      const _session = {
        ...session,
        _user,
      };

      return _session;
    },
  },
};
