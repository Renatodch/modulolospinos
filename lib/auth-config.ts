import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginUser } from "./login-controller";
import {
  getUserByEmail,
  getUserById,
  getUserCourseByUserId,
} from "./user-controller";

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

        //In production DB, passwords should be encrypted using something like bcrypt...
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
        ? await getUserByEmail(user?.email!)
        : await getUserById(+id!);

      const _user_course = await getUserCourseByUserId(_user?.id || 0);

      const _session = {
        ...session,
        _user,
        _user_course,
      };

      return _session;
    },
  },
};
