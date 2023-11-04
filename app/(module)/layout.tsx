"use server";
import { NextAuthProvider } from "../providers";
//import { UserContext } from "../context";
import { getUserByEmail, getUserById } from "@/lib/user-controller";
import { useContext, useEffect, useState } from "react";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth-config";
import { User } from "@/entities/entities";
import { UserContextProvider } from "../context";
import { Session } from "next-auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default async function Layout({ children }: { children: any }) {
  let session = await getServerSession(authConfig);
  let res;

  if (session) {
    const { isGoogle, id, user } = session as Session & {
      isGoogle: boolean;
      id: string;
    };
    if (isGoogle) {
      res = await getUserByEmail(user?.email!);
    } else {
      res = await getUserById(id!);
    }
  }

  const user: User = {
    password: "",
    id: "" + (res?.id || ""),
    name: res?.name || "",
    type: res?.type || "",
    email: res?.email || "",
  };

  return (
    <UserContextProvider _user={user}>
      <Navbar />
      <main>{children}</main>
    </UserContextProvider>
  );
}
