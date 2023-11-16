"use server";
import NavBar from "@/app/(module)/navbar";
import { getSession } from "@/lib/auth-config";
import { UserContextProvider } from "../context";

export default async function Layout({ children }: { children: any }) {
  const { _user } = await getSession();

  return (
    <UserContextProvider _user={_user}>
      <NavBar />
      <main>{children}</main>
    </UserContextProvider>
  );
}
