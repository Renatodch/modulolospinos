import ProjectList from "@/components/projectList";
import { loginIsRequiredServer } from "@/lib/login-controller";
import { getProjects } from "@/lib/project-controller";

const PortfolioPage = async () => {
  await loginIsRequiredServer();
  const proojects = await getProjects();

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-full">
        <ProjectList />
      </div>
    </div>
  );
};

export default PortfolioPage;
