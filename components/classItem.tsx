import ProjectForm from "./projectForm";

interface Props {
  item: number;
}
const ClassItem = ({ item }: Props) => {
  return (
    <>
      <div className="flex justify-center items-center w-full self-stretch h-5/6">
        ItemClassPage {item}
      </div>
      {item === 4 && (
        <div className="flex justify-end w-full h-1/6">
          <ProjectForm />
        </div>
      )}
    </>
  );
};

export default ClassItem;
