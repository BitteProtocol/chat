import { ChatContainerComponentProps } from "../../../types";

const DefaultChatContainer = ({
  children,
  style,
}: ChatContainerComponentProps) => (
  <div
    className='bitte-chat-main bitte:text-start bitte:flex-1 bitte:relative bitte:min-h-[360px] bitte:w-full bitte:overflow-hidden bitte:lg:rounded-md bitte:border-t bitte:border-b bitte:lg:border bitte:pl-6'
    style={{
      backgroundColor: style?.backgroundColor,
      borderColor: style?.borderColor,
    }}
  >
    {children}
  </div>
);

export default DefaultChatContainer;
