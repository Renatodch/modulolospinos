import { CredentialsForm } from "@/components/credentialsForm";
import { GoogleSignInButton } from "@/components/googleAuthButton";
import { authConfig } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);
  if (session) return redirect("/");

  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <div
        className="flex flex-col items-center p-10 shadow-md bg-slate-50 w-1/3"
        style={{ minWidth: "300px" }}
      >
        <h1 className="mt-10 mb-4 text-xl font-bold">Inicia Sesión</h1>
        <CredentialsForm />
        <span className="font-semibold text-black text-center my-2">O</span>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
