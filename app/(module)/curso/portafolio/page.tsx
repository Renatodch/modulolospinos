import ProjectList from "@/components/projectList";
import { getTasks, getTasksByUserId } from "@/controllers/task.controller";
import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { PROJECT, STUDENT } from "@/model/types";

const PortfolioPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  const type = _user?.type;
  const projects =
    type === STUDENT
      ? await getTasksByUserId(_user?.id!, PROJECT)
      : await getTasks(PROJECT);

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-full">
        <ProjectList projects={projects} />
      </div>
    </div>
  );
};

export default PortfolioPage;
