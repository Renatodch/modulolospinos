"use client";
import { SUBJECTS_COURSE } from "@/model/types";
import { Flex } from "@radix-ui/themes";
import { AiFillYoutube } from "react-icons/ai";

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
  const styleClasses = `text-justify p-4 items-center gap-8 w-full flex ${
    interactive && "hover:cursor-pointer hover:bg-blue-200"
  }`;
  /* const [selected, setSelected] = useState<number | undefined>(undefined);
  useEffect(() => {
    setSelected(progress);
  }, []);
 */
  const handleClick = (index: number) => {
    if (interactive && onClickLink) {
      //setSelected(index);
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
              <li key={index} className={`${styleClasses}`}>
                <AiFillYoutube size="24" style={{ minWidth: 50 }} />
                {i.title}
              </li>
            );
          })}
        </ul>
      </div>
    </Flex>
  );
};

export default CourseContentItems;
