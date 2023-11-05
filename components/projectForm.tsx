"use client";
import { useUserContext } from "@/app/context";
import { saveProject } from "@/lib/project-controller";
import { Project } from "@/types/types";
import { Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { AiFillEdit, AiOutlinePlusCircle } from "react-icons/ai";
import NotAllowed from "./notAllowed";
interface Props {
  target?: Project;
}

const ProjectForm = ({ target }: Props) => {
  const { user } = useUserContext();
  const router = useRouter();
  const isStudent = !user?.type || +user?.type === 0;
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true);
    const project: Project = {
      id: target?.id || 0,
      title: data.title,
      description: data.desc,
      image1: data.image1,
      image2: data.image2,
      date_update: new Date(),
      approved: target?.approved || false,
      projectscore: target?.projectscore || 0,
      id_user: +user?.id!,
    };
    const res = await saveProject(project);
    if (!res) {
      setError("Ocurrió un error registrando el proyecto");
    } else {
      setOpenDialog(false);
      reset();
      router.refresh();
    }
    setSubmitted(false);
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      setError("");
      reset();
    }
  };

  return isStudent ? (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          {!target ? (
            <Button size="3">
              <AiOutlinePlusCircle size="20" />
              Añadir nuevo proyecto
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
          {!target ? "Formulario de Proyecto Nuevo" : "Formulario de Proyecto"}
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
              defaultValue={target?.title || ""}
              maxLength={48}
              size="3"
              color="gray"
              variant="surface"
              placeholder="Titulo*"
              {...register("title", {
                required: true,
                maxLength: 48,
              })}
            />
            {errors.title?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerido el titulo del proyecto
              </span>
            )}
            <TextField.Input
              defaultValue={target?.description || ""}
              maxLength={64}
              size="3"
              color="gray"
              variant="surface"
              placeholder="Descripción"
              {...register("desc", {
                required: true,
                maxLength: 255,
              })}
            />
            {errors.desc?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerida una descripción del proyecto
              </span>
            )}
            <TextField.Root>
              <TextField.Input
                defaultValue={target?.image1 || ""}
                maxLength={32}
                size="3"
                type="file"
                color="gray"
                variant="surface"
                placeholder="Imagen 1"
                {...register("image1", {
                  maxLength: 64,
                })}
              />
            </TextField.Root>
            {errors.password?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                ---
              </span>
            )}
            <TextField.Root>
              <TextField.Input
                defaultValue={target?.image2 || ""}
                maxLength={32}
                size="3"
                type="file"
                color="gray"
                variant="surface"
                placeholder="Imagen 2"
                {...register("image 2", {
                  maxLength: 64,
                })}
              />
            </TextField.Root>
            {errors.password?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                ---
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
  ) : (
    <NotAllowed />
  );
};

export default ProjectForm;
