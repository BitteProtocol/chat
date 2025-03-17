import BN from "bn.js/lib/bn.js";
import { clsx, type ClassValue } from "clsx";
import { formatNearAmount } from "near-api-js/lib/utils/format.js";
import { twMerge } from "tailwind-merge";
import { Cost } from "../types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatName = (name: string, size?: number) => {
  const nameSize = size ?? 19;

  return name?.length > nameSize ? `${name.slice(0, size ?? 20)}...` : name;
};

export function errorString(error: unknown): string {
  if (error === undefined) {
    return "Undefined Error";
  }
  return error instanceof Error ? error.message : JSON.stringify(error);
}

export function dynamicToFixed(value: number, maxDecimals: number = 6): string {
  const minValue = Math.pow(10, -maxDecimals);
  if (value === 0) {
    return "0";
  } else if (value < minValue) {
    return `< ${minValue.toFixed(maxDecimals)}`;
  } else if (value >= 1) {
    // If the value is greater than or equal to 1, show up to 2 decimal places
    return value.toFixed(2).replace(/\.?0+$/, "");
  } else {
    // If the value is less than 1, find the first non-zero digit after the decimal
    const decimalPlaces = Math.min(
      Math.ceil(-Math.log10(value) + 1),
      maxDecimals
    );
    // Show decimal places up to the first non-zero digit, capped at maxDecimals
    return value.toFixed(decimalPlaces).replace(/\.?0+$/, "");
  }
}

export function shortenString(
  input: string,
  length: number,
  url?: boolean
): string {
  if (input?.length <= length * 2) {
    return input;
  }

  if (url && input?.length) {
    const urlParts = input?.split(/(https?:\/\/|\/|\?|&|=)/);
    let currentLength = 0;
    let result = "";

    for (const part of urlParts) {
      const partLength = part.length;
      if (currentLength + partLength <= length) {
        result += part;
        currentLength += partLength;
      } else {
        const remaining = length - currentLength;
        result += part.substring(0, remaining);
        result += "...";
        break;
      }
    }

    return result;
  } else {
    const prefix = input?.slice(0, length);
    const suffix = input?.slice(-length);

    return `${prefix}...${suffix}`;
  }
}

// Safely parse JSON or return the input as-is; if parsing fails, return the default value
export function safeJsonParse<T>(input: unknown, defaultValue: T): T {
  try {
    const parsed = typeof input === "string" ? JSON.parse(input) : input;
    return typeof parsed === typeof defaultValue ? (parsed as T) : defaultValue;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return defaultValue;
  }
}

export function removeTrailingZeros(value: string): string {
  const formattedValue = Number(value).toFixed(8); // Set the desired precision

  return formattedValue.replace(/\.?0+$/, "");
}

export const getNearblocksURL = (
  accountId: string,
  txnHash?: string,
  address?: string
) => {
  const isTestnet = accountId?.includes("testnet");
  const prefix = isTestnet ? "testnet." : "";

  return !!address
    ? `https://${prefix}nearblocks.io/address/${address}`
    : `https://${prefix}nearblocks.io/txns/${txnHash}`;
};

export function formatCosts(
  costs: Cost[] | null,
  gasPrice: string
): { deposit: string; gas: string } {
  if (costs && costs[0]) {
    return {
      gas: removeTrailingZeros(
        formatNearAmount(costs[0].gas.mul(new BN(gasPrice)).toString(), 6)
      ),
      deposit: removeTrailingZeros(
        formatNearAmount(costs[0].deposit.toString(), 3)
      ),
    };
  }
  return { gas: "0", deposit: "0" };
}

export function shortenAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
