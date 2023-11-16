"use client";
import { SUBJECTS_COURSE } from "@/model/types";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";
import { AiFillYoutube } from "react-icons/ai";

interface Props {
  interactive?: boolean;
  progress: number;
  selected: number;
}

const CourseContentItems = ({ interactive, progress, selected }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null | undefined>(
    selected
  );

  const styleClasses = `text-justify p-4 items-center gap-8 w-full flex ${
    interactive && "hover:cursor-pointer hover:bg-blue-200"
  }`;

  return (
    <Flex direction="column" gap="4">
      <div className="w-full flex-col border-4 border-gray-300 rounded-md ">
        <div className="border-b-4 border-gray-300 bg-gray-200 p-4">
          <p className="font-bold text-lg">Introducción a fracciones</p>
        </div>
        <ul className="w-full flex flex-col items-start justify-center overflow-hidden">
          {SUBJECTS_COURSE.map((i, index) => (
            <li
              key={index}
              className={`${styleClasses} ${
                selectedIndex === index && interactive && "bg-blue-100"
              } ${index > progress + 1 && interactive && "text-gray-400"}`}
              style={{
                pointerEvents: index > progress + 1 ? "none" : "all",
              }}
            >
              {interactive ? (
                <Link
                  href={{ pathname: `/curso/clases`, query: { item: index } }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <AiFillYoutube
                    size="24"
                    style={{ display: "inline-block" }}
                  />
                  <span className="ml-3">{i.title}</span>
                </Link>
              ) : (
                <>
                  <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                  {i.title}
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
