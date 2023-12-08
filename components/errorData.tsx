import { RiErrorWarningFill } from "react-icons/ri";

const ErrorData = ({ msg }: { msg: string }) => {
  return (
    <div className="flex justify-center items-center space-x-2 pt-16">
      <RiErrorWarningFill />
      <p>
        <strong>{msg}</strong>
      </p>
    </div>
  );
};
export default ErrorData;
