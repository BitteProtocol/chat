import { MessageSquare } from "lucide-react";
import { formatAgentId } from "../../../lib/chat";
import { BITTE_BLACK_IMG } from "../../../lib/images";
import { cn } from "../../../lib/utils";
import { MessageGroupComponentProps } from "../../../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Card } from "../../ui/card";
import { ImageWithFallback } from "../../ui/ImageWithFallback";

const DefaultMessageContainer = ({
  message,
  isUser,
  userName,
  children,
  style,
  uniqueKey,
}: MessageGroupComponentProps) => (
  <Card
    className='bitte-p-6'
    style={{
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      color: style.textColor,
    }}
  >
    <Accordion
      type='single'
      defaultValue={uniqueKey}
      collapsible
      className='bitte-w-full'
    >
      <AccordionItem value={uniqueKey} className='bitte-border-0'>
        <AccordionTrigger className='bitte-p-0'>
          <div className='bitte-flex bitte-items-center bitte-justify-center bitte-gap-2'>
            {isUser ? (
              <>
                <MessageSquare className='bitte-h-[18px] bitte-w-[18px]' />
                <p className='bitte-text-[14px]'>{userName}</p>
              </>
            ) : (
              <>
                <ImageWithFallback
                  src={message.agentImage || "/placeholder.svg"}
                  fallbackSrc={BITTE_BLACK_IMG}
                  className={cn(
                    "bitte-h-[18px] bitte-w-[18px] bitte-rounded",
                    message.agentImage === BITTE_BLACK_IMG
                      ? "bitte-invert-0 bitte-dark:invert"
                      : "bitte-dark:bg-card-list"
                  )}
                  alt={`${message.agentId} icon`}
                />
                <p className='bitte-text-[14px]'>
                  {message.agentName || formatAgentId(message.agentId ?? "Bitte Assistant")}
                </p>
              </>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent
          className='bitte-mt-6 bitte-border-t bitte-pb-0'
          style={{ borderColor: style.borderColor }}
        >
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
);

export default DefaultMessageContainer;
