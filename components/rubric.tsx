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
import { MdEdit } from "react-icons/md";
import { PiNoteFill } from "react-icons/pi";
import { toast } from "sonner";

const Rubric = ({
  title,
  readonly,
  preview,
  disabled,
  target,
  rubric,
  onlyIcon,
}: {
  title: string;
  readonly?: boolean;
  preview?: boolean;
  disabled?: boolean;
  target?: Task;
  rubric: { data: string[] };
  onlyIcon?: boolean;
}) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [task, setTask] = useState<Task | undefined>(undefined);

  const isrubric = rubric.data.length > 0;
  const [scoresValue, setScoresValue] = useState<
    Array<Array<number | undefined>>
  >([]);

  const cellClasses = "border-l-2 border-gray-100";
  const _interactive = !preview && !readonly;

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
      if (target) {
        setInitialScoreValues(target);
        const score = getScores(target.scores).reduce(
          (acc, current) => acc + current,
          0
        );
        setValue("score", score);
      }
      setTask(target);
    };
    setData();
  }, [target]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "score" || name === "comment") return;

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
        const inputs = watch();
        const details = getRubricDetailObjects(rubric.data);
        const scores: string[] = [];
        details.forEach((detail, detailIndex) => {
          const scoreDetail: ScoreRubricDetail = {
            titleRubricDetail: detail.title,
            value: +inputs[`score_${detailIndex}`],
          };
          scores.push(JSON.stringify(scoreDetail));
        });

        const temp: Task = {
          id: task.id,
          title: task.title,
          description: task.description,
          image1: task.image1,
          date_upload: task.date_upload,
          score: +data.score,
          scores,
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
    if (open && target) {
      let score = 0;
      if (isrubric) {
        setInitialScoreValues(target);
        score = getScores(target.scores).reduce(
          (acc, current) => acc + current,
          0
        );
      } else if (target.score != null) {
        score = target.score;
      }
      setValue("score", score);
    } else {
      reset();
    }
  };

  const updateArrayValues = (
    inputValues: { [x: string]: any },
    scores: string[]
  ) => {
    if (!_interactive || !isrubric) return;

    const details: RubricDetail[] = getRubricDetailObjects(rubric.data);
    const arr: Array<Array<number | undefined>> = [];
    details?.forEach((detail, indexDetail) => {
      let inputValue = scores?.find((score) => score === `score_${indexDetail}`)
        ? +inputValues[`score_${indexDetail}`]
        : undefined;
      let score: Array<number | undefined> = [];

      detail.items.forEach((item, ItemIndex) => {
        let value;
        switch (ItemIndex) {
          case 0:
            value = inputValue === +detail.maxPoints ? inputValue : undefined;
            break;
          case 1:
            value =
              inputValue && inputValue < +detail.maxPoints
                ? inputValue
                : undefined;
            break;
          case 2:
            value =
              inputValue === undefined
                ? 0
                : inputValue === 0
                ? inputValue
                : undefined;
            break;
        }
        score.push(value);
      });
      arr.push(score);
    });
    setScoresValue([...arr]);
  };

  const setInitialScoreValues = (task?: Task) => {
    if (preview || !task || !isrubric) return;

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
        switch (ItemIndex) {
          case 0:
            value =
              currentScore?.value === +detail.maxPoints
                ? currentScore.value
                : undefined;
            break;
          case 1:
            value =
              currentScore &&
              currentScore?.value > 0 &&
              currentScore?.value < +detail.maxPoints
                ? currentScore?.value
                : undefined;
            break;
          case 2:
            value =
              currentScore === undefined
                ? 0
                : currentScore.value === 0
                ? currentScore.value
                : undefined;
            break;
        }
        score.push(value);
      });
      arr.push(score);
    });
    setScoresValue([...arr]);
  };

  const getDefaultValue = (_rubricDetail: RubricDetail) => {
    const scores: ScoreRubricDetail[] =
      preview || readonly || !task
        ? []
        : task.scores.map((score) => JSON.parse(score));

    const defaultValue = +(
      scores.find(
        (scoreDetail) => scoreDetail.titleRubricDetail === _rubricDetail.title
      )?.value ?? 0
    );
    return defaultValue;
  };

  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        {preview ? (
          <Button
            size={"3"}
            style={{
              width: onlyIcon ? "auto" : "150px",
              backgroundColor: PRIMARY_COLOR,
            }}
          >
            {onlyIcon ? (
              <PiNoteFill />
            ) : (
              <>
                <PiNoteFill />
                Rúbrica
              </>
            )}
          </Button>
        ) : (
          (_interactive || (readonly && isrubric)) && (
            <Button
              size={"3"}
              style={{
                width: readonly ? "180px" : "auto",
                backgroundColor: PRIMARY_COLOR,
              }}
              disabled={disabled}
            >
              {readonly ? (
                <>
                  <BsEyeFill />
                  Ver Evaluación
                </>
              ) : (
                <>
                  <MdEdit />
                  Evaluar
                </>
              )}
            </Button>
          )
        )}
      </Dialog.Trigger>
      {
        <Dialog.Content style={{ maxWidth: 950 }}>
          <>
            <Dialog.Title align={"center"}>{title}</Dialog.Title>
            <form className="w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
              {isrubric && (preview || task) && (
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
                      const defaultValue = getDefaultValue(_rubricDetail);
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
                                    max={+_rubricDetail.maxPoints}
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
                                  points =
                                    +_rubricDetail.maxPoints == 2
                                      ? "1"
                                      : `[1-${+_rubricDetail.maxPoints - 1}]`;
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
                          {!preview && (
                            <Table.Row align={"center"}>
                              <Table.Cell justify={"center"}>
                                puntaje
                              </Table.Cell>
                              {_rubricDetail.items.map((item, index) => {
                                let cellStyle = `${cellClasses} `;
                                let value = scoresValue
                                  .at(indexDetail)
                                  ?.at(index);

                                switch (index) {
                                  case 0:
                                    cellStyle += "text-blue-600";
                                    break;
                                  case 1:
                                    cellStyle += "text-yellow-600";
                                    break;
                                  case 2:
                                    cellStyle += "text-red-600";
                                    break;
                                }
                                return (
                                  <React.Fragment key={index}>
                                    <Table.Cell
                                      justify={"center"}
                                      className={cellStyle}
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
              )}
              {task && !preview && (
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
                      readOnly={isrubric}
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
        </Dialog.Content>
      }
    </Dialog.Root>
  );
};

export default Rubric;
