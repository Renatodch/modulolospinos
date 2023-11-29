import Link from "next/link";
import { RiErrorWarningFill } from "react-icons/ri";
const FinishCourse = () => {
  return (
    <div className="flex flex-col justify-center items-center space-x-2 pt-16">
      <RiErrorWarningFill />
      <p>Ya has finalizado el curso</p>
      <Link style={{ color: "blue", textDecoration: "underline" }} href="/">
        Ir a inicio
      </Link>
    </div>
  );
};

export default FinishCourse;
