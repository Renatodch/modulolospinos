import { ScrollArea } from "@radix-ui/themes";
import ProjectForm from "./projectForm";

interface Props {
  item: number;
}
const ClassItem = ({ item }: Props) => {
  const descStyleClasses = "h-2/6 mt-4";
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
      description: "Descripcion del video 5",
    },
  ];
  return (
    <ScrollArea
      className="pr-3"
      style={{ height: "400px" }}
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
              <iframe
                style={{ width: "100%", height: "100%" }}
                width="560"
                height="315"
                src={i.url}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
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
