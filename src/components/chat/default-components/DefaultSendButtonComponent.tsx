import { ArrowUp } from "lucide-react";
import { SendButtonComponentProps } from "../../../types";
import { Button } from "../../ui/button";

const DefaultSendButton = ({
  input,
  isLoading,
  buttonColor,
  textColor,
}: SendButtonComponentProps) => (
  <Button
    type='submit'
    disabled={!input || isLoading}
    className='bitte:h-[42px] bitte:w-full bitte:lg:w-[42px] bitte:p-0 bitte:disabled:opacity-20'
    style={{ backgroundColor: buttonColor, color: textColor }}
  >
    <ArrowUp className='bitte:h-[16px] bitte:w-[16px] bitte:hidden bitte:lg:block' />
    <span className='bitte:lg:hidden'>Send</span>
  </Button>
);

export default DefaultSendButton;
