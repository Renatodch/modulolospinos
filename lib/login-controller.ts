import { Responses } from "@/utils/responses";
import { sql } from "@vercel/postgres";
import { NextAuthOptions, getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/entities/entities";
import { getUserByEmail } from "./user-controller";
import { prisma } from "./prisma";

export const authConfig: NextAuthOptions = {
providers: [
  CredentialsProvider({
    name: "Sign in",
    credentials: {
      id: {
        label: "Email",
        type: "email",
        placeholder: "example@example.com",
      },
      password: { label: "Password", type: "password" },
    },
    authorize: async(credentials)=> {
      if (!credentials || !credentials.id || !credentials.password)
        return null;

      const res = await loginUser(credentials.id,credentials.password);

      //In production DB, passwords should be encrypted using something like bcrypt...
      if (res) {
        const user = {...res,id:(""+res.id)}
        const { password, ...dbUserWithoutPassword } = user
        return dbUserWithoutPassword as User;
      }
      return null;
    },
  
  }),

  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  })],
  callbacks: {
    async session({session,token,user}) {
      const _session = {...session,isGoogle:!!session.user?.image,id:token.sub}
      return _session;
    },
  },
}

export const loginUser=async (id:string, pass:string)=>{
  try {
    const res = await prisma.usuario.findFirst({
      where:{
        id:parseInt(id),
        password:pass
      }
    })
    if(res){
      return res
    }            
  } catch (e) {
      console.log("Error: ",e);
  }
};

export async function loginIsRequiredServer() {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("/login");
}

export async function loginIsRequiredClient() {
  if (typeof window !== "undefined") {
      const session = useSession();
      const router = useRouter();
      if (!session) router.push("/");
  }
}
