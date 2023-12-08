"use client";

import { saveTask } from "@/controllers/task.controller";
import {
  getRubricDetailObjects,
  getScoreObjects,
  getScores,
} from "@/lib/utils";
import {
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
  rubric,
  onlyIcon,
}: {
  title: string;
  readonly?: boolean;
  disabled?: boolean;
  target?: Task;
  rubric: { data: string[] };
  onlyIcon?: boolean;
}) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>(undefined);
  /*  const [activity, setActivity] = useState<Activity | undefined | null>(
    undefined
  ); */

  const [noRubric, setNoRubric] = useState<boolean>(false);
  const [scoresValue, setScoresValue] = useState<
    Array<Array<number | undefined>>
  >([]);

  const cellClasses = "border-l-2 border-gray-100";
  const _interactive = target && !readonly;

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
      setTask(target);
    };
    setData();
  }, [target]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "score") return;

      const scores = Object.keys(value).filter((val) =>
        val.startsWith("score_")
      );
      let score = scores.reduce((acc, s) => acc + +(value[s] ?? 0), 0);
      updateArrayValues(value, scores);
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

  const toggleDialog = async (open: boolean) => {
    setOpenDialog(open);
    if (open && task) {
      console.log("open dialog");
      setInitialScoreValues(task);
      const score = getScores(task.scores).reduce(
        (acc, current) => acc + current,
        0
      );
      setValue("score", score);
    } else {
      reset();
    }
  };

  const updateArrayValues = (
    inputValues: { [x: string]: any },
    scores: string[]
  ) => {
    if (!_interactive || !rubric.data.length) return;
    console.log("last");

    const details: RubricDetail[] = getRubricDetailObjects(rubric.data);
    const arr: Array<Array<number | undefined>> = [];
    details?.forEach((detail, indexDetail) => {
      let inputValue = scores?.find((score) => score === `score_${indexDetail}`)
        ? +inputValues[`score_${indexDetail}`]
        : undefined;
      let score: Array<number | undefined> = [];

      detail.items.forEach((item, ItemIndex) => {
        let value;
        if (inputValue !== undefined)
          switch (ItemIndex) {
            case 0:
              value = inputValue === +detail.maxPoints ? inputValue : undefined;
              break;
            case 1:
              value =
                inputValue > 0 && inputValue < +detail.maxPoints
                  ? inputValue
                  : undefined;
              break;
            case 2:
              value = inputValue === 0 ? inputValue : undefined;
              break;
          }
        score.push(value);
      });
      arr.push(score);
    });
    setScoresValue([...arr]);
  };

  const setInitialScoreValues = (task?: Task) => {
    if (!_interactive || !task || !rubric.data.length) return;

    const details: RubricDetail[] = getRubricDetailObjects(rubric.data);
    const taskScores = getScoreObjects(task.scores);
    const arr: Array<Array<number | undefined>> = [];

    details?.forEach((detail) => {
      let currentScore = taskScores.find(
        (score) => score.titleRubricDetail === detail.title
      );
      let score: Array<number | undefined> = [];

      detail.items.forEach((item, ItemIndex) => {
        let value;
        if (currentScore)
          switch (ItemIndex) {
            case 0:
              value =
                currentScore?.value === +detail.maxPoints
                  ? currentScore?.value
                  : undefined;
              break;
            case 1:
              value =
                currentScore?.value > 0 &&
                currentScore?.value < +detail.maxPoints
                  ? currentScore?.value
                  : undefined;
              break;
            case 2:
              value =
                currentScore?.value === 0 ? currentScore?.value : undefined;
              break;
          }
        score.push(value);
      });
      arr.push(score);
    });
    console.log(arr);
    setScoresValue([...arr]);
  };

  /*   const updateActivity = () => {
    setNoRubric(activity?.rubric.length === 0);

    updateArrayValues2(task, activity);
  }; */
  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        {rubric ? (
          task ? (
            <Button
              size={"3"}
              style={{
                width: onlyIcon ? "auto" : "150px",
                backgroundColor: PRIMARY_COLOR,
              }}
              disabled={disabled}
            >
              {readonly ? "Ver Evaluación" : "Evaluar"}
            </Button>
          ) : (
            <Button
              size={"3"}
              style={{
                width: onlyIcon ? "auto" : "150px",
                backgroundColor: PRIMARY_COLOR,
              }}
            >
              {onlyIcon ? (
                <BsEyeFill />
              ) : (
                <>
                  <BsEyeFill />
                  Ver Rúbrica
                </>
              )}
            </Button>
          )
        ) : (
          <div style={{ height: "50px" }} className="py-4">
            <LoadingGeneric size={30} />
          </div>
        )}
      </Dialog.Trigger>
      {rubric && (
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
                    {rubric.data.map((rubricDetail, indexDetail) => {
                      const _rubricDetail = JSON.parse(
                        rubricDetail
                      ) as RubricDetail;
                      const scores: ScoreRubricDetail[] = !(readonly && task)
                        ? []
                        : task.scores.map((score) => JSON.parse(score));
                      const defaultValue =
                        scores.find(
                          (scoreDetail) =>
                            scoreDetail.titleRubricDetail ===
                            _rubricDetail.title
                        )?.value ?? 0;

                      return (
                        <React.Fragment key={indexDetail}>
                          <Table.Row align={"center"}>
                            <Table.Cell rowSpan={3} justify={"center"}>
                              <Flex direction={"column"} gap="2">
                                <span>{_rubricDetail.title}</span>
                                {_interactive && (
                                  <TextField.Input
                                    style={{ textAlign: "center" }}
                                    defaultValue={defaultValue}
                                    size="3"
                                    color="gray"
                                    variant="surface"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    max={_rubricDetail.maxPoints}
                                    required
                                    {...register(`score_${indexDetail}`)}
                                  />
                                )}
                              </Flex>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row align={"start"}>
                            {_rubricDetail.items.map((item, itemIndex) => (
                              <React.Fragment key={itemIndex}>
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
                            ))}
                          </Table.Row>
                          <Table.Row>
                            {_rubricDetail.items.map((item, index) => {
                              let points = "0";
                              switch (index) {
                                case 0:
                                  points = _rubricDetail.maxPoints.toString();
                                  break;
                                case 1:
                                  points = `[1-${_rubricDetail.maxPoints - 1}]`;
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
                          {_interactive && (
                            <Table.Row align={"center"}>
                              <Table.Cell justify={"center"}>
                                puntaje
                              </Table.Cell>
                              {_rubricDetail.items.map((item, index) => {
                                let clases = `${cellClasses}`;
                                let value = scoresValue
                                  .at(indexDetail)
                                  ?.at(index);

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
                                      {value}
                                    </Table.Cell>
                                  </React.Fragment>
                                );
                              })}
                            </Table.Row>
                          )}
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
                      readOnly={readonly}
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
