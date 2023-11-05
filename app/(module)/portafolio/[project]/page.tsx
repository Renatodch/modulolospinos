import Project from "@/components/project";

interface Props {
  params: { project: string };
  searhParams: any;
}
const ProjectPage = (props: Props) => {
  return <Project id={props.params.project} />;
};

export default ProjectPage;
