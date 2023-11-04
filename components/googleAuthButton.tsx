"use client";

import Image from "next/image";
import googleLogo from "@/public/google.png";
import { signIn } from "next-auth/react";
import { Button } from "@radix-ui/themes";
import { useState } from "react";

export function GoogleSignInButton() {
  const [clicked, setClicked] = useState<boolean | undefined>(false);

  const handleClick = async () => {
    setClicked(true);
    await signIn("google");
    setClicked(false);
  };

  return (
    <Button
      disabled={clicked}
      onClick={handleClick}
      variant="outline"
      color={"gray"}
      style={{ backgroundColor: "white", color: "black" }}
      size={"3"}
    >
      <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
      <span className="ml-4 text-base">Continuar con Google</span>
    </Button>
  );
}
