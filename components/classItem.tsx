import { getDay, getMonth } from "@/lib/date-lib";
import { ScrollArea } from "@radix-ui/themes";
import ProjectForm from "./projectForm";

interface Props {
  item: number;
  maxDateToSend?: Date | null;
}
const ClassItem = ({ item, maxDateToSend }: Props) => {
  const descStyleClasses = "h-2/6 mt-4 w-full text-justify pr-2";
  const itemList = [
    {
      url: "https://www.youtube.com/embed/g2rI5mAWPeU?si=gaIOzQXC2YIck04Q",
      description: "Descripcion del video 1",
    },
    {
      url: "https://www.youtube.com/embed/grlbI4ZgzXA?si=cwo501nM1bxquX2R",
      description: "Descripcion del video 2",
    },
    {
      url: "https://www.youtube.com/embed/qJtoI1ipxs8?si=3lhYpUKrMrkFhmtb",
      description: "Descripcion del video 3",
    },
    {
      url: "https://www.youtube.com/embed/Ew9yAW7bf7U?si=xU_jO-6wOf2_5jTF",
      description: "Descripcion del video 4",
    },
    {
      url: "",
      description: `A continuación deberá llenar y subir un formulario con datos de su proyecto de fin de curso, el tiempo de
      la realización es de 1 día por lo que
        la fecha máxima de entrega es hasta el dia ${getDay(
          maxDateToSend?.getDay() || 1
        )} ${maxDateToSend?.getDate()} de ${getMonth(
        maxDateToSend?.getMonth() || 1
      )} del ${maxDateToSend?.getFullYear()} a las ${(
        "" + (maxDateToSend?.getHours() || "00")
      ).padStart(2, "0")}:${(
        "" + (maxDateToSend?.getMinutes() || "00")
      ).padStart(
        2,
        "0"
      )}. Tendrá 1 intento permitido, y si el proyecto es reprobado podrá volver a intentarlo 2 veces más
       reiniciándose el tiempo de la realización de 1 día`,
    },
  ];
  return (
    <ScrollArea
      className="px-3 py-3 shadow-sm shadow-gray-400"
      style={{ height: "500px" }}
      type="always"
      scrollbars="vertical"
    >
      {itemList.map((i, index) => {
        return (
          index === item && (
            <div
              key={i.url}
              style={{ height: "500px" }}
              className="self-stretch w-full   flex flex-col justify-center items-center  h-3/6"
            >
              {item < 4 ? (
                <iframe
                  style={{ width: "100%", height: "100%" }}
                  width="560"
                  height="315"
                  src={i.url}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              ) : (
                <p className="font-bold text-lg">Proyecto final del curso</p>
              )}
              <div className={descStyleClasses}>{i.description}</div>
              {item === 4 && (
                <div className="flex justify-end w-full h-1/6">
                  <ProjectForm />
                </div>
              )}
            </div>
          )
        );
      })}
    </ScrollArea>
  );
};

export default ClassItem;
