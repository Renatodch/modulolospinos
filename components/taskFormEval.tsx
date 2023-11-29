"use client";
import { saveTask } from "@/controllers/task.controller";
import {
  PRIMARY_COLOR,
  TOAST_BD_ERROR,
  TOAST_LOADING,
  TOAST_TASK_EVALUATED,
  Task,
} from "@/model/types";
import { Button, Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";
import LoadingGeneric from "./loadingGeneric";

const TaskFormEval = ({ target }: { target: Task }) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const setData = () => {
      setTask(target);
    };
    setData();
  }, [target]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    if (!task) return;
    setSubmitted(true);

    toast.promise(
      new Promise((resolve, reject) => {
        saveTask({
          id: task.id,
          title: task.title,
          description: task.description,
          image1: task.image1,
          date_upload: task.date_upload,
          score: +data.score,
          comment: data.comment,
          type: task.type,
          id_user: task.id_user,
          id_activity: task.id_activity,
        })
          .then(resolve)
          .catch(reject);
      }),
      {
        loading: TOAST_LOADING,
        success: () => TOAST_TASK_EVALUATED,
        error: () => TOAST_BD_ERROR,
        finally: () => {
          setSubmitted(false);
          setOpenDialog(false);
          setTask(undefined);
          reset();
          router.refresh();
        },
      }
    );
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    !e && reset();
  };
  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          {task ? (
            <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
              <FiEdit size="20" />
              Evaluar
            </Button>
          ) : (
            <div style={{ height: "50px" }} className="py-4">
              <LoadingGeneric size={30} />
            </div>
          )}
        </Flex>
      </Dialog.Trigger>
      {task && (
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title align={"center"}>
            Formulario de Evaluación de Tarea
          </Dialog.Title>
          <Dialog.Description size="2" mb="4"></Dialog.Description>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4">
              <TextField.Input
                defaultValue={task?.score!}
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
                defaultValue={task?.comment ?? ""}
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
      )}
    </Dialog.Root>
  );
};

export default TaskFormEval;
