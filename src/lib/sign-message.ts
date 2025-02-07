import type {
  SignedMessage,
  SignMessageParams,
  Wallet,
} from "@near-wallet-selector/core";

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
): Promise<SignedMessage | void> => {
  const { message, nonce, recipient, callbackUrl } = signMessageParams;

  const payload = {
    message,
    nonce: getNonceBuffer(nonce),
    recipient,
    callbackUrl,
  };

  const signedMessage = await wallet.signMessage?.(payload);

  return signedMessage;
};
