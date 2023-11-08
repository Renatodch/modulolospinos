import ProjectItem from "@/components/projectItem";
import { loginIsRequiredServer } from "@/lib/login-controller";
import { getProjectById } from "@/lib/project-controller";

const ProjectPage = async (props: any) => {
  await loginIsRequiredServer();

  const id = +props.params.project || 0;
  const project = await getProjectById(id);
  return <ProjectItem project={project} />;
};

export default ProjectPage;
