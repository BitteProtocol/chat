import { InputContainerProps } from "../../../types";

const DefaultInputContainer = ({ children, style }: InputContainerProps) => (
  <div
    className='bitte:lg:rounded-md bitte:border-t bitte:border-b bitte:lg:border bitte:p-6 bitte:w-full'
    style={{
      backgroundColor: style?.backgroundColor,
      borderColor: style?.borderColor,
    }}
  >
    {children}
  </div>
);

export default DefaultInputContainer;
