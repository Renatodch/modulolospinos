"use client";

import { Button, Dialog } from "@radix-ui/themes";

const Rubric = ({
  rubric,
  titleClases,
  title,
  modal,
}: {
  rubric: string | null | undefined;
  titleClases: string;
  title: string;
  modal?: boolean;
}) => {
  return !modal ? (
    <>
      <p className={titleClases}>{title}</p>
      <div className="flex justify-center items-center">
        <iframe
          style={{ width: "100%", height: "800px" }}
          src={`https://docs.google.com/gview?url=${rubric}&embedded=true`}
        ></iframe>
      </div>
    </>
  ) : (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size={"3"} disabled={!rubric} style={{ width: "150px" }}>
          Ver Evaluación
        </Button>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 750 }}>
        <Dialog.Title align={"center"}>{title}</Dialog.Title>
        <iframe
          style={{ width: "100%", height: "800px" }}
          src={`https://docs.google.com/gview?url=${rubric}&embedded=true`}
        ></iframe>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Rubric;
