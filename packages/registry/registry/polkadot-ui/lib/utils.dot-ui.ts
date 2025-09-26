import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { ethers } from "ethers";
import { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  NATIVE_TOKEN_ID,
  NATIVE_TOKEN_KEY,
} from "@/registry/polkadot-ui/blocks/select-token/shared-token-components";

export interface TokenMetadata {
  assetId: number;
  name: string;
  symbol: string;
  decimals: number;
}

// Default decimals for DOT-like tokens (Planck precision)
export const DEFAULT_TOKEN_DECIMALS = 12;

// Fiat cents per unit (e.g., 1 USD = 100 cents)
export const FIAT_CENTS_PER_UNIT = 100;

export function getTokenDecimals(token: TokenInfo | null | undefined): number {
  return token?.decimals ?? DEFAULT_TOKEN_DECIMALS;
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
  decimals = 0,
  options?: {
    fractionDigits?: number; // how many digits after the decimal to display
    thousandsSeparator?: string; // separator between thousands in integer part
    decimalSeparator?: string; // separator between integer and fraction parts
    trimTrailingZeros?: boolean; // trim trailing zeros in fraction
    round?: boolean; // round instead of truncate when cutting fraction
  }
): string {
  if (value == null) return "—";

  const {
    fractionDigits = 4,
    thousandsSeparator = ",",
    decimalSeparator = ".",
    trimTrailingZeros = true,
    round = true,
  } = options ?? {};

  const isNegative = value < 0n;
  const abs = isNegative ? -value : value;

  // No fractional decimals on-chain
  if (decimals <= 0) {
    const intStr = addThousandsGrouping(abs.toString(), thousandsSeparator);
    return isNegative ? `-${intStr}` : intStr;
  }

  // Ensure there is at least one integer digit
  const s = abs.toString().padStart(decimals + 1, "0");
  const cut = s.length - decimals;
  let integerPart = s.slice(0, cut);
  let fractionPart = s.slice(cut);

  // Normalize integer part (keep at least one digit)
  integerPart = integerPart.replace(/^0+(?=\d)/, "");
  if (integerPart.length === 0) integerPart = "0";

  // Apply fraction precision
  const digits = Math.max(
    0,
    Number.isFinite(fractionDigits) ? fractionDigits : 0
  );
  if (digits === 0) {
    if (round && /[5-9]/.test(fractionPart[0] ?? "0")) {
      integerPart = incrementDecimalString(integerPart);
    }
    fractionPart = "";
  } else if (fractionPart.length > digits) {
    if (round) {
      const head = fractionPart.slice(0, digits);
      const nextDigit = fractionPart.charCodeAt(digits) - 48; // '0' -> 48
      if (nextDigit >= 5) {
        const inc = incrementDecimalString(head);
        if (inc.length > head.length) {
          // carry to integer part
          integerPart = incrementDecimalString(integerPart);
          fractionPart = "0".repeat(digits);
        } else {
          fractionPart = inc.padStart(digits, "0");
        }
      } else {
        fractionPart = head;
      }
    } else {
      fractionPart = fractionPart.slice(0, digits);
    }
  } else if (fractionPart.length < digits) {
    // Not enough digits after decimal
    if (!trimTrailingZeros) fractionPart = fractionPart.padEnd(digits, "0");
  }

  // Optionally trim trailing zeros
  if (trimTrailingZeros) fractionPart = fractionPart.replace(/0+$/, "");

  const formattedInt = addThousandsGrouping(integerPart, thousandsSeparator);
  if (!fractionPart) {
    const result = formattedInt;
    return isNegative ? `-${result}` : result;
  }

  const result = `${formattedInt}${decimalSeparator}${fractionPart}`;
  return isNegative ? `-${result}` : result;
}

function addThousandsGrouping(value: string, separator: string): string {
  if (!separator) return value;
  let out = "";
  let count = 0;
  for (let i = value.length - 1; i >= 0; i--) {
    out = value[i] + out;
    count++;
    if (count === 3 && i > 0) {
      out = separator + out;
      count = 0;
    }
  }
  return out;
}

function incrementDecimalString(num: string): string {
  if (num.length === 0) return "1";
  const arr = num.split("");
  let carry = 1;
  for (let i = arr.length - 1; i >= 0 && carry; i--) {
    const n = arr[i].charCodeAt(0) - 48 + carry;
    if (n >= 10) {
      arr[i] = "0";
      carry = 1;
    } else {
      arr[i] = String.fromCharCode(48 + n);
      carry = 0;
    }
  }
  return carry ? "1" + arr.join("") : arr.join("");
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

export function chainIdToKebabCase(chainId: string): string {
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
  precision: number = 2,
  thousandsSeparator: string = ",",
  decimalSeparator: string = "."
): string {
  if (balance === null) return "0";

  return formatPlanck(balance, decimals, {
    fractionDigits: precision,
    thousandsSeparator,
    decimalSeparator,
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
  chainId: string,
  includeNative: boolean = false
): TokenInfo[] {
  if (includeNative) {
    return assets.map((asset) => ({
      id: generateTokenId(chainId, String(asset.assetId)),
      symbol: asset.symbol,
      decimals: asset.decimals,
      name: asset.name,
      assetId: String(asset.assetId),
    }));
  }
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
 * Also includes native tokens from chaindata that aren't in defaultTokens
 */
export function mergeWithChaindataTokens(
  defaultTokens: TokenInfo[],
  chaindataTokens: TokenInfo[]
): TokenInfo[] {
  const mergedTokens = defaultTokens.map((defaultToken) => {
    const chaindataToken = chaindataTokens.find(
      (token) => token.assetId === defaultToken.assetId
    );
    return chaindataToken || defaultToken;
  });

  const defaultAssetIds = new Set(defaultTokens.map((token) => token.assetId));
  const nativeTokensFromChaindata = chaindataTokens.filter(
    (token) =>
      token.assetId === "substrate-native" &&
      !defaultAssetIds.has(token.assetId)
  );

  // Ensure native token is first
  return [...nativeTokensFromChaindata, ...mergedTokens];
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
 * @param assetId - Asset ID to get balance for (number or "substrate-native")
 * @returns Token balance or null if not available
 */
export function getTokenBalance(
  balances: Record<number, bigint | null> | undefined,
  connectedAccount: { address?: string } | null | undefined,
  assetId: number | string
): bigint | null {
  if (!balances || !connectedAccount?.address) return null;

  if (typeof assetId === "string") {
    // Get native token balance
    if (assetId === NATIVE_TOKEN_ID) {
      return balances[NATIVE_TOKEN_KEY] ?? null;
    }

    const n = Number(assetId);
    if (!Number.isFinite(n)) return null;
    return balances[n] ?? null;
  }

  // Get numeric asset ID
  const numericAssetId = Number(assetId);
  if (isNaN(numericAssetId)) return null;

  return balances[numericAssetId] ?? null;
}

export function safeStringify(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    typeof v === "bigint" ? v.toString() : v
  );
}
