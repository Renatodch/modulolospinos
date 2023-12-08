import ErrorData from "@/components/errorData";
import ProjectItem from "@/components/projectItem";
import { getActivitiesProject } from "@/controllers/activity.controller";
import { getSubjects } from "@/controllers/subject.controller";
import { getTaskById } from "@/controllers/task.controller";
import { getUserById } from "@/controllers/user.controller";
import { loginIsRequiredServer } from "@/lib/auth-config";

const ProjectPage = async (props: any) => {
  await loginIsRequiredServer();

  const id = +props.params.project || 0;
  const project = await getTaskById(id);
  const user = await getUserById(project?.id_user ?? undefined);
  const activities = await getActivitiesProject();
  const subjects = await getSubjects();
  const activity = activities.find((a) => a.id === project?.id_activity);
  const subject = subjects.find((s) => s.id === activity?.id_subject);
  const error = !activity || !subject || !user;
  return project ? (
    !error && (
      <ProjectItem
        student={user}
        project={project}
        activity={activity}
        subject={subject}
      />
    )
  ) : (
    <ErrorData msg="El proyecto no existe" />
  );
};

export default ProjectPage;
