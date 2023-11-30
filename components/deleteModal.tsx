import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { AiFillDelete } from "react-icons/ai";

const DeleteModal = ({
  message,
  title,
  deleting,
  deleteHandler,
}: {
  message: string;
  title: string;
  deleting: boolean;
  deleteHandler: () => void;
}) => {
  //const [deleting, setDeleting] = useState(false);

  const handleClick = () => {
    //setDeleting(true);
    deleteHandler();
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button disabled={deleting} color="red" size="3">
          <AiFillDelete />
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">{message}</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleClick}>
              Aceptar
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteModal;
