import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import {
  getUserByEmail,
  getUserById,
  loginUserByEmail,
  loginUserById,
} from "@/controllers/user.controller";
import { User, User_Course } from "@/model/types";
import { NextAuthOptions, Session, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        id: {
          label: "Id",
          type: "text",
          placeholder: "codigo",
        },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.id || !credentials.password)
          return null;

        const idCode = /^\d{4}$/.test(credentials.id);
        const res = !idCode
          ? await loginUserByEmail(credentials.id, credentials.password)
          : await loginUserById(+credentials.id, credentials.password);
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
      const _user_course = await getUserCourseByUserId(_user?.id!);
      const _session = {
        ...session,
        _user,
        _user_course,
      };

      return _session;
    },

    async signIn({ user }) {
      const isGoogle = !!user?.image;
      const isValid = isGoogle ? await getUserByEmail(user?.email!) : true;

      return isValid ? true : "/login";
    },
  },
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");
}

export async function getSession() {
  const session = (await getServerSession(authConfig)) as Session & {
    _user: User | null | undefined;
    _user_course: User_Course | null | undefined;
  };
  return {
    ...session,
    _user: session?._user ?? undefined,
    _user_course: session?._user_course ?? undefined,
  };
}
