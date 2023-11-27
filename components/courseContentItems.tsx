"use client";
import { Subject } from "@/model/types";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { AiFillYoutube } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";

interface Props {
  interactive?: boolean;
  progress: number;
  selected?: number;
  onClickLink?: (id_subject: number, value_subject: number) => void;
  inprogress?: boolean;
  subjects: Subject[];
}

const CourseContentItems = ({
  interactive,
  progress,
  selected,
  onClickLink,
  inprogress,
  subjects,
}: Props) => {
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
          {subjects.map((subject, index) => {
            return interactive ? (
              <li
                key={subject.id}
                className={`${styleClasses} ${
                  selected === subject.id && inprogress && "bg-blue-100"
                } ${(index > progress! + 1 || !inprogress) && "text-gray-400"}`}
                style={{
                  pointerEvents:
                    index > progress! + 1 || !inprogress ? "none" : "all",
                }}
                onClick={() => handleClick(subject.id, index)}
              >
                <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                {subject.title}
              </li>
            ) : (
              <li
                key={subject.id}
                className={`${styleClasses} ${
                  selected === subject.id && inprogress && "bg-blue-100"
                } ${
                  index > progress! || !inprogress ? "text-gray-400" : ""
                } flex justify-between`}
                style={{
                  pointerEvents:
                    index > progress! || !inprogress ? "none" : "all",
                }}
              >
                <div className="flex">
                  <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                  {subject.title}
                </div>
                {index <= progress && inprogress ? (
                  <Link
                    href={{
                      pathname: `/curso/clases`,
                      query: { index: subject.id },
                    }}
                    target="_blank"
                  >
                    <Button size={"3"}>
                      {index < progress ? "Ver" : "Continuar"}&nbsp;
                      <FaPlay />
                    </Button>
                  </Link>
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
