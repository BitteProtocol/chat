import { BitteSpinner } from './BitteSpinner';

const LoadingMessage = ({ color }: { color: string }) => (
  <div className="bitte-flex bitte-flex-col bitte-items-center bitte-justify-center">
    <div className="bitte-flex bitte-w-full bitte-items-center bitte-justify-center">
      <BitteSpinner width={100} height={100} color={color} />
    </div>
  </div>
);

export default LoadingMessage;
