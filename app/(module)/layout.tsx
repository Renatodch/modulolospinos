"use server";
import NavBar from "@/app/(module)/navbar";
import { getSession } from "@/lib/auth-config";
import { UserContextProvider } from "../context";

export default async function Layout({ children }: { children: any }) {
  const { _user, _user_course } = await getSession();

  return (
    <UserContextProvider _user={_user} _user_course={_user_course}>
      <NavBar />
      <main>{children}</main>
    </UserContextProvider>
  );
}
