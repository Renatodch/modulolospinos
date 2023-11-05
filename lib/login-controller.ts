"use server";

import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "../prisma/prisma";
import { authConfig } from "./auth-config";
import { User, User_Course } from "@/types/types";

export const loginUser = async (id: number, password: string) => {
  try {
    const res = await prisma.usuario.findFirst({
      where: {
        id,
        password,
      },
    });
    if (res) {
      return res;
    }
  } catch (e) {
    console.log("Error: ", e);
  }
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
