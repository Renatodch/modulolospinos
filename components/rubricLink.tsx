import Link from "next/link";

const RubricLink = ({ url, text }: { url?: string | null; text: string }) => {
  return (
    <div className="text-md">
      {url ? (
        <Link href={url} className="rubric_link">
          {text}
        </Link>
      ) : (
        <span className="italic">Sin Rúbrica</span>
      )}
    </div>
  );
};

export default RubricLink;
