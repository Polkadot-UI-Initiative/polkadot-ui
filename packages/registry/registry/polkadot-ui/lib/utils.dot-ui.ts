import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { ethers } from "ethers";

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

export function validateAddress(
  address: string,
  format: "eth" | "ss58" | "both",
  ss58Prefix: number = 42
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

      const encoded = encodeAddress(decoded, ss58Prefix);
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

export function truncateAddress(
  address: string,
  length: number | boolean = 8
): string {
  if (!address || length === false) return address;

  const truncLength = typeof length === "number" ? length : 8;

  if (address.length <= truncLength * 2 + 3) return address;

  return `${address.slice(0, truncLength)}...${address.slice(-truncLength)}`;
}

export function shortenName(
  name: string,
  length: number | boolean = 8
): string {
  if (!name || length === false) return name;

  const truncLength = typeof length === "number" ? length : 8;

  if (name.length <= truncLength) return name;

  return `${name.slice(0, truncLength)}...`;
}

/**
 * Check if an identity has positive judgements to determine a verified identity
 * @param judgements Array of judgements from on chain query
 * @returns {boolean} indicating if identity is verified
 */
export function hasPositiveIdentityJudgement(
  judgements: [number, unknown][] | null | undefined
): boolean {
  if (!judgements || judgements.length === 0) {
    return false;
  }

  return judgements.some((judgement: [number, unknown]) => {
    // Judgement types: Unknown, FeePaid, Reasonable, KnownGood, OutOfDate, LowQuality, Erroneous
    // More info: https://wiki.polkadot.network/learn/learn-identity/#judgements
    const judgementType =
      (judgement[1] as { type?: string })?.type || judgement[1];
    return judgementType === "Reasonable" || judgementType === "KnownGood";
  });
}

// original source: https://github.com/polkadot-api/react-teleport-example/blob/main/src/lib/utils.ts
export const formatBalance = ({
  value,
  decimals = 0,
  unit,
  nDecimals,
}: {
  value: bigint | null | undefined;
  decimals?: number;
  unit?: string;
  nDecimals?: number;
  padToDecimals?: boolean;
  decimalSeparator?: string;
}): string => {
  if (value === null || value === undefined) return "";

  const precisionMultiplier = 10n ** BigInt(decimals);
  const isNegative = value < 0n;
  const absValue = isNegative ? value * -1n : value;

  const fullNumber = Number(absValue) / Number(precisionMultiplier);

  const formattedNumber = fullNumber.toFixed(nDecimals);

  const finalNumber = isNegative ? `-${formattedNumber}` : formattedNumber;

  return unit ? `${finalNumber} ${unit}` : finalNumber;
};

export function formatPlanck(
  value: bigint | null | undefined,
  decimals = 0
): string {
  if (value == null) return "—";
  const isNegative = value < 0n;
  const abs = isNegative ? -value : value;
  if (decimals <= 0) return `${isNegative ? "-" : ""}${abs.toString()}`;
  const s = abs.toString().padStart(decimals + 1, "0");
  const i = s.length - decimals;
  const integerPart = s.slice(0, i);
  const fractionPart = s.slice(i).replace(/0+$/, "");
  const result = fractionPart
    ? `${integerPart}.${fractionPart.slice(0, 4)}`
    : integerPart;
  return isNegative ? `-${result}` : result;
}

export function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function camelToKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function snakeToKebabCase(str: string): string {
  return str.replace(/_/g, "-");
}

/**
 * Generate token ID in the format: chainId:substrate-assets:assetId
 * @param chainId - Chain identifier (can be camelCase or snake_case, will be converted to kebab-case)
 * @param assetId - Asset identifier
 * @returns Formatted token ID
 */
export function generateTokenId(chainId: string, assetId: string): string {
  // Check if chainId contains underscores (snake_case) or camelCase
  const kebabChainId = chainId.includes("_")
    ? snakeToKebabCase(chainId)
    : camelToKebabCase(chainId);
  return `${kebabChainId}:substrate-assets:${assetId}`;
}

/**
 * Parse token ID to extract chainId and assetId
 * @param tokenId - Token ID in format: chainId:substrate-assets:assetId
 * @returns Object with chainId and assetId, or null if invalid format
 */
export function parseTokenId(
  tokenId: string
): { chainId: string; assetId: string } | null {
  const parts = tokenId.split(":");
  if (parts.length !== 3 || parts[1] !== "substrate-assets") {
    return null;
  }

  return {
    chainId: parts[0],
    assetId: parts[2],
  };
}
