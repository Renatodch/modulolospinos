"use client";
import { useUserContext } from "@/app/context";
import { saveTask } from "@/controllers/task.controller";
import {
  Activity,
  PRIMARY_COLOR,
  PROJECT,
  TOAST_BD_ERROR,
  TOAST_PROJECT_SAVE_SUCCESS,
  Task,
} from "@/model/types";
import { Button, Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import { PutBlobResult } from "@vercel/blob";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { AiFillFileImage, AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "sonner";

const ProjectForm = ({
  activity,
  isdone,
}: {
  activity: Activity;
  isdone: boolean;
}) => {
  const { user, task, setTask } = useUserContext();
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
  const { ...rest } = register("image1");

  const handleUploadedImage = (event: any) => {
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
    let temp: Task | undefined = {
      id: 0,
      title: data.title,
      description: data.desc,
      image1: null,
      date_upload: new Date(),
      score: null,
      comment: null,
      type: PROJECT,
      id_activity: activity.id,
      id_user: user?.id || 0,
    };

    try {
      if (image != null) {
        const response = await fetch(
          `/api/file/upload?filename=${image?.name}`,
          {
            method: "POST",
            body: image,
          }
        );
        const blob = (await response.json()) as PutBlobResult;
        if (!blob) throw new Error("Image was not loaded correctly");
        temp.image1 = blob.url;
      }

      temp = await saveTask(temp);
      !temp
        ? toast.error(TOAST_BD_ERROR)
        : toast.success(TOAST_PROJECT_SAVE_SUCCESS);
    } catch (e) {
      toast.error(TOAST_BD_ERROR);
    }

    setTask(temp);
    setSubmitted(false);
    setValidFile(false);
    setImage(null);
    reset();
    setOpenDialog(false);
    router.refresh();
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    !e && reset();
  };

  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          <Button
            size="3"
            disabled={isdone}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <AiOutlinePlusCircle size="20" />
            Añadir nuevo proyecto
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title align={"center"}>Formulario de Proyecto</Dialog.Title>
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
                accept="image/*"
                onChange={handleUploadedImage}
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
            <Button
              size="3"
              disabled={Boolean(submitted)}
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Guardar
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProjectForm;
