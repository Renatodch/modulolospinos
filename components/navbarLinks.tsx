"use client";
import { useUserContext } from "@/app/context";
import { getTaskByUserId } from "@/controllers/task.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import {
  COURSE_IN_PROCESS,
  PRIMARY_COLOR,
  STUDENT,
  TEACHER,
  getToastPendingProject,
} from "@/model/types";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Links = () => {
  const { user } = useUserContext();
  useEffect(() => {
    alertState();
  });

  const alertState = async () => {
    const user_course = await getUserCourseByUserId(user?.id || 0);
    const project = await getTaskByUserId(user?.id || 0);

    user_course?.date_project_send_max &&
      !project &&
      user_course.state === COURSE_IN_PROCESS &&
      toast.warning(
        getToastPendingProject(user_course?.date_project_send_max),
        {
          duration: 5000,
        }
      );
  };

  const links = [
    {
      label: "Inicio",
      href: "/",
    },

    {
      label: "Profesor",
      href: "/profesor",
      ops: [
        {
          label: "Actividades",
          href: "/actividades",
        },
        {
          label: "Estudiantes",
          href: "/estudiantes",
        },
      ],
    },
    {
      label: "Curso",
      href: "/curso",
    },
    {
      label: "Tareas",
      href: "/tareas",
      ops: [
        {
          label: "Portafolio",
          href: "/portafolio",
        },
        {
          label: "Preguntas",
          href: "/preguntas",
        },
      ],
    },
    {
      label: "Notas",
      href: "/notas",
    },
    {
      label: "Salir",
      href: "/signOut",
    },
  ];

  (user?.type || STUDENT) === STUDENT && links.splice(1, 1);
  (user?.type || STUDENT) === TEACHER && links.splice(3, 2);

  return links.map((link) =>
    link.href === "/signOut" ? (
      <button
        key={link.href}
        className={` hover:text-zinc-700 transition-colors text-base text-white`}
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        {link.label}
      </button>
    ) : (
      <LinkItem key={link.href} link={link} />
    )
  );
};

const LinkItem = ({ link, onLinkClick }: any) => {
  const currentPath = usePathname();
  const itemStyle = `${
    link.href === currentPath ? "text-zinc-900" : "text-white"
  } hover:text-zinc-700 transition-colors text-base`;

  return link.ops ? (
    <li key={link.href}>
      <details>
        <summary
          className={itemStyle}
          style={{ backgroundColor: `${PRIMARY_COLOR} !important` }}
        >
          {link.label}
        </summary>
        <ul
          className="p-2"
          style={{ background: `${PRIMARY_COLOR} !important`, zIndex: 1000 }}
        >
          {link.ops.map((l: any) => (
            <li key={l.href}>
              <Link
                className={itemStyle}
                href={l.href}
                style={{ backgroundColor: `${PRIMARY_COLOR} !important` }}
                onClick={onLinkClick}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </li>
  ) : (
    <li key={link.href}>
      <Link
        className={itemStyle}
        href={link.href}
        style={{ backgroundColor: `${PRIMARY_COLOR} !important` }}
      >
        {link.label}
      </Link>
    </li>
  );
};

export default Links;
