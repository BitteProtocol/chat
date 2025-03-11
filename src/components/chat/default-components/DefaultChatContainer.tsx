import { ChatContainerComponentProps } from '../../../types';

const DefaultChatContainer = ({
  children,
  style,
}: ChatContainerComponentProps) => (
  <div
    className="bitte-chat-main bitte-text-start bitte-flex-1 bitte-relative bitte-min-h-[360px] bitte-w-full bitte-overflow-hidden lg:bitte-rounded-md bitte-border-t bitte-border-b lg:bitte-border bitte-pl-6"
    style={{
      backgroundColor: style?.backgroundColor,
      borderColor: style?.borderColor,
    }}
  >
    {children}
  </div>
);

export default DefaultChatContainer;
