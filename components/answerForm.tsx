"use client";
import { useUserContext } from "@/app/context";
import {
  getTaskByUserIdAndActivityId,
  saveTask,
} from "@/controllers/task.controller";
import {
  PRIMARY_COLOR,
  QUESTION,
  TOAST_ANSWER_SAVE_ERROR_1,
  TOAST_ANSWER_SAVE_SUCCESS,
  TOAST_BD_ERROR,
  TOAST_LOADING,
  Task,
  TaskActivityDetail,
} from "@/model/types";
import { Button, Dialog, Flex, TextArea } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { MdQuestionAnswer } from "react-icons/md";
import { toast } from "sonner";

const AnswerForm = ({
  taskActivityDetail,
}: {
  taskActivityDetail: TaskActivityDetail;
}) => {
  const { user } = useUserContext();
  const [task, setTask] = useState<Task | null | undefined>(undefined);
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true);
    toast.promise(
      new Promise<Task>((resolve, reject) => {
        getTaskByUserIdAndActivityId(user?.id, taskActivityDetail.id_activity)
          .then((res) => {
            if (res) {
              reject(res);
              return;
            }

            return saveTask({
              id: 0,
              title: null,
              description: data.answer,
              image1: null,
              date_upload: new Date(),
              score: null,
              scores: [],
              comment: null,
              type: QUESTION,
              id_activity: taskActivityDetail.id_activity,
              id_user: user?.id || 0,
            });
          })
          .then((val) => resolve(val as Task))
          .catch(() => reject(undefined));
      }),
      {
        loading: TOAST_LOADING,
        success: (res: Task) => {
          setTask(res);
          return TOAST_ANSWER_SAVE_SUCCESS;
        },
        error: (res) => {
          if (res) {
            setTask(res);
            return TOAST_ANSWER_SAVE_ERROR_1;
          } else {
            return TOAST_BD_ERROR;
          }
        },
        finally: () => {
          setSubmitted(false);
          setOpenDialog(false);
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
          <Button
            size="3"
            disabled={taskActivityDetail.done || !!task}
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <MdQuestionAnswer size="20" />
            Responder pregunta
          </Button>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title align={"center"}>Respuesta</Dialog.Title>
        <Dialog.Description size="2" mb="4"></Dialog.Description>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextArea
              id="answer"
              maxLength={255}
              size="3"
              color="gray"
              variant="surface"
              {...register("answer")}
              placeholder="Inserte su respuesta"
            />
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

export default AnswerForm;
