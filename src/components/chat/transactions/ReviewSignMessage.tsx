"use client";

import { useEffect, useMemo, useState } from "react";
import { useHashParams } from "../../../hooks/useHashParams";
import { generateNonceString, signMessage } from "../../../lib/sign-message";
import { errorString } from "../../../lib/utils";
import {
  BitteToolResult,
  SignMessageResult,
  TransactionButtonProps,
  TransactionContainerProps,
} from "../../../types";
import { useAccount } from "../../AccountContext";
import { Button } from "../../ui/button";
import { CardContent, CardFooter, CardHeader } from "../../ui/card";
import { CopyStandard } from "../CopyStandard";
import DefaultTxApproveButton from "../default-components/DefaultTxApproveButton";
import DefaultTxContainer from "../default-components/DefaultTxContainer";
import DefaultTxDeclineButton from "../default-components/DefaultTxDeclineButton";
import LoadingMessage from "../LoadingMessage";

interface ReviewSignMessageProps {
  message: string;
  recipient?: string;
  textColor: string;
  messageBackgroundColor: string;
  borderColor: string;
  nonce?: string;
  callbackUrl?: string;
  chatId: string | undefined;
  customTxContainer?: React.ComponentType<TransactionContainerProps>;
  customApproveTxButton?: React.ComponentType<TransactionButtonProps>;
  customDeclineTxButton?: React.ComponentType<TransactionButtonProps>;
  toolCallId: string;
  addToolResult: (result: BitteToolResult<SignMessageResult>) => void;
}

export const ReviewSignMessage = ({
  message,
  nonce: nonceParam,
  callbackUrl = "",
  recipient,
  textColor,
  messageBackgroundColor,
  borderColor,
  chatId,
  toolCallId,
  addToolResult,
  customTxContainer: TxContainer = DefaultTxContainer,
  customApproveTxButton: ApproveButton = DefaultTxApproveButton,
  customDeclineTxButton: DeclineButton = DefaultTxDeclineButton,
}: ReviewSignMessageProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<SignMessageResult | null>(null);

  const { wallet, accountId } = useAccount();
  const { hashParams, clearHashParams } = useHashParams<{
    accountId: string;
    publicKey: string;
    signature: string;
    state: string;
  }>();

  const nonce = useMemo(() => {
    const nonceKey = `${toolCallId}-nonce`;
    // First use nonce param if provided by context to Component
    if (nonceParam) {
      sessionStorage.setItem(nonceKey, nonceParam);
      return nonceParam;
    }

    if (chatId) {
      sessionStorage.setItem("chatId", chatId);
    }

    // Second check for stored nonce in session storage
    const storedNonce = sessionStorage.getItem(nonceKey);
    if (storedNonce) {
      return storedNonce;
    }

    // Third, generate a new nonce and store it in session storage
    const newNonce = generateNonceString();
    sessionStorage.setItem(nonceKey, newNonce);
    return newNonce;
  }, [nonceParam, toolCallId]);

  // Process hash parameters when they change or component dependencies change
  useEffect(() => {
    if (!result && hashParams.signature) {
      const validAccountId = hashParams.accountId || accountId;
      if (hashParams.signature && validAccountId && message) {
        const signedMessage = {
          accountId: validAccountId,
          publicKey: hashParams.publicKey,
          signature: hashParams.signature,
          message,
          nonce,
          recipient: recipient || validAccountId,
          callbackUrl,
          state: hashParams.state,
        };

        setResult(signedMessage);
        addToolResult({ data: signedMessage });

        // Clear hash params to avoid processing them again
        // if the component remounts
        clearHashParams();
      }
    }
  }, [
    hashParams,
    accountId,
    message,
    nonce,
    recipient,
    callbackUrl,
    result,
    addToolResult,
    clearHashParams,
  ]);

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
        setResult(signedMessage);
        addToolResult({ data: signedMessage });
      }
    } catch (error) {
      const newErrorMsg = errorString(error);
      setErrorMsg(newErrorMsg);
      addToolResult({ error: newErrorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TxContainer
      style={{
        backgroundColor: messageBackgroundColor,
        borderColor: borderColor,
        textColor: textColor,
      }}
    >
      <CardHeader
        className='bitte-border-b bitte-text-center'
        style={{ borderColor: borderColor }}
      >
        <p className='bitte-text-[20px] bitte-font-semibold'>Sign Message</p>
      </CardHeader>

      <CardContent>
        <div className='bitte-border-b' style={{ borderColor: borderColor }}>
          <div className='bitte-flex bitte-flex-col bitte-gap-6 bitte-p-6'>
            <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
              <div style={{ color: textColor }}>Message</div>
              <div style={{ color: textColor }}>{message}</div>
            </div>
            <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
              <div style={{ color: textColor }}>Nonce</div>
              <div style={{ color: textColor }}>{nonce}</div>
            </div>
            {recipient ? (
              <div className='bitte-flex bitte-items-center bitte-justify-between bitte-text-[14px]'>
                <div style={{ color: textColor }}>Recipient</div>
                <div style={{ color: textColor }}>{recipient}</div>
              </div>
            ) : null}
          </div>
        </div>

        {result && !loading ? (
          <CardContent className='bitte-pt-6'>
            <div className='bitte-flex bitte-flex-col bitte-items-center bitte-gap-4 bitte-px-6 bitte-pb-6 bitte-text-center bitte-text-sm'>
              <div className='bitte-flex bitte-justify-end'>
                <CopyStandard
                  text={result.signature}
                  textSize='sm'
                  charSize={18}
                  isUrl={false}
                />
              </div>
            </div>
          </CardContent>
        ) : null}
      </CardContent>

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
          <DeclineButton
            onClick={() => addToolResult({ error: "User declined to sign" })}
          />
          <ApproveButton onClick={handleMessageSign} label='Sign Message' />
        </CardFooter>
      ) : null}
    </TxContainer>
  );
};
