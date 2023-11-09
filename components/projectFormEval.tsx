"use client";
import { saveProject } from "@/lib/project-controller";
import { getUserCourseByUserId, saveUserCourse } from "@/lib/user-controller";
import {
  MIN_NOTE_APPROVED,
  Project,
  TOAST_BD_ERROR,
  TOAST_PROJECT_EVALUATED,
} from "@/types/types";
import { Button, Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";

const ProjectFormEval = ({ target }: { target: Project }) => {
  const router = useRouter();
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
    try {
      const user_course = await getUserCourseByUserId(target.id_user);
      if (user_course) {
        const project: Project = {
          id: target.id,
          title: target.title,
          description: target.description,
          image1: target.image1,
          date_upload: target.date_upload,
          projectscore: +data.score,
          comment: data.comment,
          id_user: target.id_user,
        };
        let p = await saveProject(project);
        let uc = await saveUserCourse({
          ...user_course,
          state: +data.score >= MIN_NOTE_APPROVED ? 1 : 2,
        });
        if (!p || !uc) {
          whenError();
        } else {
          toast.success(TOAST_PROJECT_EVALUATED);
          setOpenDialog(false);
          router.refresh();
        }
      }
    } catch (e) {
      whenError();
    }

    setSubmitted(false);
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      reset();
    }
  };
  const whenError = () => {
    toast.error(TOAST_BD_ERROR);
    reset();
  };
  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          {
            <Button size="3">
              <FiEdit size="20" />
              Evaluar
            </Button>
          }
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title align={"center"}>
          Formulario de Evaluación de Proyecto
        </Dialog.Title>
        <Dialog.Description size="2" mb="4"></Dialog.Description>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Input
              defaultValue={target.projectscore ?? 0}
              size="3"
              color="gray"
              variant="surface"
              type="number"
              placeholder="Calificación*"
              min={0}
              max={20}
              {...register("score", {
                required: true,
                min: 0,
                max: 20,
              })}
            />
            {errors.score?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                No se puede dejar la calificación en blanco
              </span>
            )}
            {errors.score?.type === "min" && (
              <span role="alert" className="font-semibold text-red-500 ">
                La nota minima es hasta 0
              </span>
            )}
            {errors.score?.type === "max" && (
              <span role="alert" className="font-semibold text-red-500 ">
                La nota máxima es hasta 20
              </span>
            )}

            <TextArea
              defaultValue={target.comment ?? ""}
              id="desc"
              maxLength={255}
              size="3"
              color="gray"
              variant="surface"
              {...register("comment")}
              placeholder="Comentario"
            />

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

export default ProjectFormEval;
