import type { SignMessageParams, Wallet } from "@near-wallet-selector/core";
import { randomBytes } from "crypto";
import { errorString } from "./utils";
import type { SignMessageResult } from "../types";

const getNonceBuffer = (nonce: string): Buffer => {
  const nonceLength = 32;

  const buffer = Buffer.from(nonce, "base64");

  if (buffer.length > nonceLength) {
    throw Error("Expected nonce to be a 32 bytes buffer");
  } else if (buffer.length < nonceLength) {
    const padding = Buffer.alloc(nonceLength - buffer.length);
    return Buffer.concat([buffer, padding], nonceLength);
  }

  return buffer;
};

export const signMessage = async (
  signMessageParams: Omit<SignMessageParams, "nonce"> & { nonce: string },
  wallet: Wallet
): Promise<SignMessageResult | undefined> => {
  const { message, nonce, recipient, callbackUrl, state } = signMessageParams;

  const signedMessage = await wallet
    .signMessage?.({
      message,
      nonce: getNonceBuffer(nonce),
      recipient,
      callbackUrl,
      state,
    })
    .catch((error) => {
      const errorMessage = errorString(error);
      console.error("failed in signMessage", errorMessage);
      throw new Error(errorMessage);
    });

  // Bitte Wallet redirects so signMessage will not have a result
  if (signedMessage) {
    return {
      ...signedMessage,
      nonce,
      recipient,
      callbackUrl: callbackUrl || "",
      message,
    };
  }
};

// Generate exactly 32 bytes of random data and convert to base64 string
export const generateNonceString = (): string =>
  randomBytes(32).toString("base64");
