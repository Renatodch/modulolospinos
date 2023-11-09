"use client";
import { useUserContext } from "@/app/context";
import { saveProject } from "@/lib/project-controller";
import {
  Project,
  TOAST_BD_ERROR,
  TOAST_PROJECT_SAVE_SUCCESS,
} from "@/types/types";
import { Button, Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import type { PutBlobResult } from "@vercel/blob";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { AiFillFileImage, AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "sonner";

const ProjectForm = () => {
  const { user, project } = useUserContext();
  const [_project, _setProject] = useState<Project | null>(null);
  const router = useRouter();
  const [validFile, setValidFile] = useState<
    "invalidType" | "invalidSize" | boolean
  >(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const hiddenInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { ref: registerRef, ...rest } = register("imagen1");

  const handleUploadedFile = (event: any) => {
    const maxSizeInBytes = 4.5 * 1024 * 1024;
    const file = event.target.files[0];
    if (file?.type.split("/")[0] !== "image") {
      setImage(null);
      setValidFile("invalidType");
      return;
    }
    if (file.size > maxSizeInBytes) {
      setImage(null);
      setValidFile("invalidSize");
      return;
    }
    setValidFile(true);
    setImage(file);
  };
  const onUpload = () => (hiddenInputRef.current! as HTMLFormElement).click();

  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true);
    let temp: Project | null = null;
    try {
      let newBlob;
      if (image != null) {
        const response = await fetch(
          `/api/image/upload?filename=${image?.name}`,
          {
            method: "POST",
            body: image,
          }
        );
        newBlob = (await response.json()) as PutBlobResult;
      }

      temp = {
        id: 0,
        title: data.title,
        description: data.desc,
        image1: newBlob?.url || null,
        date_upload: new Date(),
        projectscore: null,
        comment: null,
        id_user: user?.id || 0,
      };

      const res = await saveProject(temp);
      if (!res) {
        whenError();
      } else {
        toast.success(TOAST_PROJECT_SAVE_SUCCESS);
        setValidFile(false);
        setImage(null);
        setOpenDialog(false);
        reset();
        router.refresh();
      }
    } catch (e) {
      whenError();
    }
    _setProject(temp);
    setSubmitted(false);
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      setValidFile(false);
      setImage(null);
      _setProject(null);
      reset();
    }
  };
  const whenError = () => {
    setValidFile(false);
    setImage(null);
    toast.error(TOAST_BD_ERROR);
    _setProject(null);
    reset();
  };

  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          <Button size="3" disabled={!!project || !!_project}>
            <AiOutlinePlusCircle size="20" />
            Añadir nuevo proyecto
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title align={"center"}>"Formulario de Proyecto"</Dialog.Title>
        <Dialog.Description size="2" mb="4"></Dialog.Description>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Input
              id="title"
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
            <TextArea
              id="desc"
              maxLength={255}
              size="3"
              color="gray"
              variant="surface"
              {...register("desc")}
              placeholder="Agregue una descripción o resumen de su proyecto"
            />

            <label htmlFor="image">
              A continuación podrá subir una Imagen representativa del proyecto
              no mayor a 4.5 MB
            </label>
            <TextField.Root style={{ display: "none" }}>
              <TextField.Input
                id="image"
                {...rest}
                maxLength={64}
                accept="image/*"
                onChange={handleUploadedFile}
                type="file"
                ref={hiddenInputRef}
              />
            </TextField.Root>
            <div className="flex justify-start gap-4">
              <Button onClick={onUpload} type="button">
                <AiFillFileImage />
                Subir Imagen
              </Button>
              <p className="font-bold">{(image as File)?.name}</p>
            </div>
            {validFile === "invalidType" && (
              <span role="alert" className="font-semibold text-red-500 ">
                El archivo a subir debe ser una imagen
              </span>
            )}
            {validFile === "invalidSize" && (
              <span role="alert" className="font-semibold text-red-500 ">
                El archivo a subir no debe ser mayor de 4.5 MB
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

export default ProjectForm;
