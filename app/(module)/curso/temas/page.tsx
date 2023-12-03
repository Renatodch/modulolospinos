"use server";
import NotAllowed from "@/components/notAllowed";
import SubjectForm from "@/components/subjectForm";
import SubjectList from "@/components/subjectList";
import { getSubjects } from "@/controllers/subject.controller";

import { getSession, loginIsRequiredServer } from "@/lib/auth-config";
import { isTeacher } from "@/model/types";

const StudentsPage = async () => {
  await loginIsRequiredServer();
  const { _user } = await getSession();
  const subjects = await getSubjects();

  return isTeacher(_user?.type) ? (
    <div className="flex flex-col items-center justify-center w-full py-8 px-16">
      <div className="flex flex-col flex-wrap items-center justify-center w-2/3">
        <div className="flex justify-start w-full mb-4">
          <SubjectForm />
        </div>
        <SubjectList subjects={subjects} />
      </div>
    </div>
  ) : (
    <NotAllowed />
  );
};

export default StudentsPage;
