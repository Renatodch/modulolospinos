"use server";
import { loginIsRequiredServer } from "@/lib/auth-config";

export default async function Layout({ children }: { children: any }) {
  await loginIsRequiredServer();

  return <>{children}</>;
}
