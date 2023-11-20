"use client";
import { SUBJECTS_COURSE } from "@/model/types";
import { Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { AiFillYoutube } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";

interface Props {
  interactive?: boolean;
  progress?: number;
  selected?: number;
  onClickLink?: (index: number) => void;
  loading?: boolean;
}

const CourseContentItems = ({
  interactive,
  progress,
  selected,
  onClickLink,
  loading,
}: Props) => {
  const router = useRouter();
  const styleClasses =
    "text-justify p-4 items-center gap-8 w-full flex hover:cursor-pointer hover:bg-blue-200";

  const handleClick = (index: number) => {
    if (interactive && onClickLink) {
      onClickLink(index);
    }
  };

  return (
    <Flex direction="column" gap="4">
      <div className="w-full flex-col border-4 border-gray-300 rounded-md ">
        <div className="border-b-4 border-gray-300 bg-gray-200 p-4">
          <p className="font-bold text-lg">Introducción a fracciones</p>
        </div>
        <ul className="w-full flex flex-col items-start justify-center overflow-hidden">
          {SUBJECTS_COURSE.map((i, index) => {
            return interactive ? (
              <li
                key={index}
                className={`${styleClasses} ${
                  selected === index && "bg-blue-100"
                } ${(index > progress! + 1 || loading) && "text-gray-400"}`}
                style={{
                  pointerEvents:
                    index > progress! + 1 || loading ? "none" : "all",
                }}
                onClick={() => handleClick(index)}
              >
                <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                {i.title}
              </li>
            ) : (
              <li
                key={index}
                className={`${styleClasses} ${
                  selected === index && "bg-blue-100"
                } ${
                  index > progress! || progress === undefined
                    ? "text-gray-400"
                    : ""
                } flex justify-between`}
                style={{
                  pointerEvents:
                    index > progress! || progress === undefined
                      ? "none"
                      : "all",
                }}
              >
                <div className="flex">
                  <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                  {i.title}
                </div>
                {progress != undefined && index <= progress ? (
                  <Button
                    size={"3"}
                    onClick={() => {
                      router.push(`/curso/clases?index=${index}`);
                    }}
                  >
                    {index < progress ? "Ver" : "Continuar"}&nbsp;
                    <FaPlay />
                  </Button>
                ) : (
                  <div></div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Flex>
  );
};

export default CourseContentItems;
