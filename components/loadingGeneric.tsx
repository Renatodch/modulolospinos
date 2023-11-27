import { PRIMARY_COLOR } from "@/model/types";
import { PuffLoader } from "react-spinners";

const LoadingGeneric = () => {
  return (
    <div className="w-full flex justify-center items-center h-full">
      <PuffLoader
        color={PRIMARY_COLOR}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingGeneric;
