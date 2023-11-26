"use client";
import { useUserContext } from "@/app/context";
import { getActivities } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTasksByUserId } from "@/controllers/task.controller";
import { getUserCourseByUserId } from "@/controllers/user-course.controller";
import { getTasksActivityDetail } from "@/lib/utils";
import {
  IN_PROGRESS,
  STUDENT,
  getToastPendingActivities,
  getToastPendingTasksAlert,
} from "@/model/types";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Links = () => {
  const { user } = useUserContext();
  useEffect(() => {
    alertState(user?.id ?? 0);
  });

  const links = [
    {
      label: "Inicio",
      href: "/",
      width: "90px",
    },
    {
      label: "Profesores y Administradores",
      href: "/administradores",
      width: "170px",
    },
    {
      label: "Profesor",
      href: null,
      width: "120px",
      ops: [
        {
          label: "Temas",
          href: "/temas",
        },
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
      width: "120px",
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
  ];

  user?.type === STUDENT && links.splice(2, 2);
  return (
    <>
      {links.map((link) => (
        <LinkItem key={link.href} link={link} />
      ))}
      <button
        className={` hover:text-zinc-700 transition-colors text-base text-white`}
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Salir
      </button>
    </>
  );
};

const LinkItem = ({ link }: any) => {
  const { user } = useUserContext();
  const currentPath = usePathname();

  const itemStyle = `${
    link.href === currentPath ? "text-zinc-900" : "text-white"
  } hover:text-zinc-700 transition-colors text-base`;

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickLink = () => alertState(user?.id ?? 0);

  const handleClickOutside = (e: Event) => {
    const arr = document.querySelectorAll("details");
    arr.forEach((a) => {
      if (!e.composedPath().includes(a) && a.open) {
        a.open = false;
      }
    });
  };
  return link.ops ? (
    <li
      key={link.href}
      style={{ width: link.width, margin: 0 }}
      className="self-center"
    >
      <details>
        <summary className={`${itemStyle} navbar-link`}>
          {link.href !== null ? (
            <Link href={link.href} onClick={handleClickLink}>
              {link.label}
            </Link>
          ) : (
            link.label
          )}
        </summary>
        <ul className="p-2 navbar-link container">
          {link.ops.map((l: any) => (
            <li key={l.href}>
              <Link
                className={`${itemStyle} navbar-link`}
                href={l.href}
                onClick={handleClickLink}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </li>
  ) : (
    <li
      key={link.href}
      style={{ width: link.width, margin: 0 }}
      className="self-center"
    >
      <Link
        className={`${itemStyle} navbar-link`}
        href={link.href}
        onClick={handleClickLink}
      >
        {link.label}
      </Link>
    </li>
  );
};
const alertState = async (id: number) => {
  const subjects = await getSubjects();
  const user_course = await getUserCourseByUserId(id);
  const tasks = await getTasksByUserId(id);
  const activities = await getActivities();
  const tasksDetail = getTasksActivityDetail(
    activities,
    tasks,
    subjects,
    user_course?.progress ?? 0
  );
  const pendingTask =
    tasksDetail.some((t) => !t.done) &&
    user_course &&
    user_course.state === IN_PROGRESS;
  const pendingActivities = tasksDetail.filter((t) => !t.done);
  const pendingActivitiesLen = pendingActivities.length;

  pendingTask &&
    toast.warning(getToastPendingTasksAlert(pendingActivitiesLen), {
      duration: 5000,
      cancel: { onClick: () => undefined, label: "cerrar" },
    });

  if (pendingActivitiesLen > 0 && user_course) {
    pendingActivities.forEach((a) => {
      a.date_max &&
        toast.info(getToastPendingActivities(a, subjects), {
          duration: 5000,
          cancel: { onClick: () => undefined, label: "cerrar" },
        });
    });
  }
};
export default Links;
