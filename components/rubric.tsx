"use client";

import { getActivityById } from "@/controllers/activity.controller";
import { saveTask } from "@/controllers/task.controller";
import { getScores } from "@/lib/utils";
import {
  Activity,
  PRIMARY_COLOR,
  QUALITY_BAD,
  QUALITY_EXCELENT,
  QUALITY_INSUFICIENT,
  RubricDetail,
  ScoreRubricDetail,
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
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { BsEyeFill } from "react-icons/bs";
import { toast } from "sonner";
import LoadingGeneric from "./loadingGeneric";

const Rubric = ({
  title,
  readonly,
  disabled,
  target,
  id_activity,
  iconTrigger,
}: {
  title: string;
  readonly?: boolean;
  disabled?: boolean;
  target?: Task;
  id_activity?: { id_activity: number | null };
  iconTrigger?: boolean;
}) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [activity, setActivity] = useState<Activity | undefined | null>(
    undefined
  );
  const [noRubric, setNoRubric] = useState<boolean>(false);

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
    const setData = async () => {
      if (target && target.id_activity) {
        updateActivity(target.id_activity);
      }
      setTask(target);
    };
    setData();
  }, [target]);

  useEffect(() => {
    const setData = async () => {
      id_activity?.id_activity && updateActivity(id_activity.id_activity);
    };
    setData();
  }, [id_activity]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "score") return;
      let score = 0;
      /*  Object.keys(value).forEach((e) => {
        if (e.startsWith("score") && e !== "score") score += +(value[e] ?? 0);
      }); */

      task && activity && updateArrayValues(task.scores, activity.rubric);
      setValue("score", score);
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
          scores: [],
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

  const toggleDialog = async (e: boolean) => {
    setOpenDialog(e);
    if (e && task && activity) {
      updateArrayValues(task.scores, activity.rubric);
      const score = getScores(task.scores).reduce(
        (acc, current) => acc + current,
        0
      );
      setValue("score", score);
    } else {
      reset();
    }
  };

  const updateArrayValues = (scoresJson: string[], rubricJson: string[]) => {
    const scores: ScoreRubricDetail[] = scoresJson.map((e) => JSON.parse(e));
    const rubric: RubricDetail[] = rubricJson.map((e) => JSON.parse(e));
    console.log(scores);
    console.log(rubric);
    //ScoreRubricDetail
    //RubricDetail
    const arr = [...scoresValue];
    /* arr[0][0] = score1 === 3 ? score1 : undefined;
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
    arr[4][2] = score5 === 0 ? score5 : undefined; */
    setScoresValue([...arr]);
  };

  const updateActivity = (id_activity: number) => {
    getActivityById(id_activity).then((_activity) => {
      setNoRubric(_activity?.rubric.length === 0);
      setActivity(_activity);
    });
  };
  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        {activity ? (
          task ? (
            <Button
              size={"3"}
              style={{
                width: iconTrigger ? "auto" : "150px",
                backgroundColor: PRIMARY_COLOR,
              }}
              disabled={disabled}
            >
              {_readonly ? "Ver Evaluación" : "Evaluar"}
            </Button>
          ) : (
            !target && (
              <Button
                size={"3"}
                style={{
                  width: iconTrigger ? "auto" : "150px",
                  backgroundColor: PRIMARY_COLOR,
                }}
              >
                {iconTrigger ? <BsEyeFill /> : "Ver Rúbrica"}
              </Button>
            )
          )
        ) : (
          <div style={{ height: "50px" }} className="py-4">
            <LoadingGeneric size={30} />
          </div>
        )}
      </Dialog.Trigger>
      {activity && (task || !target) && (
        <Dialog.Content style={{ maxWidth: 950 }}>
          {!noRubric ? (
            <>
              <Dialog.Title align={"center"}>{title}</Dialog.Title>
              <form className="w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
                <Table.Root variant="surface">
                  <Table.Header style={{ backgroundColor: PRIMARY_COLOR }}>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        justify={"center"}
                      ></Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify={"center"}>
                        {QUALITY_EXCELENT}
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify={"center"}>
                        {QUALITY_BAD}
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify={"center"}>
                        {QUALITY_INSUFICIENT}
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {activity.rubric.map((i, index) => {
                      const rubricDetail = JSON.parse(i) as RubricDetail;
                      const scores: ScoreRubricDetail[] =
                        _readonly || !task
                          ? []
                          : task.scores.map((e) => JSON.parse(e));
                      const defaultValue =
                        scores.find(
                          (scoreDetail) =>
                            scoreDetail.titleRubricDetail === rubricDetail.title
                        )?.value ?? 0;

                      return (
                        <React.Fragment key={index}>
                          <Table.Row align={"center"}>
                            <Table.Cell rowSpan={3} justify={"center"}>
                              <Flex direction={"column"} gap="2">
                                <span>{rubricDetail.title}</span>
                                {!_readonly && (
                                  <TextField.Input
                                    style={{ textAlign: "center" }}
                                    defaultValue={defaultValue}
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
                            {rubricDetail.items.map(
                              (item, rubricDetailIndex) => (
                                <React.Fragment key={rubricDetailIndex}>
                                  <Table.Cell>
                                    <ul
                                      style={{ listStyle: "outside" }}
                                      className="pl-4"
                                    >
                                      {item.descriptions.map(
                                        (description, index) => (
                                          <li key={index}>{description}</li>
                                        )
                                      )}
                                    </ul>
                                  </Table.Cell>
                                </React.Fragment>
                              )
                            )}
                          </Table.Row>
                          <Table.Row>
                            {rubricDetail.items.map((item, index) => {
                              let points = "0";
                              switch (index) {
                                case 0:
                                  points = rubricDetail.maxPoints.toString();
                                  break;
                                case 1:
                                  points = `[1-${rubricDetail.maxPoints - 1}]`;
                                  break;
                              }
                              return (
                                <React.Fragment key={index}>
                                  <Table.Cell
                                    justify={"center"}
                                    className={cellClasses}
                                  >
                                    {points}
                                  </Table.Cell>
                                </React.Fragment>
                              );
                            })}
                          </Table.Row>
                          <Table.Row align={"center"}>
                            <Table.Cell justify={"center"}>puntaje</Table.Cell>
                            {rubricDetail.items.map((item, index) => {
                              let clases = `${cellClasses}`;
                              switch (index) {
                                case 0:
                                  clases += "text-blue-600";
                                  break;
                                case 1:
                                  clases += "text-yellow-600";
                                  break;
                                case 2:
                                  clases += "text-red-600";
                                  break;
                              }
                              return (
                                <React.Fragment key={index}>
                                  <Table.Cell
                                    justify={"center"}
                                    className={cellClasses}
                                  >
                                    {target && scoresValue[0][0]}
                                  </Table.Cell>
                                </React.Fragment>
                              );
                            })}
                          </Table.Row>
                        </React.Fragment>
                      );
                    })}
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
            </>
          ) : (
            <div className="italic text-center w-full">Sin Rúbrica</div>
          )}
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};

export default Rubric;
