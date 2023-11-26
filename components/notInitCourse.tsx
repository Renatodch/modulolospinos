import Link from "next/link";
import { RiErrorWarningFill } from "react-icons/ri";
const NotInitCourse = () => {
  return (
    <div className="flex flex-col justify-center items-center space-x-2 pt-16">
      <RiErrorWarningFill />
      <p>No has iniciado el curso</p>
      <Link
        style={{ color: "blue", textDecoration: "underline" }}
        href="/curso"
      >
        ir a la sección del curso para iniciar
      </Link>
    </div>
  );
};

export default NotInitCourse;
