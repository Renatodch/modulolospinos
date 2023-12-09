"use client";
import { saveActivity } from "@/controllers/activity.controller";
import {
  Activity,
  MIN_SCORE_BY_ITEM,
  PRIMARY_COLOR,
  QUALITY_BAD,
  QUALITY_EXCELENT,
  QUALITY_INSUFICIENT,
  RubricDetail,
  RubricItemDetail,
  TOAST_BD_ERROR,
  TOAST_LOADING,
  TOAST_RUBRIC_SAVE_SUCCESS,
} from "@/model/types";
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Table,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaPlusCircle } from "react-icons/fa";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { PiNotePencilFill } from "react-icons/pi";
import { toast } from "sonner";

const RubricForm = ({ target }: { target: Activity }) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);
  const [rubricDetails, setRubricDetails] = useState<RubricDetail[]>([]);
  const cellClasses = "border-l-2 border-gray-100";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
    watch,
    unregister,
    clearErrors,
  } = useForm();

  useEffect(() => {
    const setData = () => {
      setLoaded(true);
    };
    setData();
  }, [target]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "scoresTotal") return;
      let score = 0;
      Object.keys(value).forEach((e) => {
        if (e.startsWith("point")) score += +(value[e] ?? 0);
      });
      setValue("scoresTotal", score, { shouldValidate: true });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: FieldValues) => {
    setSubmitted(true);
    const inputs = watch();
    let rubric: string[] = [];

    rubricDetails.forEach((detail, detailIndex) => {
      const items: RubricItemDetail[] = [];

      detail.items.forEach((itemDetail, itemIndex) => {
        const descriptions: string[] = [];
        itemDetail.descriptions.forEach((_, descriptionIndex) => {
          descriptions.push(
            inputs[`desc_${detailIndex}_${itemIndex}_${descriptionIndex}`]
          );
        });
        items.push({
          quality:
            itemIndex === 0
              ? QUALITY_EXCELENT
              : itemIndex === 1
              ? QUALITY_BAD
              : QUALITY_INSUFICIENT,
          descriptions,
        });
      });

      const temp: RubricDetail = {
        title: inputs[`title_${detailIndex}`],
        maxPoints: inputs[`point_${detailIndex}_0`],
        items,
      };
      rubric.push(JSON.stringify(temp));
    });
    toast.promise(
      new Promise((resolve, reject) => {
        let temp: Activity = {
          ...target,
          rubric,
        };

        saveActivity(temp)
          .then(resolve)
          .catch(() => reject(TOAST_BD_ERROR));
      }),
      {
        loading: TOAST_LOADING,
        success: () => TOAST_RUBRIC_SAVE_SUCCESS,
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
      setLoaded(false);
      setRubricDetails([]);
      reset();
    } else {
      const details: RubricDetail[] = [];
      let scoresTotal = 0;
      target.rubric.forEach((detail) => {
        const json: RubricDetail = JSON.parse(detail);
        details.push(json);
        scoresTotal += +json.maxPoints;
      });
      setValue("scoresTotal", scoresTotal);
      setRubricDetails(details);
      setLoaded(true);
    }
  };

  const handleClickAddDescription = (
    event: Event,
    indexDetail: number,
    indexItemDetail: number
  ) => {
    event?.preventDefault();
    const detail = rubricDetails.at(indexDetail);
    const item = detail?.items.at(indexItemDetail);
    item?.descriptions.push("");
    setRubricDetails([...rubricDetails]);
  };
  const handleClickRemoveDescription = (
    event: Event,
    indexDetail: number,
    indexItemDetail: number
  ) => {
    event?.preventDefault();
    const detail = rubricDetails.at(indexDetail);
    const item = detail?.items.at(indexItemDetail);
    if (item) {
      unregister(
        `desc_${indexDetail}_${indexItemDetail}_${item.descriptions.length - 1}`
      );
      item?.descriptions.pop();
      setRubricDetails([...rubricDetails]);
    }
  };
  const handleClickAddRubricDetail = (event: any) => {
    event?.preventDefault();
    let scoresTotal = +(getValues("scoresTotal") ?? 0) + MIN_SCORE_BY_ITEM;
    setValue("scoresTotal", scoresTotal);
    setRubricDetails([
      ...rubricDetails,
      {
        maxPoints: MIN_SCORE_BY_ITEM,
        title: "",
        items: [
          {
            descriptions: [],
            quality: QUALITY_EXCELENT,
          },
          {
            descriptions: [],
            quality: QUALITY_BAD,
          },
          {
            descriptions: [],
            quality: QUALITY_INSUFICIENT,
          },
        ],
      },
    ]);
  };
  const handleClickRemoveRubricDetail = (event: Event) => {
    event?.preventDefault();
    const lastIndexDetail = rubricDetails.length - 1;
    unregister(`point_${lastIndexDetail}_0`);
    unregister(`title_${lastIndexDetail}`);
    rubricDetails.pop();
    setRubricDetails([...rubricDetails]);
  };

  return (
    <Dialog.Root open={openDialog} onOpenChange={toggleDialog}>
      <Dialog.Trigger>
        <Flex justify={"start"}>
          {
            <Button size="3" style={{ backgroundColor: PRIMARY_COLOR }}>
              <PiNotePencilFill size="20" />
            </Button>
          }
        </Flex>
      </Dialog.Trigger>

      {loaded && (
        <Dialog.Content style={{ maxWidth: 1200 }}>
          <Dialog.Title align={"center"}>Formulario de Rúbrica</Dialog.Title>
          <Dialog.Description size="2" mb="4"></Dialog.Description>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="0">
              {rubricDetails.length > 0 && (
                <Table.Root variant="surface">
                  <Table.Header style={{ backgroundColor: PRIMARY_COLOR }}>
                    <Table.Row>
                      <Table.ColumnHeaderCell justify={"center"}>
                        <strong className="mb-2">Total Puntos</strong>
                        <div className="mt-2">
                          <TextField.Input
                            className="rounded-md text-center"
                            style={{
                              background: "#f0f0f0",
                              color:
                                errors.scoresTotal?.type === "min" ||
                                errors.scoresTotal?.type === "max"
                                  ? "red"
                                  : "black",
                            }}
                            readOnly
                            size="3"
                            color="gray"
                            variant="surface"
                            type="number"
                            max={20}
                            min={MIN_SCORE_BY_ITEM}
                            placeholder="20 Puntos"
                            required
                            {...register(`scoresTotal`, {
                              max: 20,
                              min: 20,
                            })}
                          />
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify={"center"}>
                        <div className="flex items-center justify-center h-full">
                          {QUALITY_EXCELENT}
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify={"center"}>
                        <div className="flex items-center justify-center h-full">
                          {QUALITY_BAD}
                        </div>
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify={"center"}>
                        <div className="flex items-center justify-center h-full">
                          {QUALITY_INSUFICIENT}
                        </div>
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {rubricDetails.map((rubricDetail, indexRubricDetail) => {
                      return (
                        <React.Fragment key={indexRubricDetail}>
                          <Table.Row align={"center"}>
                            <Table.Cell rowSpan={3} justify={"center"}>
                              <TextArea
                                style={{ textAlign: "center" }}
                                defaultValue={rubricDetail.title}
                                size="3"
                                color="gray"
                                variant="surface"
                                placeholder="Título*"
                                required
                                {...register(`title_${indexRubricDetail}`)}
                              />
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row align={"start"}>
                            {rubricDetail.items.map((item, itemIndex) => (
                              <React.Fragment key={itemIndex}>
                                <Table.Cell style={{ width: "25%" }}>
                                  <ul
                                    style={{ listStyle: "outside" }}
                                    className="pl-4"
                                  >
                                    {item.descriptions.map(
                                      (description, index) => (
                                        <li
                                          key={index}
                                          className="flex justify-center items-start gap-1 mb-2"
                                        >
                                          <TextArea
                                            style={{ textAlign: "left" }}
                                            defaultValue={description}
                                            size="2"
                                            color="gray"
                                            variant="surface"
                                            placeholder="Descripción*"
                                            required
                                            {...register(
                                              `desc_${indexRubricDetail}_${itemIndex}_${index}`
                                            )}
                                          />
                                        </li>
                                      )
                                    )}
                                    <div className="flex gap-4 justify-center items-center w-full">
                                      <IconButton
                                        size={"2"}
                                        onClick={(e: any) =>
                                          handleClickAddDescription(
                                            e,
                                            indexRubricDetail,
                                            itemIndex
                                          )
                                        }
                                      >
                                        <FaPlusCircle />
                                      </IconButton>

                                      {item.descriptions.length > 0 && (
                                        <IconButton
                                          size={"2"}
                                          onClick={(e: any) =>
                                            handleClickRemoveDescription(
                                              e,
                                              indexRubricDetail,
                                              itemIndex
                                            )
                                          }
                                          color="red"
                                        >
                                          <MdOutlineRemoveCircle />
                                        </IconButton>
                                      )}
                                    </div>
                                  </ul>
                                </Table.Cell>
                              </React.Fragment>
                            ))}
                          </Table.Row>
                          <Table.Row align={"center"}>
                            {rubricDetail.items.map((item, itemIndex) => {
                              const current =
                                +(
                                  watch(`point_${indexRubricDetail}_0`) ??
                                  rubricDetail.maxPoints
                                ) - 1;
                              let points =
                                itemIndex === 1
                                  ? current <= 1
                                    ? "1"
                                    : `[1-${current}]`
                                  : "0";

                              return (
                                <React.Fragment key={itemIndex}>
                                  <Table.Cell
                                    justify={"center"}
                                    className={cellClasses}
                                  >
                                    {itemIndex === 0 ? (
                                      <TextField.Input
                                        style={{ textAlign: "center" }}
                                        defaultValue={rubricDetail.maxPoints}
                                        size="3"
                                        color="gray"
                                        variant="surface"
                                        type="number"
                                        max={20}
                                        min={MIN_SCORE_BY_ITEM}
                                        placeholder="Puntos*"
                                        required
                                        {...register(
                                          `point_${indexRubricDetail}_0`
                                        )}
                                      />
                                    ) : (
                                      points
                                    )}
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
              )}

              <div className="flex justify-center gap-4 items-center mt-4">
                <Button onClick={(e: any) => handleClickAddRubricDetail(e)}>
                  <span>Agregar Criterio de Evaluación</span>
                  <FaPlusCircle />
                </Button>
                {rubricDetails.length > 0 && (
                  <Button
                    onClick={(e: any) => handleClickRemoveRubricDetail(e)}
                    color="red"
                  >
                    <span>Remover Criterio de Evaluación</span>
                    <MdOutlineRemoveCircle />
                  </Button>
                )}
              </div>
            </Flex>
            {rubricDetails.length > 0 && (
              <p className="mt-2">Todos los campos obligatorios</p>
            )}
            {rubricDetails.length > 0 &&
              (errors.scoresTotal?.type === "min" ||
                errors.scoresTotal?.type === "max") && (
                <div className="w-full flex justify-end">
                  <span role="alert" className="font-semibold text-red-500 ">
                    Total puntos debe ser igual a 20
                  </span>
                </div>
              )}
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
                disabled={
                  submitted ||
                  (rubricDetails.length > 0 &&
                    (errors.scoresTotal?.type === "min" ||
                      errors.scoresTotal?.type === "max"))
                }
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

export default RubricForm;
