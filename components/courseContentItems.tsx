"use client";
import { Subject } from "@/model/types";
import { Button, Flex } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { AiFillYoutube } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";

interface Props {
  interactive?: boolean;
  progress?: number;
  selected?: number;
  onClickLink?: (id_subject: number, value_subject: number) => void;
  loading?: boolean;
  subjects: Subject[];
}

const CourseContentItems = ({
  interactive,
  progress,
  selected,
  onClickLink,
  loading,
  subjects,
}: Props) => {
  const router = useRouter();
  const styleClasses =
    "text-justify p-4 items-center gap-8 w-full flex hover:cursor-pointer hover:bg-blue-200";

  const handleClick = (id_subject: number, value_subject: number) => {
    if (interactive && onClickLink) {
      onClickLink(id_subject, value_subject);
    }
  };

  return (
    <Flex direction="column" gap="4">
      <div className="w-full flex-col border-4 border-gray-300 rounded-md ">
        <div className="border-b-4 border-gray-300 bg-gray-200 p-4">
          <p className="font-bold text-lg">Introducción a fracciones</p>
        </div>
        <ul className="w-full flex flex-col items-start justify-center overflow-hidden">
          {subjects
            .sort((a, b) => a.value - b.value)
            .map((subject) => {
              return interactive ? (
                <li
                  key={subject.id}
                  className={`${styleClasses} ${
                    selected === subject.id && "bg-blue-100"
                  } ${
                    (subject.value > progress! + 1 || loading) &&
                    "text-gray-400"
                  }`}
                  style={{
                    pointerEvents:
                      subject.value > progress! + 1 || loading ? "none" : "all",
                  }}
                  onClick={() => handleClick(subject.id, subject.value)}
                >
                  <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                  {subject.title}
                </li>
              ) : (
                <li
                  key={subject.id}
                  className={`${styleClasses} ${
                    selected === subject.id && "bg-blue-100"
                  } ${
                    subject.value > progress! || progress === undefined
                      ? "text-gray-400"
                      : ""
                  } flex justify-between`}
                  style={{
                    pointerEvents:
                      subject.value > progress! || progress === undefined
                        ? "none"
                        : "all",
                  }}
                >
                  <div className="flex">
                    <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                    {subject.title}
                  </div>
                  {progress != undefined && subject.value <= progress ? (
                    <Button
                      size={"3"}
                      onClick={() => {
                        router.push(`/curso/clases?index=${subject.id}`);
                      }}
                    >
                      {subject.value < progress ? "Ver" : "Continuar"}&nbsp;
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
