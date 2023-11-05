import { sql } from "@vercel/postgres";
import { NextAuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/types/types";
import {
  getUserByEmail,
  getUserById,
  getUserCourseByUserId,
} from "./user-controller";
import { prisma } from "../prisma/prisma";
import { loginUser } from "./login-controller";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        id: {
          label: "Id",
          type: "string",
          placeholder: "usuario",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.id || !credentials.password)
          return null;

        const res = await loginUser(+credentials.id, credentials.password);

        //In production DB, passwords should be encrypted using something like bcrypt...
        if (res) {
          const { password, ...dbUserWithoutPassword } = res;
          return dbUserWithoutPassword as User;
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
