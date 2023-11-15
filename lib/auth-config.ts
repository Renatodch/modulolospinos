import {
  getUserByEmail,
  getUserById,
  loginUser,
} from "@/controllers/user.controller";
import { User } from "@/model/types";
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
  };
  return {
    ...session,
    _user: session?._user ?? undefined,
  };
}
