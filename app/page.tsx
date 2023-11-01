import Image from "next/image";
import googleLogo from "@/public/google.png";
import { GoogleSignInButton } from "@/components/authButtons";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getCsrfToken } from "next-auth/react";
import { CredentialsForm } from "@/components/credentialsForm";
import LoginController from "@/controllers/login-controller";

export default async function SignInPage() {
  const session = await getServerSession(LoginController.getInstance().authConfig);
  if (session) return redirect("/inicio");

  return (
    <div className=" flex flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-xl font-bold">Inicia Sesión</h1>
        <CredentialsForm />
        <span className="text-xl font-semibold text-black text-center my-2">
          O
        </span>
        <GoogleSignInButton />
      </div>
    </div>
  );
}