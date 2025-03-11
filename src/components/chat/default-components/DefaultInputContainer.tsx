import { InputContainerProps } from '../../../types';

const DefaultInputContainer = ({ children, style }: InputContainerProps) => (
  <div
    className="lg:bitte-rounded-md bitte-border-t bitte-border-b lg:bitte-border bitte-p-6 bitte-w-full"
    style={{
      backgroundColor: style?.backgroundColor,
      borderColor: style?.borderColor,
    }}
  >
    {children}
  </div>
);

export default DefaultInputContainer;
