"use client";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";
import { AiFillYoutube } from "react-icons/ai";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

interface Props {
  interactive?: boolean;
  progress?: number | null;
}

const CourseContentItems = ({ interactive, progress }: Props) => {
  const _progress = progress || 0;
  const [selectedIndex, setSelectedIndex] = useState<number | null | undefined>(
    _progress
  );

  const styleClasses = `text-justify p-4 items-center gap-8 w-full flex ${
    interactive && "hover:cursor-pointer hover:bg-gray-300"
  }`;

  const items = [
    {
      el: <AiFillYoutube size="24" />,
      text: "Qué es una fracción",
      //value: "0",
    },
    {
      el: <HiOutlineQuestionMarkCircle size="24" />,
      text: "Introducción a fracciones",
      //value: "2",
    },
    {
      el: <AiFillYoutube size="24" />,
      text: "Suma y resta de fracciones con denominadores comunes",
      //value: "3",
    },
    {
      el: <AiFillYoutube size="24" />,
      text: "Suma y resta de fracciones con denominadores diferentes",
      //value: "4",
    },
    {
      el: <AiFillYoutube size="24" />,
      text: "Tarea final del curso",
      //value: "5",
    },
  ];

  return (
    <Flex direction="column" gap="4">
      <div className="w-full flex-col border-4 border-gray-300 rounded-md ">
        <div className="border-b-4 border-gray-300 bg-gray-200 p-4">
          <p className="font-bold text-lg">Introducción a fracciones</p>
        </div>
        <ul className="w-full flex flex-col items-start justify-center overflow-hidden">
          {items.map((i, index) => (
            <li
              key={index}
              className={`${styleClasses} ${
                selectedIndex === index && interactive && "bg-gray-200"
              } ${
                index != 4 &&
                index > _progress &&
                interactive &&
                "text-gray-400"
              }`}
              style={{
                pointerEvents: index != 4 && index > _progress ? "none" : "all",
              }}
            >
              {interactive ? (
                <Link
                  className="flex gap-4"
                  href={{ pathname: `/curso/clases`, query: { item: index } }}
                  onClick={() => setSelectedIndex(index)}
                >
                  {i.el}
                  {i.text}
                </Link>
              ) : (
                <>
                  {i.el}
                  {i.text}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Flex>
  );
};

export default CourseContentItems;
