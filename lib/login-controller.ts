"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { authConfig } from "./auth-config";

export const loginUser = async (id: string, pass: string) => {
  try {
    const res = await prisma.usuario.findFirst({
      where: {
        id: parseInt(id),
        password: pass,
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
