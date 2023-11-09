"use client";
import { saveUser } from "@/lib/user-controller";
import {
  STUDENT,
  TOAST_BD_ERROR,
  TOAST_USER_SAVE_SUCCESS,
  User,
} from "@/types/types";
import { Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  AiFillEdit,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { toast } from "sonner";
interface Props {
  target?: User;
}

const UserForm = ({ target }: Props) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [passHidden, setPassHidden] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true);
    try {
      const user: User = {
        type: STUDENT,
        password: data.password,
        name: data.name,
        email: data.email,
        id: target?.id || 0,
      };
      const res = await saveUser(user);
      if (!res) {
        toast.error(TOAST_BD_ERROR);
        setPassHidden(true);
        setOpenDialog(false);
        reset();
      } else {
        toast.success(TOAST_USER_SAVE_SUCCESS);
        setPassHidden(true);
        setOpenDialog(false);
        reset();
        router.refresh();
      }
    } catch (e) {
      toast.error(TOAST_BD_ERROR);
      setPassHidden(true);
      reset();
    }

    setSubmitted(false);
  };

  const togglePassword = () => setPassHidden(!passHidden);
  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      setPassHidden(true);
      reset();
    }
  };
  return (
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
        <Dialog.Description size="2" mb="4"></Dialog.Description>
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
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
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
              <Button
                size="3"
                variant="soft"
                color="gray"
                disabled={Boolean(submitted)}
              >
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
