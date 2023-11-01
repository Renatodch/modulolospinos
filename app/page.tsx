import Image from "next/image";
import googleLogo from "@/public/google.png";
import {
  CredentialsSignInButton,
  GoogleSignInButton,
} from "@/components/authButtons";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCsrfToken } from "next-auth/react";
import { CredentialsForm } from "@/components/credentialsForm";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);

  console.log("Session: ", session);

  if (session) return redirect("/inicio");

  return (
    <div className=" flex flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-xl font-bold">Inicia Sesión</h1>
        <GoogleSignInButton />
        <span className="text-xl font-semibold text-black text-center my-2">
          O
        </span>
        <CredentialsForm />
      </div>
    </div>
  );
}