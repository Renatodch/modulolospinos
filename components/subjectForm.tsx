"use client";
import { saveSubject } from "@/controllers/subject.controller";
import {
  PRIMARY_COLOR,
  Subject,
  TOAST_BD_ERROR,
  TOAST_SUBJECT_SAVE_SUCCESS,
} from "@/model/types";
import { Button, Dialog, Flex, TextArea, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { AiFillEdit, AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "sonner";
interface Props {
  target?: Subject;
}

const SubjectForm = ({ target }: Props) => {
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
    try {
      let temp: Subject | undefined = {
        title: data.title,
        description: data.desc,
        url: data.url,
        id: target?.id || 0,
      };
      temp = await saveSubject(temp);
      if (!temp) {
        toast.error(TOAST_BD_ERROR);

        setOpenDialog(false);
        reset();
      } else {
        toast.success(TOAST_SUBJECT_SAVE_SUCCESS);

        setOpenDialog(false);
        reset();
        router.refresh();
      }
    } catch (e) {
      toast.error(TOAST_BD_ERROR);
      reset();
    }

    setSubmitted(false);
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      reset();
    }
  };
  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          {!target ? (
            <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
              <AiOutlinePlusCircle size="20" />
              Nuevo
            </Button>
          ) : (
            <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
              <AiFillEdit size="20" />
            </Button>
          )}
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title align={"center"}>
          {!target ? "Formulario de Nuevo Tema" : "Formulario de Tema"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4"></Dialog.Description>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Input
              defaultValue={target?.title || ""}
              maxLength={64}
              size="3"
              color="gray"
              variant="surface"
              placeholder="Titulo del tema*"
              {...register("title", {
                required: true,
                maxLength: 64,
              })}
            />
            {errors.title?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerido el titulo del tema
              </span>
            )}

            <TextArea
              id="desc"
              defaultValue={target?.description || ""}
              maxLength={255}
              size="3"
              color="gray"
              variant="surface"
              {...register("desc")}
              placeholder="Descripción del tema"
            />
            <TextField.Input
              defaultValue={target?.url || ""}
              maxLength={255}
              size="3"
              color="gray"
              variant="surface"
              placeholder="Url del contenido"
              {...register("url", {
                maxLength: 64,
              })}
            />

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

export default SubjectForm;
