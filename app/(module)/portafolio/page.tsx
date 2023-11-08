import ProjectList from "@/components/projectList";
import { loginIsRequiredServer } from "@/lib/login-controller";
import { getProjects } from "@/lib/project-controller";

const PortfolioPage = async () => {
  await loginIsRequiredServer();
  const projects = await getProjects();

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-full">
        <ProjectList projects={projects} />
      </div>
    </div>
  );
};

export default PortfolioPage;
