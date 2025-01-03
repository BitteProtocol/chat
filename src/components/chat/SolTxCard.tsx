"use client";
import { useState, useEffect } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import {
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Card, CardHeader, CardFooter } from "../ui/card";
import { CopyStandard } from "./CopyStandard";
import { TransactionDetail } from "./TransactionDetail";
import { Button } from "../ui/button";
import { useAccount } from "../AccountContext";
import LoadingMessage from "./LoadingMessage";
import { TransactionResult } from "./TransactionResult";
import { useTransaction } from "../../hooks/useTransaction";
import { SolSignRequest } from "../../types";

export const SolTxCard = ({ solData }: { solData?: SolSignRequest }) => {
  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txResult, setTxResult] = useState<{signatures: string[], confirmations: any[]} | undefined>();
  const { solanaWallet, solanaAddress } = useAccount();

  if (!solanaWallet || !solData)
    return (
      <p className='my-6 overflow-auto text-center'>
        Unable to create Solana transaction.
      </p>
    );

  if (!Array.isArray(solData.params) || solData.params.length === 0) {
    return (
      <p className='my-6 overflow-auto text-center'>
        Invalid Solana transaction parameters.
      </p>
    );
  }

  const { provider, connection } = solanaWallet;

  const { handleTxn } = useTransaction({
    solanaProvider: provider,
    solanaConnection: connection,
  });

  const handleSmartAction = async () => {
    setIsLoading(true);
    try {
      const result = await handleTxn({ solData: solData });
      if (result.solana) {
        setTxResult({
          signatures: result.solana.signatures,
          confirmations: result.solana.confirmations
        });
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='mb-8 flex justify-center'>
        <Card className='w-full'>
          <CardHeader className='border-b border-slate-200 p-4 text-center md:p-6'>
            <p className='text-xl font-semibold'>Solana Transaction</p>
          </CardHeader>
          <div>
            {solData ? (
              <div className='p-6'>
                <div className='flex flex-col gap-6 text-sm'>
                  <TransactionDetail label='Network' value={solData.network} />
                  <Accordion
                    type='single'
                    collapsible
                    defaultValue='transaction-0'
                  >
                    {solData.params.map((transaction: any, index: any) => (
                      <AccordionItem
                        key={index}
                        value={`transaction-${index}`}
                        className='border-0'
                      >
                        <AccordionTrigger className='pt-0 hover:no-underline'>
                          <div className='flex items-center justify-between text-sm'>
                            <p className='text-text-secondary'>
                              Transaction {index + 1}
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-6 border-0'>
                          <TransactionDetail
                            label='Data'
                            value={
                              <CopyStandard
                                text={transaction}
                                textSize='sm'
                                textColor='gray-800'
                                charSize={isMobile ? 10 : 15}
                              />
                            }
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ) : null}
          </div>

          {errorMsg && !isLoading ? (
            <div className='flex flex-col items-center gap-4 px-6 pb-6 text-center text-sm'>
              <p className='text-red-300'>
                An error occurred trying to execute your transaction: {errorMsg}
                .
              </p>
              <Button
                className='w-1/2'
                variant='outline'
                onClick={() => {
                  setErrorMsg("");
                }}
              >
                Dismiss
              </Button>
            </div>
          ) : null}

          {isLoading ? <LoadingMessage /> : null}
          {txResult ? (
            <TransactionResult
              result={{ solana: txResult }}
              textColor='text-gray-800'
            />
          ) : null}
          {!isLoading && !errorMsg && !txResult ? (
            <CardFooter className='flex items-center gap-6'>
              <>
                <Button variant='outline' className='w-1/2'>
                  Decline
                </Button>

                <Button
                  className='w-1/2'
                  onClick={handleSmartAction}
                  disabled={isLoading}
                >
                  {isLoading ? "Confirming..." : "Approve"}
                </Button>
              </>
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </>
  );
};

// TODO: Remove this test helper once we have proper agent integration for testing
export async function createTestTransaction(connection: Connection) {
  if (!connection) {
    throw new Error("Connection is required");
  }

  try {
    // Define addresses
    const fromPubkey = new PublicKey("DRpbCBMxVnDK7maPGv6MvL4SXKKBYv3vzjact1i7DKG8");
    const toPubkey = new PublicKey("6fQY9fgE4zEWjkZz3XNZGwpjP1VXE9c3ZvGHkGgHqe1V");
    
    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey, 
      lamports: LAMPORTS_PER_SOL * 0.1
    });

    // Create and prepare transaction
    const transaction = new Transaction();
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;
    transaction.add(transferInstruction);

    return [transaction];

  } catch (error) {
    console.error("Error creating test transaction:", error);
    throw error;
  }
}
