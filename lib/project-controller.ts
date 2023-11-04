"use server";
import { Responses } from "@/utils/responses";

import { NextAuthOptions, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Query, sql } from "@vercel/postgres";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/entities/entities";
import { prisma } from "./prisma";

export const getProjects = async () => {
  let res: User[] = [];
  try {
    const users = await prisma.usuario.findMany({
      orderBy: {
        id: "asc",
      },
    });
    if (users) {
      users.forEach((u) => res.push({ ...u, id: "" + u.id }));
    }
  } catch (e) {
    console.log("Error: ", e);
  }
  return res;
};
