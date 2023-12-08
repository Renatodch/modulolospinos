"use client";
import { saveActivity } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import {
  ACTIVITY_TYPES,
  Activity,
  PRIMARY_COLOR,
  Subject,
  TOAST_ACTIVITY_SAVE_SUCCESS,
  TOAST_BD_ERROR,
  TOAST_LOADING,
} from "@/model/types";
import {
  Button,
  Dialog,
  Flex,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { AiFillEdit, AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "sonner";
import LoadingGeneric from "./loadingGeneric";

const ActivityForm = ({ target }: { target?: Activity }) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);
  const [loadedSubjects, setLoadedSubjects] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setLoaded(true);
  }, [target]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true);

    toast.promise(
      new Promise((resolve, reject) => {
        let temp: Activity = {
          id: target?.id || 0,
          title: data.title,
          description: data.desc,
          id_subject: +data.subject,
          type: +data.type,
          url: data.url,
          rubric: [],
          date_max: new Date(data.dateMax),
        };

        saveActivity(temp)
          .then(resolve)
          .catch(() => reject(TOAST_BD_ERROR));
      }),
      {
        loading: TOAST_LOADING,
        success: () => TOAST_ACTIVITY_SAVE_SUCCESS,
        error: (msg) => msg,
        finally: () => {
          setSubmitted(false);
          setOpenDialog(false);
          target && setLoaded(false);
          router.refresh();
          reset();
        },
      }
    );
  };

  const toggleDialog = async (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      reset();
    } else {
      setLoadedSubjects(false);
      const _subjects = await getSubjects();
      setSubjects(_subjects);
      setLoadedSubjects(true);
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
      {loaded && (
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
              {loadedSubjects ? (
                <Controller
                  control={control}
                  name="subject"
                  rules={{ required: true }}
                  defaultValue={target ? "" + target?.id_subject : undefined}
                  render={({ field }) => {
                    return (
                      <div {...field}>
                        <Select.Root
                          size={"3"}
                          onValueChange={field.onChange}
                          defaultValue={
                            target ? "" + target?.id_subject : undefined
                          }
                        >
                          <Select.Trigger
                            disabled={!!target}
                            className="w-full"
                            placeholder={"Tema del curso al que pertenece*"}
                          />
                          <Select.Content position="popper">
                            <Select.Group>
                              <Select.Label>Temas del Curso</Select.Label>
                              {subjects.map((s) => (
                                <Select.Item key={s.id} value={"" + s.id}>
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
              ) : (
                <LoadingGeneric size={30} />
              )}
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
                          disabled={!!target}
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
              {errors.type?.type === "required" && (
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
                      ? `${moment(target.date_max)
                          .toISOString(true)
                          .substring(0, 16)}`
                      : new Date().toLocaleDateString().substring(0, 16)
                  }
                  size="3"
                  type="datetime-local"
                  color="gray"
                  variant="surface"
                  placeholder="Fecha de vencimiento"
                  {...register("dateMax")}
                />
              </TextField.Root>
              <TextField.Input
                defaultValue={target?.url || ""}
                maxLength={255}
                size="3"
                color="gray"
                variant="surface"
                placeholder="Url del contenido"
                {...register("url")}
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
                disabled={submitted || !loadedSubjects}
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

export default ActivityForm;
