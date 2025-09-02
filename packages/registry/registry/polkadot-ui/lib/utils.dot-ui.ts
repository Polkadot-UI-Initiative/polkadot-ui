import type {
  ChainConfig,
  BaseChainConfig,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { ethers } from "ethers";

// Generic helper functions that work with any polkadot config
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

export function isValidChainId<T extends Record<string, ChainConfig>>(
  chains: T,
  chainId: string
): chainId is string & keyof T {
  return chainId in chains;
}

// Helpers for config extension and merging used by configs
export function defineDotUiConfig<
  const TChains extends Record<string, BaseChainConfig>,
  const TDefault extends keyof TChains,
>(config: { chains: TChains; defaultChain: TDefault }) {
  return config as Readonly<{
    chains: { readonly [K in keyof TChains]: Readonly<TChains[K]> };
    defaultChain: TDefault;
  }>;
}

export function extendDotUiConfig<
  const Base extends {
    chains: Record<string, BaseChainConfig>;
    defaultChain: string | number | symbol;
  },
  const ExtChains extends {
    [K in keyof Base["chains"]]: Record<string, unknown>;
  },
>(base: Base, extension: { chains: ExtChains }) {
  const mergedChains = Object.fromEntries(
    Object.entries(base.chains).map(([key, value]) => [
      key,
      {
        ...(value as object),
        ...(extension.chains as Record<string, object>)[key],
      },
    ])
  ) as { [K in keyof Base["chains"]]: Base["chains"][K] & ExtChains[K] };

  return {
    ...base,
    chains: mergedChains,
    defaultChain: base.defaultChain,
  } as const;
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
