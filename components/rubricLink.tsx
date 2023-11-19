import Link from "next/link";

const RubricLink = ({ url }: { url?: string | null }) => {
  return (
    <div className="text-md">
      {url ? (
        <Link href={url} className="rubric_link">
          DESCARGAR RUBRICA
        </Link>
      ) : (
        <span className="italic">Sin Rúbrica</span>
      )}
    </div>
  );
};

export default RubricLink;
