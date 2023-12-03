"use client";
import { saveUserCourse } from "@/controllers/user-course.controller";
import { getUsers, saveUser } from "@/controllers/user.controller";
import {
  DEVELOPER,
  NOT_INIT,
  PRIMARY_COLOR,
  STUDENT,
  TEACHER,
  TOAST_BD_ERROR,
  TOAST_LOADING,
  TOAST_USER_SAVE_ERROR_EMAIL,
  TOAST_USER_SAVE_SUCCESS,
  USER_TYPES,
  User,
} from "@/model/types";
import { Button, Dialog, Flex, Select, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import {
  AiFillEdit,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { toast } from "sonner";
interface Props {
  target?: User;
  user_type?: number;
}

const UserForm = ({ target, user_type }: Props) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [passHidden, setPassHidden] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const setData = () => {
      setLoaded(true);
    };
    setData();
  }, [target]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const type = +data.type;
    setSubmitted(true);
    toast.promise(
      new Promise((resolve, reject) => {
        const temp: User = {
          type,
          password: data.password,
          name: data.name,
          email: data.email,
          id: target?.id || 0,
        };
        getUsers()
          .then((users) => {
            if (users.find((u) => u.email === temp.email)) {
              reject(TOAST_USER_SAVE_ERROR_EMAIL);
              return;
            }
            return saveUser(temp);
          })
          .then((res) => {
            if (res?.type === STUDENT && !target) {
              return saveUserCourse({
                id: 0,
                date_start: null,
                date_end: null,
                date_update: new Date(),
                state: NOT_INIT,
                progress: 0,
                average: null,
                id_user: res?.id!,
              });
            } else resolve(true);
          })
          .then(resolve)
          .catch(() => reject(TOAST_BD_ERROR));
      }),
      {
        loading: TOAST_LOADING,
        success: () => TOAST_USER_SAVE_SUCCESS,
        error: (msg) => msg,
        finally: () => {
          setSubmitted(false);
          setPassHidden(true);
          setOpenDialog(false);
          target && setLoaded(false);
          reset();
          router.refresh();
        },
      }
    );
  };

  const togglePassword = () => setPassHidden(!passHidden);
  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (!e) {
      setPassHidden(true);
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

      {loaded && (
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title align={"center"}>
            {!target
              ? user_type === STUDENT
                ? "Formulario de Nuevo Estudiante"
                : "Formulario de Nuevo Usuario"
              : user_type === STUDENT
              ? "Formulario de Estudiante"
              : "Formulario de Usuario"}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4"></Dialog.Description>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4">
              <TextField.Input
                defaultValue={target?.name || ""}
                maxLength={32}
                size="3"
                color="gray"
                variant="surface"
                placeholder="Nombres Completos*"
                {...register("name", {
                  required: true,
                  maxLength: 32,
                })}
              />
              {errors.name?.type === "required" && (
                <span role="alert" className="font-semibold text-red-500 ">
                  Es requerido el nombre del estudiante
                </span>
              )}
              <TextField.Input
                defaultValue={target?.email || ""}
                maxLength={64}
                size="3"
                color="gray"
                variant="surface"
                placeholder="Correo"
                {...register("email", {
                  maxLength: 64,
                  pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                })}
              />
              {errors.email?.type === "pattern" && (
                <span role="alert" className="font-semibold text-red-500 ">
                  Correo electrónico inválido
                </span>
              )}
              <TextField.Root>
                <TextField.Input
                  defaultValue={target?.password || ""}
                  maxLength={32}
                  size="3"
                  type={passHidden ? "password" : "text"}
                  color="gray"
                  variant="surface"
                  placeholder="Contraseña*"
                  {...register("password", {
                    required: true,
                  })}
                />
                <TextField.Slot>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={togglePassword}
                  >
                    {passHidden ? (
                      <AiFillEyeInvisible size={20} />
                    ) : (
                      <AiFillEye size={20} />
                    )}
                  </Button>
                </TextField.Slot>
              </TextField.Root>
              {errors.password?.type === "required" && (
                <span role="alert" className="font-semibold text-red-500 ">
                  Es requerida la contraseña del estudiante
                </span>
              )}
              <Controller
                control={control}
                name="type"
                rules={{ required: true }}
                defaultValue={
                  user_type === STUDENT
                    ? user_type
                    : target?.type !== undefined
                    ? target?.type
                    : undefined
                }
                render={({ field }) => {
                  return (
                    <div {...field}>
                      <Select.Root
                        size={"3"}
                        onValueChange={field.onChange}
                        defaultValue={
                          user_type === STUDENT
                            ? "" + user_type
                            : target?.type !== undefined
                            ? "" + target?.type
                            : undefined
                        }
                      >
                        <Select.Trigger
                          className="w-full"
                          placeholder={"Tipo de usuario"}
                        />
                        <Select.Content position="popper">
                          <Select.Group>
                            <Select.Label>Tipo de usuario</Select.Label>
                            {USER_TYPES.filter((u) =>
                              user_type === STUDENT
                                ? u.value === user_type
                                : u.value === TEACHER || u.value === DEVELOPER
                            ).map((s) => {
                              return (
                                <Select.Item key={s.value} value={"" + s.value}>
                                  {s.name}
                                </Select.Item>
                              );
                            })}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </div>
                  );
                }}
              />
              {errors.type?.type === "required" && (
                <span role="alert" className="font-semibold text-red-500 ">
                  Es requerido el tipo de usuario
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
      )}
    </Dialog.Root>
  );
};

export default UserForm;
