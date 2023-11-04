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

export const saveUser = async (user: User) => {
  const data = {
    email: user.email || "",
    password: user.password,
    name: user.name || "",
    type: user.type,
  };

  try {
    const res =
      user.id === ""
        ? prisma.usuario.create({
            data: data,
          })
        : prisma.usuario.update({
            where: {
              id: parseInt(user.id),
            },
            data: data,
          });

    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

export const getUsers = async () => {
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

export const deleteUserById = async (id: string) => {
  try {
    const res = await prisma.usuario.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res;
  } catch (e) {}
};

export const getUserById = async (id: string) => {
  try {
    const res = await prisma.usuario.findUnique({
      where: {
        id: +id,
      },
    });
    return res;
  } catch (e) {}
};

export const getUserByEmail = async (email: string) => {
  try {
    const res = await prisma.usuario.findFirst({
      where: {
        email,
      },
    });

    if (res) {
      return res;
    }
  } catch (e) {}
};
