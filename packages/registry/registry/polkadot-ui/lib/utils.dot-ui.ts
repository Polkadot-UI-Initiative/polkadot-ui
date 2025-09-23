import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { ethers } from "ethers";
import { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";

export interface TokenMetadata {
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
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

export function chainIdToCamelCase(chainId: string): string {
  return chainId.includes("_")
    ? snakeToKebabCase(chainId)
    : camelToKebabCase(chainId);
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

/**
 * Format token balance with proper handling of null values
 * @param balance - Token balance in bigint format
 * @param decimals - Number of decimals for the token
 * @param precision - Number of decimal places to display (defaults to 2)
 * @returns Formatted balance string or "0" if balance is null
 */
export function formatTokenBalance(
  balance: bigint | null,
  decimals: number = 12,
  precision: number = 2
): string {
  if (balance === null) return "0";

  return formatBalance({
    value: balance,
    decimals,
    nDecimals: precision,
  });
}

/**
 * Convert token balance to USD price using a conversion rate
 * @param balance - Token balance in bigint format
 * @param decimals - Number of decimals for the token
 * @param conversionRate - USD conversion rate (default: 1 for stablecoins)
 * @returns Formatted USD price string or "0.00" if balance is null
 */
export function formatTokenPrice(
  balance: bigint | null,
  decimals: number = 12,
  //TODO: create a hook to get the conversion rate from API call
  conversionRate: number = 1
): string {
  if (balance === null) return "0.00";

  const formattedBalance = formatBalance({
    value: balance,
    decimals,
  });

  return (Number(formattedBalance) * conversionRate).toFixed(2);
}

/**
 * Create default chain tokens from asset metadata
 * This ensures we always have token data even when chaindata is incomplete
 */
export function createDefaultChainTokens(
  assets: TokenMetadata[],
  chainId: string
): TokenInfo[] {
  return assets.map((asset) => ({
    id: generateTokenId(chainId, String(asset.assetId)),
    symbol: asset.symbol,
    decimals: asset.decimals,
    name: asset.name,
    assetId: String(asset.assetId),
  }));
}

/**
 * Merge default tokens with chaindata tokens, preferring chaindata when available
 * This ensures we always have the same number of tokens as assetIds
 */
export function mergeWithChaindataTokens(
  defaultTokens: TokenInfo[],
  chaindataTokens: TokenInfo[]
): TokenInfo[] {
  return defaultTokens.map((defaultToken) => {
    // Find matching token from chaindata by assetId
    const chaindataToken = chaindataTokens.find(
      (token) => token.assetId === defaultToken.assetId
    );
    // Use chaindata token if found, otherwise use default
    return chaindataToken || defaultToken;
  });
}

/**
 * Helper function to get token logo from chainTokens by assetId
 * @param chainTokens - Array of chain tokens from chaindata
 * @param assetId - Asset ID to find logo for
 * @returns Token logo URL or undefined if not found
 */
export function getTokenLogo(
  chainTokens: TokenInfo[] | undefined,
  assetId: number
): string | undefined {
  if (!chainTokens) return undefined;
  const chainToken = chainTokens.find((token) => {
    // Extract assetId from token.id (format: chainId:substrate-assets:assetId)
    const parts = token.id.split(":");
    if (parts.length === 3 && parts[1] === "substrate-assets") {
      return parseInt(parts[2]) === assetId;
    }
    return false;
  });
  return chainToken?.logo;
}

/**
 * Normalize various numeric-like representations into bigint
 * Accepts bigint, number, objects exposing toBigInt(), or toString() returning a base-10 string
 */
export function parseBalanceLike(value: unknown): bigint | null {
  // bigint
  if (typeof value === "bigint") return value >= 0n ? value : null;

  // number → require finite, non-negative, and floor to integer
  if (typeof value === "number") {
    if (Number.isFinite(value) && value >= 0) return BigInt(Math.floor(value));
    return null;
  }

  // toBigInt()
  if (
    value &&
    typeof (value as { toBigInt?: () => bigint }).toBigInt === "function"
  ) {
    try {
      const v = (value as { toBigInt: () => bigint }).toBigInt();
      return typeof v === "bigint" && v >= 0n ? v : null;
    } catch {
      return null;
    }
  }

  // string-like via toString(): must be decimal digits or 0x-hex, non-negative
  if (
    value &&
    typeof (value as { toString?: () => string }).toString === "function"
  ) {
    try {
      const str = (value as { toString: () => string }).toString();
      if (/^\d+$/.test(str) || /^0x[0-9a-fA-F]+$/.test(str)) return BigInt(str);
      return null;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Helper function to get actual balance for a token
 * @param balances - Record of balances by assetId
 * @param connectedAccount - Connected account object
 * @param assetId - Asset ID to get balance for
 * @returns Token balance or null if not available
 */
export function getTokenBalance(
  balances: Record<number, bigint | null> | undefined,
  connectedAccount: { address?: string } | null | undefined,
  assetId: number
): bigint | null {
  if (!balances || !connectedAccount?.address) return null;
  return balances[assetId] ?? null;
}

export function safeStringify(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    typeof v === "bigint" ? v.toString() : v
  );
}
