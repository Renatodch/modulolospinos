"use client";
import { useUserContext } from "@/app/context";
import { saveActivity } from "@/controllers/activity.controller";
import {
  ACTIVITY_TYPES,
  Activity,
  PRIMARY_COLOR,
  SUBJECTS_COURSE,
  TOAST_ACTIVITY_SAVE_SUCCESS,
  TOAST_BD_ERROR,
} from "@/model/types";
import {
  Button,
  Dialog,
  Flex,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { PutBlobResult } from "@vercel/blob";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { AiFillEdit, AiOutlinePlusCircle } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { toast } from "sonner";

const ActivityForm = ({ target }: { target?: Activity }) => {
  const { user } = useUserContext();

  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [validFile, setValidFile] = useState<"invalidSize" | boolean>(false);
  const [rubric, setRubric] = useState<File | null>(null);
  const hiddenInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
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
    setSubmitted(true);
    let temp: Activity | undefined = {
      id: target?.id || 0,
      title: data.title,
      description: data.desc,
      rubric: null,
      subject: +data.subject,
      type: +data.type,
      date_max: new Date(data.dateMax),
      id_user: user?.id || 0,
    };

    try {
      if (rubric != null) {
        const response = await fetch(
          `/api/file/upload?filename=${rubric?.name}`,
          {
            method: "POST",
            body: rubric,
          }
        );
        const blob = (await response.json()) as PutBlobResult;
        if (!blob) throw new Error("Rubric was not loaded correctly");
        temp.rubric = blob.url;
      }
      temp = await saveActivity(temp);
      !temp
        ? toast.error(TOAST_BD_ERROR)
        : toast.success(TOAST_ACTIVITY_SAVE_SUCCESS);
    } catch (e) {
      toast.error(TOAST_BD_ERROR);
    }
    setSubmitted(false);
    router.refresh();
    setValidFile(false);
    setRubric(null);
    reset();
    setOpenDialog(false);
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    !e && reset();
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
          {!target
            ? "Formulario de Nuevo Actividad"
            : "Formulario de Actividad"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4"></Dialog.Description>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Input
              defaultValue={target?.title || ""}
              maxLength={32}
              size="3"
              color="gray"
              variant="surface"
              placeholder="Nombre de la actividad*"
              {...register("title", {
                required: true,
              })}
            />
            {errors.title?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerido el nombre de la actividad
              </span>
            )}
            <Controller
              control={control}
              name="subject"
              rules={{ required: true }}
              defaultValue={
                target?.subject !== undefined ? "" + target?.subject : undefined
              }
              render={({ field }) => {
                return (
                  <div {...field}>
                    <Select.Root
                      size={"3"}
                      onValueChange={field.onChange}
                      defaultValue={
                        target?.subject !== undefined
                          ? "" + target?.subject
                          : undefined
                      }
                    >
                      <Select.Trigger
                        className="w-full"
                        placeholder={"Tema del curso al que pertenece*"}
                      />
                      <Select.Content position="popper">
                        <Select.Group>
                          <Select.Label>Temas del Curso</Select.Label>
                          {SUBJECTS_COURSE.map((s) => (
                            <Select.Item key={s.value} value={"" + s.value}>
                              {s.title}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </div>
                );
              }}
            />
            {errors.subject?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerido el tema al que pertenece la actividad
              </span>
            )}
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              defaultValue={
                target?.type !== undefined ? "" + target?.type : undefined
              }
              render={({ field }) => {
                return (
                  <div {...field}>
                    <Select.Root
                      size={"3"}
                      onValueChange={field.onChange}
                      defaultValue={
                        target?.type !== undefined
                          ? "" + target?.type
                          : undefined
                      }
                    >
                      <Select.Trigger
                        className="w-full"
                        placeholder={"Tipo de actividad*"}
                      />
                      <Select.Content position="popper">
                        <Select.Group>
                          <Select.Label>Temas del Curso</Select.Label>
                          {ACTIVITY_TYPES.map((s) => (
                            <Select.Item key={s.value} value={"" + s.value}>
                              {s.name}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </div>
                );
              }}
            />
            {errors.subject?.type === "required" && (
              <span role="alert" className="font-semibold text-red-500 ">
                Es requerido el tipo de actividad
              </span>
            )}
            <TextArea
              id="desc"
              defaultValue={target?.description}
              maxLength={255}
              size="3"
              color="gray"
              variant="surface"
              {...register("desc")}
              placeholder="Descripción de la actividad"
            />
            <TextField.Root>
              <TextField.Input
                defaultValue={
                  target?.date_max
                    ? `${target.date_max.toISOString().substring(0, 16)}`
                    : new Date().toISOString().substring(0, 16)
                }
                size="3"
                type="datetime-local"
                color="gray"
                variant="surface"
                placeholder="Fecha de vencimiento"
                {...register("dateMax")}
              />
            </TextField.Root>

            <label htmlFor="rubrica">
              Rúbrica de la actividad no mayor a 4.5 MB
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
              <Button
                onClick={onUpload}
                type="button"
                disabled={!!target?.rubric}
              >
                <FaFileAlt />
                Subir Rúbrica
              </Button>
              <p className="font-bold">{(rubric as File)?.name}</p>
            </div>
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

export default ActivityForm;
