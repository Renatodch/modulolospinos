"use server";
import { UserContextProvider } from "@/app/context";
import { getSession, loginIsRequiredServer } from "@/lib/auth-config";

export default async function Layout({ children }: { children: any }) {
  await loginIsRequiredServer();
  const { _user } = await getSession();

  return <UserContextProvider _user={_user}>{children}</UserContextProvider>;
}
