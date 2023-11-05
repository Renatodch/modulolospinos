"use server";
import Navbar from "@/components/navbar";
import { getSession } from "@/lib/login-controller";
import { UserContextProvider } from "../context";

export default async function Layout({ children }: { children: any }) {
  const { _user, _user_course } = await getSession();

  return (
    <UserContextProvider _user={_user} _user_course={_user_course}>
      <Navbar />
      <main>{children}</main>
    </UserContextProvider>
  );
}
