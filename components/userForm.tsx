"use client";
import { useUserContext } from "@/app/context";
import React, { EventHandler, MouseEventHandler, useState } from "react";
import NotAllowed from "./notAllowed";
import { Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  AiFillEdit,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { saveUser } from "@/lib/user-controller";
import { User } from "@/entities/entities";
import { useRouter } from "next/navigation";
interface Props {
  target?: User;
}

const UserForm = ({ target }: Props) => {
  const { user } = useUserContext();
  const router = useRouter();
  const isStudent = !user?.type || +user?.type === 0;
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [passHidden, setPassHidden] = useState<boolean | null>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true);
    const user: User = {
      type: "0",
      password: data.password,
      name: data.name,
      email: data.email,
      id: target?.id || "",
    };
    const res = await saveUser(user);
    if (!res) {
      setError("Ocurrió un error registrando al usuario");
    } else {
      setOpenDialog(false);
      setPassHidden(true);
      reset();
      router.refresh();
    }
    setSubmitted(false);
  };

  const togglePassword = () => {
    setPassHidden(!passHidden);
  };
  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      setPassHidden(true);
      setError("");
      reset();
    }
  };

  return isStudent ? (
    <NotAllowed />
  ) : (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          {!target ? (
            <Button size="3">
              <AiOutlinePlusCircle size="20" />
              Nuevo
            </Button>
          ) : (
            <Button size="3">
              <AiFillEdit size="20" />
            </Button>
          )}
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title align={"center"}>
          {!target
            ? "Formulario de Nuevo Estudiante"
            : "Formulario de Estudiante"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {error && (
            <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
              {error}
            </span>
          )}
        </Dialog.Description>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Input
              defaultValue={target?.name || ""}
              maxLength={32}
              size="3"
              color="gray"
              variant="surface"
              placeholder="Nombres Completos*"
              {...register("name", {
                required: true,
                maxLength: 32,
              })}
            />
            {errors.name?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerido el nombre del estudiante
              </span>
            )}
            <TextField.Input
              defaultValue={target?.email || ""}
              maxLength={64}
              size="3"
              color="gray"
              variant="surface"
              placeholder="Correo"
              {...register("email", {
                maxLength: 64,
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              })}
            />
            {errors.email?.type === "pattern" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Correo electrónico inválido
              </span>
            )}
            <TextField.Root>
              <TextField.Input
                defaultValue={target?.password || ""}
                maxLength={32}
                size="3"
                type={passHidden ? "password" : "text"}
                color="gray"
                variant="surface"
                placeholder="Contraseña*"
                {...register("password", {
                  required: true,
                  maxLength: 32,
                })}
              />
              <TextField.Slot>
                <Button type="button" variant="ghost" onClick={togglePassword}>
                  {passHidden ? (
                    <AiFillEye size={20} />
                  ) : (
                    <AiFillEyeInvisible size={20} />
                  )}
                </Button>
              </TextField.Slot>
            </TextField.Root>
            {errors.password?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerida la contraseña del estudiante
              </span>
            )}

            <p>(*) campos obligatorios</p>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button size="3" variant="soft" color="gray">
                Cancelar
              </Button>
            </Dialog.Close>
            <Button size="3" disabled={Boolean(submitted)}>
              Guardar
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UserForm;
