import type { ChainConfig } from "@/registry/dot-ui/lib/types.polkadot-ui";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { ethers } from "ethers";

/**
 * Returns an array of chain IDs from the provided chain configuration record.
 *
 * @returns An array containing the keys of the `chains` record, representing chain IDs.
 */
export function getChainIds<T extends Record<string, ChainConfig>>(
  chains: T
): (keyof T)[] {
  return Object.keys(chains) as (keyof T)[];
}

export function getChainConfig<
  T extends Record<string, ChainConfig>,
  K extends keyof T,
>(chains: T, chainId: K): T[K] {
  return chains[chainId];
}

/**
 * Determines whether the provided string is a valid chain ID key within the given chains record.
 *
 * @param chains - The record of chain configurations to check against
 * @param chainId - The chain ID string to validate
 * @returns True if `chainId` is a key of `chains`; otherwise, false
 */
export function isValidChainId<T extends Record<string, ChainConfig>>(
  chains: T,
  chainId: string
): chainId is string & keyof T {
  return chainId in chains;
}

// Helper function to safely extract text from papi encoded types
export const extractText = (value: unknown): string | undefined => {
  // Check if value exists
  if (!value) return undefined;

  // If it's already a string, return it
  if (typeof value === "string") return value;

  // Check if it has asText method at runtime (PAPI encoded types)
  if (value && typeof value === "object" && "asText" in value) {
    try {
      const textMethod = (value as Record<string, unknown>).asText;
      if (typeof textMethod === "function") {
        return textMethod.call(value) as string;
      }
    } catch (error) {
      console.warn("Failed to call asText method:", error);
    }
  }

  // Check if it has a text property (some PAPI types)
  if (value && typeof value === "object" && "text" in value) {
    const textValue = (value as Record<string, unknown>).text;
    if (typeof textValue === "string") return textValue;
  }

  // Fallback to toString for other types
  try {
    return String(value);
  } catch {
    return undefined;
  }
};

export interface ValidationResult {
  isValid: boolean;
  type: "ss58" | "eth" | "unknown";
  error?: string;
  normalizedAddress?: string;
}

/**
 * Validates a blockchain address against the specified format ("ss58", "eth", or "both").
 *
 * Attempts to decode and normalize the address as a Polkadot (SS58) or Ethereum address, depending on the format. Returns a validation result indicating validity, address type, and a normalized address if valid. Provides an error message if the address is invalid or does not match the required format.
 *
 * @param address - The address string to validate
 * @param format - The expected address format: "ss58", "eth", or "both"
 * @returns The result of the validation, including validity, address type, optional error message, and normalized address if valid
 */
export function validateAddress(
  address: string,
  format: "eth" | "ss58" | "both"
): ValidationResult {
  if (!address.trim()) {
    return { isValid: false, type: "unknown", error: "Address is required" };
  }

  // SS58 validation
  if (format === "ss58" || format === "both") {
    try {
      const decoded = decodeAddress(address);

      // Check if the decoded address has the proper length (32 bytes for a public key)
      if (decoded.length !== 32) {
        throw new Error("Invalid address length");
      }

      const encoded = encodeAddress(decoded, 42); // Polkadot prefix
      return {
        isValid: true,
        type: "ss58",
        normalizedAddress: encoded,
      };
    } catch {
      if (format === "ss58") {
        return {
          isValid: false,
          type: "unknown",
          error: "Invalid Polkadot address format",
        };
      }
    }
  }

  // Ethereum validation
  if (format === "eth" || format === "both") {
    try {
      const normalized = ethers.getAddress(address);
      return {
        isValid: true,
        type: "eth",
        normalizedAddress: normalized,
      };
    } catch {
      if (format === "eth") {
        return {
          isValid: false,
          type: "unknown",
          error: "Invalid Ethereum address format",
        };
      }
    }
  }

  return {
    isValid: false,
    type: "unknown",
    error: "Invalid address format",
  };
}

/**
 * Truncates an address string by keeping a specified number of characters at the start and end, separated by ellipsis.
 *
 * If the address is shorter than the truncation threshold or truncation is disabled, returns the original address.
 *
 * @param address - The address string to truncate
 * @param length - Number of characters to keep at the start and end, or `false` to disable truncation (default is 8)
 * @returns The truncated address string, or the original address if truncation is not applied
 */
export function truncateAddress(
  address: string,
  length: number | boolean = 8
): string {
  if (!address || length === false) return address;

  const truncLength = typeof length === "number" ? length : 8;

  if (address.length <= truncLength * 2 + 3) return address;

  return `${address.slice(0, truncLength)}...${address.slice(-truncLength)}`;
}
