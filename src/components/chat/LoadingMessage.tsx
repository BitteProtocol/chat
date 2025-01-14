import { BitteSpinner } from "./BitteSpinner";

const LoadingMessage = () => (
  <div className="bitte-flex bitte-flex-col bitte-items-center bitte-justify-center">
    <div className="bitte-flex bitte-w-full bitte-items-center bitte-justify-center bitte-text-gray-600">
      <BitteSpinner width={100} height={100} />
    </div>
  </div>
);

export default LoadingMessage;
