"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CredentialsFormProps {
  csrfToken?: string;
}

export function CredentialsForm(props: CredentialsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn("credentials", {
      id: data.get("id"),
      password: data.get("password"),
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      //Redirect to homepage (/inicio)
      router.push("/inicio");
    } else {
      console.log("Error: ", signInResponse);
      setError("Id o contraseña incorrecto");
    }
  };

  return (
    <form
      className="w-full text-xl text-black font-semibold flex flex-col"
      onSubmit={handleSubmit}
    >
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
          {error}
        </span>
      )}
      <input
        type="id"
        name="id"
        placeholder="Usuario"
        required
        className="w-full px-4 py-4 mb-4 border text-base border-gray-300 rounded-md"
      />

      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        required
        className="w-full px-4 py-4 mb-4 border text-base border-gray-300 rounded-md"
      />

      <button
        type="submit"
        className="w-full h-12 px-6 mt-4 text-base text-white transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-blue-700"
      >
        Acceder
      </button>
    </form>
  );
}