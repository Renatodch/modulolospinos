const Rubric = ({
  rubric,
  titleClases,
}: {
  rubric: string;
  titleClases: string;
}) => {
  return (
    <>
      <p className={titleClases}>Rubrica</p>
      <div className="flex justify-center items-center">
        <iframe
          style={{ width: "100%", height: "800px" }}
          src={`https://docs.google.com/gview?url=${rubric}&embedded=true`}
        ></iframe>
      </div>
    </>
  );
};

export default Rubric;
