import { BitteSpinner } from "./BitteSpinner";

const LoadingMessage = () => (
  <div className='flex flex-col items-center justify-center'>
    <div className='flex w-full items-center justify-center text-gray-600'>
      <BitteSpinner width={100} height={100} />
    </div>
  </div>
);

export default LoadingMessage;
