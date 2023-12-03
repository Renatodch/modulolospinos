"use client";

import { Button, Flex, TextField } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CredentialsForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn("credentials", {
      id: data.get("id"),
      password: data.get("password"),
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      router.push("/");
    } else {
      console.log("Error: ", signInResponse);
      setError("usuario o contraseña incorrecto");
    }
    setSubmitted(false);
  };

  return (
    <form
      className="w-full text-xl text-black font-semibold flex flex-col bg-inherit"
      onSubmit={handleSubmit}
    >
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
          {error}
        </span>
      )}
      <Flex direction="column" gap="4">
        <TextField.Input
          type="text"
          maxLength={64}
          minLength={4}
          size="3"
          name="id"
          color="gray"
          variant="surface"
          placeholder="Usuario"
        />
        <TextField.Input
          size="3"
          type="password"
          name="password"
          color="gray"
          variant="surface"
          placeholder="Contraseña"
        />
        <Button size="3" disabled={Boolean(submitted)}>
          Acceder
        </Button>
      </Flex>
    </form>
  );
}
