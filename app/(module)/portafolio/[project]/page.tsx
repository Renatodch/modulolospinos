import ProjectItem from "@/components/projectItem";
import { getActivitiesProject } from "@/controllers/activity.controller";
import { getTaskById } from "@/controllers/task.controller";
import { loginIsRequiredServer } from "@/lib/auth-config";

const ProjectPage = async (props: any) => {
  await loginIsRequiredServer();

  const id = +props.params.project || 0;
  const project = await getTaskById(id);
  const activities = await getActivitiesProject();
  const activity = activities.find((a) => a.id === project?.id_activity);
  return <ProjectItem project={project} activity={activity} />;
};

export default ProjectPage;
