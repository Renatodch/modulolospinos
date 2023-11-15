import ProjectItem from "@/components/projectItem";
import { getTaskById } from "@/controllers/task.controller";
import { loginIsRequiredServer } from "@/lib/auth-config";

const ProjectPage = async (props: any) => {
  await loginIsRequiredServer();

  const id = +props.params.project || 0;
  const project = await getTaskById(id);
  return <ProjectItem project={project} />;
};

export default ProjectPage;
