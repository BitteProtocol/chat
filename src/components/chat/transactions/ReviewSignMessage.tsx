"use client";

import { useState, useEffect } from "react";
import { signMessage } from "../../../lib/sign-message";
import { BitteToolResult } from "../../../types";
import { useAccount } from "../../AccountContext";
import { Button } from "../../ui/button";
import { Card, CardFooter, CardHeader } from "../../ui/card";
import { CopyStandard } from "../CopyStandard";
import LoadingMessage from "../LoadingMessage";
import { shortenString } from "../../../lib/utils";

interface ReviewSignMessageProps {
  message: string;
  recipient?: string;
  textColor: string;
  messageBackgroundColor: string;
  borderColor: string;
  nonce?: string;
  callbackUrl?: string;
  chatId: string | undefined;
  addToolResult: (result: BitteToolResult) => void;
}

export const ReviewSignMessage = ({
  message,
  nonce = "default",
  callbackUrl = "",
  recipient,
  textColor,
  messageBackgroundColor,
  borderColor,
  chatId,
  addToolResult,
}: ReviewSignMessageProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const { wallet, accountId } = useAccount();
  
  useEffect(() => {
    if (!result) {
      const checkSignature = () => {
        if (window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const signature = hashParams.get("signature");

          if (signature) {
            setResult(signature);
            addToolResult({ data: signature });
          }
        }
      };

      // Check initially
      checkSignature();

      // Listen for changes in the hash
      window.addEventListener("hashchange", checkSignature);

      return () => {
        window.removeEventListener("hashchange", checkSignature);
      };
    }
  }, [addToolResult, result]);

  if (chatId) {
    sessionStorage.setItem("chatId", chatId);
  }

  const handleMessageSign = async () => {
    if (!wallet || !accountId) {
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const signedMessage = await signMessage(
        {
          message,
          nonce,
          callbackUrl,
          recipient: recipient || accountId,
        },
        wallet
      );

      if (signedMessage) {
        setResult(signedMessage.signature);
        addToolResult({ data: signedMessage.signature });
      }
    } catch (error) {
      setErrorMsg(error?.toString() || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (result && !loading) {
    return (
      <Card
        style={{
          backgroundColor: messageBackgroundColor,
          borderColor: borderColor,
        }}
      >
        <CardHeader
          className='bitte-border-b bitte-text-center'
          style={{ borderColor: borderColor }}
        >
          <p className='bitte-text-[20px] bitte-font-semibold'>
            Message Signed Successfully
          </p>
        </CardHeader>
        <div className='bitte-mt-4'>
          <div
            className='bitte-flex bitte-flex-col bitte-gap-4 bitte-p-6 bitte-text-[14px]'
            style={{ color: textColor }}
          >
            <div className='bitte-flex bitte-items-center bitte-justify-between bitte-px-6 bitte-text-[14px]'>
              <div>Message</div>
              <div>{message}</div>
            </div>
            <div className='bitte-flex bitte-items-center bitte-justify-between bitte-px-6 bitte-text-[14px]'>
              <div>Signature</div>
              <div className='bitte-flex bitte-items-center bitte-gap-2'>
                {shortenString(result, 10)}
                <CopyStandard
                  text={result}
                  textSize='sm'
                  charSize={18}
                  isUrl={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{
        backgroundColor: messageBackgroundColor,
        borderColor: borderColor,
      }}
    >
      <CardHeader
        className='bitte-border-b bitte-text-center'
        style={{ borderColor: borderColor }}
      >
        <p className='bitte-text-[20px] bitte-font-semibold'>
          Review Message Signing
        </p>
      </CardHeader>

      <div>
        <div className='bitte-flex bitte-flex-col bitte-gap-6 bitte-p-6'>
          <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
            <div>Message</div>
            <div>{message}</div>
          </div>
          <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
            <div>Nonce</div>
            <div>{nonce}</div>
          </div>
          {recipient ? (
            <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
              <div>Recipient</div>
              <div>{recipient}</div>
            </div>
          ) : null}
        </div>

        {errorMsg && !loading ? (
          <div className='bitte-flex bitte-flex-col bitte-items-center bitte-gap-4 bitte-px-6 bitte-pb-6 bitte-text-center bitte-text-sm'>
            <p className='bitte-text-red-300'>
              An error occurred while signing the message: {errorMsg}
            </p>
            <Button
              className='bitte-w-1/2'
              variant='outline'
              onClick={() => setErrorMsg("")}
            >
              Dismiss
            </Button>
          </div>
        ) : null}

        {loading ? <LoadingMessage color={textColor} /> : null}

        {!loading && !result && !errorMsg ? (
          <CardFooter className='bitte-flex bitte-items-center bitte-gap-6'>
            <Button
              variant='outline'
              className='bitte-w-1/2'
              onClick={() => addToolResult({ error: "User declined to sign" })}
            >
              Decline
            </Button>
            <Button
              variant='default'
              className='bitte-w-1/2'
              onClick={handleMessageSign}
            >
              Sign Message
            </Button>
          </CardFooter>
        ) : null}
      </div>
    </Card>
  );
};
