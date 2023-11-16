"use server";
import { UserContextProvider } from "@/app/context";
import { getSession } from "@/lib/auth-config";

export default async function Layout({ children }: { children: any }) {
  const { _user } = await getSession();

  return <UserContextProvider _user={_user}>{children}</UserContextProvider>;
}
