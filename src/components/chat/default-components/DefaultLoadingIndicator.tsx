import { LoadingIndicatorComponentProps } from "../../../types";
import { BitteSpinner } from "../BitteSpinner";

const DefaultLoadingIndicator = ({
  textColor,
}: LoadingIndicatorComponentProps) => (
  <div className='bitte:flex bitte:w-full bitte:flex-col bitte:items-center bitte:justify-center'>
    <BitteSpinner width={100} height={100} color={textColor || "#FFFFFF"} />
  </div>
);

export default DefaultLoadingIndicator;
