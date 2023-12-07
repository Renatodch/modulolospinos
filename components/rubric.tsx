"use client";

import { saveTask } from "@/controllers/task.controller";
import {
  PRIMARY_COLOR,
  TOAST_BD_ERROR,
  TOAST_LOADING,
  TOAST_TASK_EVALUATED,
  Task,
} from "@/model/types";
import {
  Button,
  Dialog,
  Flex,
  Table,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingGeneric from "./loadingGeneric";

const Rubric = ({
  title,
  readonly,
  disabled,
  target,
}: {
  title: string;
  readonly?: boolean;
  disabled?: boolean;
  target?: Task;
}) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>(undefined);

  const [scoresValue, setScoresValue] = useState<
    Array<Array<number | undefined>>
  >(() => {
    const rows = 5;
    const columns = 3;

    const initialState: Array<Array<number | undefined>> = [];
    for (let i = 0; i < rows; i++) {
      initialState[i] = [];
      for (let j = 0; j < columns; j++) {
        initialState[i][j] = undefined;
      }
    }

    return initialState;
  });

  const cellClasses = "border-l-2 border-gray-100";
  const _interactive = target && !readonly;
  const _readonly = !target || readonly;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    const setData = () => {
      setTask(target);
    };
    setData();
  }, [target]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "score") return;
      const score1 = +(value["score1"] ?? 0);
      const score2 = +(value["score2"] ?? 0);
      const score3 = +(value["score3"] ?? 0);
      const score4 = +(value["score4"] ?? 0);
      const score5 = +(value["score5"] ?? 0);
      updateArrayValues(score1, score2, score3, score4, score5);
      setValue("score", score1 + score2 + score3 + score4 + score5);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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
          score1: +data.score1,
          score2: +data.score2,
          score3: +data.score3,
          score4: +data.score4,
          score5: +data.score5,
          comment: data.comment,
          type: task.type,
          id_user: task.id_user,
          id_activity: task.id_activity,
        };

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
          reset();
          router.refresh();
        },
      }
    );
  };

  const toggleDialog = (e: boolean) => {
    setOpenDialog(e);
    if (e && task) {
      const score1 = task.score1 ?? 0;
      const score2 = task.score2 ?? 0;
      const score3 = task.score3 ?? 0;
      const score4 = task.score4 ?? 0;
      const score5 = task.score5 ?? 0;
      updateArrayValues(score1, score2, score3, score4, score5);
      setValue("score", score1 + score2 + score3 + score4 + score5);
    } else {
      reset();
    }
  };

  const updateArrayValues = (
    score1: number,
    score2: number,
    score3: number,
    score4: number,
    score5: number
  ) => {
    const arr = [...scoresValue];
    arr[0][0] = score1 === 3 ? score1 : undefined;
    arr[0][1] = score1 >= 1 && score1 <= 2 ? score1 : undefined;
    arr[0][2] = score1 === 0 ? score1 : undefined;
    arr[1][0] = score2 === 3 ? score2 : undefined;
    arr[1][1] = score2 >= 1 && score2 <= 2 ? score2 : undefined;
    arr[1][2] = score2 === 0 ? score2 : undefined;
    arr[2][0] = score3 === 4 ? score3 : undefined;
    arr[2][1] = score3 >= 1 && score3 <= 3 ? score3 : undefined;
    arr[2][2] = score3 === 0 ? score3 : undefined;
    arr[3][0] = score4 === 5 ? score4 : undefined;
    arr[3][1] = score4 >= 1 && score4 <= 4 ? score4 : undefined;
    arr[3][2] = score4 === 0 ? score4 : undefined;
    arr[4][0] = score5 === 5 ? score5 : undefined;
    arr[4][1] = score5 >= 1 && score5 <= 4 ? score5 : undefined;
    arr[4][2] = score5 === 0 ? score5 : undefined;
    setScoresValue([...arr]);
  };

  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        {task ? (
          <Button
            size={"3"}
            style={{ width: "150px", backgroundColor: PRIMARY_COLOR }}
            disabled={disabled}
          >
            {_readonly ? "Ver Evaluación" : "Evaluar"}
          </Button>
        ) : !target ? (
          <Button
            size={"3"}
            style={{ width: "150px", backgroundColor: PRIMARY_COLOR }}
          >
            Ver Rúbrica
          </Button>
        ) : (
          <div style={{ height: "50px" }} className="py-4">
            <LoadingGeneric size={30} />
          </div>
        )}
      </Dialog.Trigger>
      {(task || !target) && (
        <Dialog.Content style={{ maxWidth: 950 }}>
          <Dialog.Title align={"center"}>{title}</Dialog.Title>
          <form className="w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
            <Table.Root variant="surface">
              <Table.Header style={{ backgroundColor: PRIMARY_COLOR }}>
                <Table.Row>
                  <Table.ColumnHeaderCell
                    justify={"center"}
                  ></Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Excelente
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Malo
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Insuficiente
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row align={"center"}>
                  <Table.Cell rowSpan={3} justify={"center"}>
                    <Flex direction={"column"} gap="2">
                      <span>Planteamiento del Problema y Alcance</span>
                      {!_readonly && (
                        <TextField.Input
                          style={{ textAlign: "center" }}
                          defaultValue={task?.score1 ?? 0}
                          size="3"
                          color="gray"
                          variant="surface"
                          type="number"
                          placeholder="0"
                          min={0}
                          max={3}
                          required
                          {...register("score1")}
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"start"}>
                  <Table.Cell>
                    <ul
                      style={{ listStyle: "outside", listStyleType: "initial" }}
                    >
                      <li>
                        Justifica las necesidades y/o problemática que origina
                        la realización de su proyecto.
                      </li>
                      <li>
                        Describe las causas más probables del evento o situación
                        problema a resolver.
                      </li>
                      <li>
                        Presenta información a partir de fuentes relevantes que
                        sustentan el planteamiento de sus necesidades o
                        problemtica.
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>
                        Realiza una Justificación incompleta de las necesidades
                        y/o problemática que origina la realización de su
                        proyecto.
                      </li>
                      <li>
                        Describe sin consistencia las causas más probables del
                        evento o situación problema a resolver.
                      </li>
                      <li>
                        El informe presentado no se encuentra avalado a partir
                        de fuentes relevantes que sustentan el planteamiento de
                        sus necesidades o problemática
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>
                        NO Justifica las necesidades y/o problemática que
                        origina la realización de su proyecto.
                      </li>
                      <li>
                        NO Describe las causas más probables del evento o
                        situación problema a resolver.
                      </li>
                      <li>
                        NO Presenta información a partir de fuentes relevantes
                        que sustentan el planteamiento de sus necesidades o
                        problemática.
                      </li>
                    </ul>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    3 puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    [1-2] puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    0 puntos
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"center"}>
                  <Table.Cell justify={"center"}>puntaje</Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-blue-600 ${cellClasses}`}
                  >
                    {target && scoresValue[0][0]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-yellow-600 ${cellClasses}`}
                  >
                    {target && scoresValue[0][1]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-red-600 ${cellClasses}`}
                  >
                    {target && scoresValue[0][2]}
                  </Table.Cell>
                </Table.Row>

                <Table.Row align={"center"}>
                  <Table.Cell rowSpan={3} justify={"center"}>
                    <Flex direction={"column"} gap="2">
                      <span>Objetivos e Indicadores</span>
                      {!_readonly && (
                        <TextField.Input
                          style={{ textAlign: "center" }}
                          defaultValue={task?.score2 ?? 0}
                          size="3"
                          color="gray"
                          variant="surface"
                          type="number"
                          placeholder="0"
                          min={0}
                          max={3}
                          required
                          {...register("score2")}
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"start"}>
                  <Table.Cell>
                    <ul
                      style={{ listStyle: "outside", listStyleType: "initial" }}
                    >
                      <li>
                        Formula claramente y de manera objetiva el/ los
                        objeto(s) o sujeto(s) que intervienen directamente en el
                        problema.
                      </li>
                      <li>
                        Indica el propósito del prototipo, experimento, estudio,
                        análisis técnico o económico, o desarrollo tecnológico
                      </li>
                      <li>
                        Los indicadores de éxito del proyecto tienen el respaldo
                        de expertos en el marco de proyecto.
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>
                        Realiza una pobre formulación o poco objetiva del/ los
                        objeto(s) o sujeto(s) que intervienen directamente en el
                        problema.
                      </li>
                      <li>
                        Indica medianamente el propósito del prototipo,
                        experimento, estudio, análisis técnico o económico, o
                        desarrollo tecnológico para resolver cada situación
                        problema.
                      </li>
                      <li>
                        Más del 80% de los indicadores de éxito del proyecto
                        tienen el respaldo de expertos en el marco de proyecto.
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>
                        NO Formula claramente y de manera objetiva el/ los
                        objeto(s) o sujeto(s) que intervienen directamente en el
                        problema.
                      </li>
                      <li>
                        NO Indica el propósito del prototipo, experimento,
                        estudio, análisis técnico o económico, o desarrollo
                        tecnológico para resolver cada situación problema.
                      </li>
                      <li>
                        Los indicadores de éxito del proyecto NO tienen el
                        respaldo de expertos en el marco de proyecto.
                      </li>
                    </ul>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    3 puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    [1-2] puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    0 puntos
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"center"}>
                  <Table.Cell justify={"center"}>puntaje</Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-blue-600 ${cellClasses}`}
                  >
                    {target && scoresValue[1][0]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-yellow-600 ${cellClasses}`}
                  >
                    {target && scoresValue[1][1]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-red-600 ${cellClasses}`}
                  >
                    {target && scoresValue[1][2]}
                  </Table.Cell>
                </Table.Row>

                <Table.Row align={"center"}>
                  <Table.Cell rowSpan={3} justify={"center"}>
                    <Flex direction={"column"} gap="2">
                      <span>Resultados del Proyecto</span>
                      {!_readonly && (
                        <TextField.Input
                          style={{ textAlign: "center" }}
                          defaultValue={task?.score3 ?? 0}
                          size="3"
                          color="gray"
                          variant="surface"
                          type="number"
                          placeholder="0"
                          min={0}
                          max={4}
                          required
                          {...register("score3")}
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"start"}>
                  <Table.Cell>
                    <ul
                      style={{ listStyle: "outside", listStyleType: "initial" }}
                    >
                      <li>
                        Expresa claramente el resultado final del proyecto y
                        cubre la totalidad a la necesidad planteada.
                      </li>
                      <li>
                        Describe claramente los beneficios que podría obtener al
                        aplicar el proyecto.
                      </li>
                      <li>
                        Demuestra que sus competencias de carrera avalan los
                        resultados propuestos.
                      </li>
                      <li>
                        Establece una metodologia de validación de resultados
                        del proyecto.{" "}
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>
                        Expresa de una forma poco clara el resultado final del
                        proyecto y deja incertidumbre si cubre la totalidad a la
                        necesidad planteada.
                      </li>
                      <li>
                        Describe de una forma poco clara los beneficios que
                        podría obtener al aplicar el proyecto.
                      </li>
                      <li>
                        Las competencias de carrera avalan los resultados
                        propuestos.
                      </li>
                      <li>
                        Establece una metodologia de validación de resultados
                        del proyecto.
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>
                        NO Expresa claramente el resultado final del proyecto y
                        cubre la totalidad a la necesidad planteada.
                      </li>
                      <li>
                        NO Describe claramente los beneficios que podría obtener
                        al aplicar el proyecto.
                      </li>
                      <li>
                        NO Demuestra que sus competencias de carrera avalan los
                        resultados propuestos.
                      </li>
                      <li>
                        NO Establece una metodologia de validación de resultados
                        del proyecto.
                      </li>
                    </ul>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    4 puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    [1-3] puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    0 puntos
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"center"}>
                  <Table.Cell justify={"center"}>puntaje</Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-blue-600 ${cellClasses}`}
                  >
                    {target && scoresValue[2][0]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-yellow-600 ${cellClasses}`}
                  >
                    {target && scoresValue[2][1]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-red-600 ${cellClasses}`}
                  >
                    {target && scoresValue[2][2]}
                  </Table.Cell>
                </Table.Row>

                <Table.Row align={"center"}>
                  <Table.Cell rowSpan={3} justify={"center"}>
                    <Flex direction={"column"} gap="2">
                      <span>Presentación del proyecto</span>
                      {!_readonly && (
                        <TextField.Input
                          style={{ textAlign: "center" }}
                          defaultValue={task?.score4 ?? 0}
                          size="3"
                          color="gray"
                          variant="surface"
                          type="number"
                          placeholder="0"
                          min={0}
                          max={5}
                          required
                          {...register("score4")}
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"start"}>
                  <Table.Cell>
                    <ul
                      style={{ listStyle: "outside", listStyleType: "initial" }}
                    >
                      <li>Es clara la presentación del proyecto.</li>
                      <li>
                        Demuestra competencia de comunicación oral expresandose
                        fluidamente.
                      </li>
                      <li>Puntualidad.</li>
                      <li>Demuestra competencia de trabajo en equipo.</li>
                      <li>Demuestra competencia de comunicación escrita.</li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>La presentacion del proyecto es poco clara</li>
                      <li>
                        Demuestra que la competencia de comunicación oral no
                        esta cubierta en su totalidad.
                      </li>
                      <li>Puntualidad.</li>
                      <li>
                        Demuestra competencia de trabajo en equipo no esta
                        cubierta en su totalidad.
                      </li>
                      <li>
                        Demuestra competencia de comunicación escrita no esta
                        cubierta en su totalidad.
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>NO Es clara la presentación del proyecto.</li>
                      <li>
                        NO Demuestra competencia de comunicación oral
                        expresandose fluidamente.
                      </li>
                      <li>NO es Puntual.</li>
                      <li>NO Demuestra competencia de trabajo en equipo.</li>
                      <li>NO Demuestra competencia de comunicación escrita.</li>
                    </ul>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    5 puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    [1-4] puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    0 puntos
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"center"}>
                  <Table.Cell justify={"center"}>puntaje</Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-blue-600 ${cellClasses}`}
                  >
                    {target && scoresValue[3][0]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-yellow-600 ${cellClasses}`}
                  >
                    {target && scoresValue[3][1]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-red-600 ${cellClasses}`}
                  >
                    {target && scoresValue[3][2]}
                  </Table.Cell>
                </Table.Row>

                <Table.Row align={"center"}>
                  <Table.Cell rowSpan={3} justify={"center"}>
                    <Flex direction={"column"} gap="2">
                      <span>Argumentación y consistencia del proyecto</span>
                      {!_readonly && (
                        <TextField.Input
                          style={{ textAlign: "center" }}
                          defaultValue={task?.score5 ?? 0}
                          size="3"
                          color="gray"
                          variant="surface"
                          type="number"
                          placeholder="0"
                          min={0}
                          max={5}
                          required
                          {...register("score5")}
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"start"}>
                  <Table.Cell>
                    <ul
                      style={{ listStyle: "outside", listStyleType: "initial" }}
                    >
                      <li>Demuestra dominio sobre el tema planteado.</li>
                      <li>
                        Reconoce las oportunidades de mejora aceptando alguna
                        critica constructiva.
                      </li>
                      <li>
                        Responde objetivamente ante las preguntas planteadas.
                      </li>
                      <li>Justifca claramente su proyecto.</li>
                      <li>Gestiona claramente el plan del proyecto.</li>
                    </ul>
                  </Table.Cell>

                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>Demuestra dominio sobre el tema planteado.</li>
                      <li>
                        Reconoce a medias las oportunidades de mejora aceptando
                        alguna critica constructiva.
                      </li>
                      <li>
                        Responde objetivamente ante las preguntas planteadas.
                      </li>
                      <li>Justifca medianamente su proyecto.</li>
                      <li>
                        Gestiona de una forma poco clara el plan del proyecto.
                      </li>
                    </ul>
                  </Table.Cell>
                  <Table.Cell>
                    <ul style={{ listStyle: "outside" }}>
                      <li>NO Demuestra dominio sobre el tema planteado.</li>
                      <li>
                        NO Reconoce las oportunidades de mejora aceptando alguna
                        critica constructiva.
                      </li>
                      <li>
                        NO Responde objetivamente ante las preguntas planteadas.
                      </li>
                      <li>NO Justifca claramente su proyecto.</li>
                      <li>NO Gestiona claramente el plan del proyecto.</li>
                    </ul>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    5 puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    [1-4] puntos
                  </Table.Cell>
                  <Table.Cell justify={"center"} className={cellClasses}>
                    0 puntos
                  </Table.Cell>
                </Table.Row>
                <Table.Row align={"center"}>
                  <Table.Cell justify={"center"}>puntaje</Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-blue-600 ${cellClasses}`}
                  >
                    {target && scoresValue[4][0]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-yellow-600 ${cellClasses}`}
                  >
                    {target && scoresValue[4][1]}
                  </Table.Cell>
                  <Table.Cell
                    justify={"center"}
                    className={`text-red-600 ${cellClasses}`}
                  >
                    {target && scoresValue[4][2]}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            {target && (
              <Flex direction="row" gap="4" className="mt-4">
                <Flex
                  direction="column"
                  gap="2"
                  className="h-full"
                  align={"start"}
                >
                  <strong>Puntaje final</strong>
                  <TextField.Input
                    style={{ width: 180, textAlign: "center" }}
                    size="3"
                    color="gray"
                    variant="surface"
                    readOnly
                    type="number"
                    placeholder=""
                    min={0}
                    max={20}
                    required
                    {...register("score")}
                  />
                </Flex>

                <TextArea
                  style={{ width: "auto" }}
                  defaultValue={task?.comment ?? ""}
                  readOnly={_readonly}
                  id="desc"
                  maxLength={255}
                  size="3"
                  color="gray"
                  variant="surface"
                  {...register("comment")}
                  placeholder="Observaciones"
                />
              </Flex>
            )}

            {_interactive && (
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
            )}
          </form>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};

export default Rubric;
