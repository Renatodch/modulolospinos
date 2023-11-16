import ProjectList from "@/components/projectList";
import { getTasks } from "@/controllers/task.controller";
import { loginIsRequiredServer } from "@/lib/auth-config";
import { PROJECT } from "@/model/types";

const PortfolioPage = async () => {
  await loginIsRequiredServer();
  const projects = await getTasks(PROJECT);

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-full">
        <ProjectList projects={projects} />
      </div>
    </div>
  );
};

export default PortfolioPage;
