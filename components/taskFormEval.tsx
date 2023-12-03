"use client";
import { deleteRubricTaskById, saveTask } from "@/controllers/task.controller";
import {
  PRIMARY_COLOR,
  TOAST_BD_ERROR,
  TOAST_LOADING,
  TOAST_SAVE_ERROR_RUBRIC,
  TOAST_TASK_EVALUATED,
  Task,
} from "@/model/types";
import { Button, Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { PutBlobResult } from "@vercel/blob";
import { FaFileAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";
import LoadingGeneric from "./loadingGeneric";

const TaskFormEval = ({
  target,
  isrubric,
}: {
  target: Task;
  isrubric: boolean;
}) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [rubric, setRubric] = useState<File | null>(null);
  const [validFile, setValidFile] = useState<"invalidSize" | boolean>(false);
  const hiddenInputRef = useRef(null);

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
  const { ...rest } = register("rubric");

  const handleUploadedFile = (event: any) => {
    const maxSizeInBytes = 4.5 * 1024 * 1024;
    const file = event.target.files[0];

    if (file.size > maxSizeInBytes) {
      setRubric(null);
      setValidFile("invalidSize");
      return;
    }
    setValidFile(true);
    setRubric(file);
  };

  const onUpload = () => (hiddenInputRef.current! as HTMLFormElement).click();
  const onSubmit = async (data: FieldValues) => {
    if (!task) return;
    setSubmitted(true);

    toast.promise(
      new Promise((resolve, reject) => {
        const temp: Task = {
          id: task.id,
          title: task.title,
          description: task.description,
          image1: task.image1,
          date_upload: task.date_upload,
          score: +data.score,
          comment: data.comment,
          type: task.type,
          rubric: task.rubric,
          id_user: task.id_user,
          id_activity: task.id_activity,
        };

        if (rubric != null) {
          deleteRubricTaskById(temp.id)
            .then(() =>
              fetch(`/api/file/upload?filename=${rubric?.name}`, {
                method: "POST",
                body: rubric,
              })
            )
            .then((response) => response.json())
            .then((blob: PutBlobResult) => {
              if (!blob) {
                reject(TOAST_SAVE_ERROR_RUBRIC);
              }
              temp!.rubric = blob.url;
            })
            .then(() => saveTask(temp))
            .then(resolve)
            .catch(() => reject(TOAST_BD_ERROR));
        } else
          saveTask(temp)
            .then(resolve)
            .catch(() => reject(TOAST_BD_ERROR));
      }),
      {
        loading: TOAST_LOADING,
        success: () => TOAST_TASK_EVALUATED,
        error: (msg) => msg,
        finally: () => {
          setSubmitted(false);
          setOpenDialog(false);
          setTask(undefined);
          setRubric(null);
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

              {isrubric && (
                <>
                  <label htmlFor="rubrica">
                    Rúbrica de evaluación no mayor a 4.5 MB
                  </label>
                  <TextField.Root style={{ display: "none" }}>
                    <TextField.Input
                      id="rubrica"
                      {...rest}
                      accept="*"
                      onChange={handleUploadedFile}
                      type="file"
                      ref={hiddenInputRef}
                    />
                  </TextField.Root>
                  <div className="flex justify-start gap-4">
                    <Button onClick={onUpload} type="button">
                      <FaFileAlt />
                      Subir Rúbrica de Evaluación
                    </Button>
                    <p className="font-bold">{(rubric as File)?.name}</p>
                  </div>
                  {validFile === "invalidSize" && (
                    <span role="alert" className="font-semibold text-red-500 ">
                      El archivo a subir no debe ser mayor de 4.5 MB
                    </span>
                  )}
                </>
              )}

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
