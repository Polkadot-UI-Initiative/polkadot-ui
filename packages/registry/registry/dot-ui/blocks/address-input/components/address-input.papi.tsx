"use client";

import { forwardRef, useState, useEffect } from "react";
import { Input } from "@/registry/dot-ui/ui/input";
import { Label } from "@/registry/dot-ui/ui/label";
import { Badge } from "@/registry/dot-ui/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Identicon } from "@polkadot/react-identicon";

import { cn } from "@/registry/dot-ui/lib/utils";
import { usePapi } from "@/registry/dot-ui/providers/papi-provider";
import { usePolkadotIdentity } from "../hooks/use-identity.papi";
import {
  validateAddress,
  truncateAddress,
  type ValidationResult,
} from "@/registry/dot-ui/lib/address-validation";

export interface AddressInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  format?: "eth" | "ss58" | "both";
  withIdentityLookup?: boolean;
  withEnsLookup?: boolean;
  onIdentityFound?: (identity: IdentityResult) => void;
  ethProviderUrl?: string;
  truncate?: boolean | number;
  showIdenticon?: boolean;
  className?: string;
}

export interface IdentityResult {
  type: "polkadot" | "ens";
  data: {
    display?: string;
    legal?: string;
    email?: string;
    twitter?: string;
    verified?: boolean;
  };
}

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  (
    {
      value = "",
      onChange,
      format = "ss58",
      withIdentityLookup = true,
      // withEnsLookup = false, // TODO: Implement ENS lookup
      onIdentityFound,
      // ethProviderUrl, // TODO: Implement ENS lookup
      truncate = false,
      showIdenticon = true,
      className,
      ...props
    },
    ref
  ) => {
    const { isLoading, currentChain, isConnected } = usePapi();
    const [inputValue, setInputValue] = useState(value);
    const [validationResult, setValidationResult] =
      useState<ValidationResult>();
    const [debouncedAddress, setDebouncedAddress] = useState("");

    // Debounce address for API calls
    useEffect(() => {
      const timer = setTimeout(() => {
        if (validationResult?.isValid) {
          setDebouncedAddress(validationResult.normalizedAddress || inputValue);
        }
      }, 500);
      return () => clearTimeout(timer);
    }, [inputValue, validationResult]);

    // Identity lookup
    const polkadotIdentity = usePolkadotIdentity(
      withIdentityLookup && validationResult?.type === "ss58"
        ? debouncedAddress
        : ""
    );

    // Validation on input change
    useEffect(() => {
      const result = validateAddress(inputValue, format);
      setValidationResult(result);

      if (result.isValid && onChange) {
        onChange(result.normalizedAddress || inputValue);
      }
    }, [inputValue, format, onChange]);

    // Sync external value changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // Notify parent when identity is found
    useEffect(() => {
      if (polkadotIdentity.data && onIdentityFound) {
        onIdentityFound({
          type: "polkadot",
          data: polkadotIdentity.data,
        });
      }
    }, [polkadotIdentity.data, onIdentityFound]);

    // Loading states
    const isIdentityLoading = polkadotIdentity.isLoading;
    const isApiLoading = isLoading(currentChain);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const displayValue =
      truncate && validationResult?.isValid
        ? truncateAddress(inputValue, truncate)
        : inputValue;

    const placeholder =
      format === "eth"
        ? "Enter Ethereum address"
        : format === "ss58"
          ? "Enter Polkadot address"
          : props.placeholder || "Enter address";

    return (
      <div className="space-y-1 w-full">
        {props.label && <Label>{props.label}</Label>}

        <div className="relative">
          <Input
            ref={ref}
            value={displayValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              "mb-2",
              showIdenticon && validationResult?.isValid && "pl-12",
              validationResult?.isValid === false &&
                "border-red-500 focus:border-red-500",
              validationResult?.isValid === true &&
                "border-green-500 focus:border-green-500",
              className
            )}
            {...props}
          />

          {/* Identicon placeholder */}
          {showIdenticon && validationResult?.isValid && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <Identicon value={inputValue} size={20} theme="polkadot" />
            </div>
          )}

          {/* Loading spinner */}
          {(isIdentityLoading || isApiLoading) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Connection status */}
        {validationResult?.type === "ss58" && !isConnected(currentChain) && (
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <XCircle className="h-4 w-4" />
            <span>Not connected to chain. Identity lookup unavailable.</span>
          </div>
        )}

        {/* Validation error display */}
        {validationResult?.error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" />
            <span>{validationResult.error}</span>
          </div>
        )}

        {/* Valid address info */}
        {validationResult?.isValid && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>
              Valid {validationResult.type === "ss58" ? "Polkadot" : "Ethereum"}{" "}
              address
            </span>
          </div>
        )}

        {/* Identity display */}
        {polkadotIdentity.data && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>
              Identity: {JSON.stringify(polkadotIdentity.data.display)}
            </span>
            {polkadotIdentity.data.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
          </div>
        )}

        {/* No identity found info */}
        {validationResult?.isValid &&
          withIdentityLookup &&
          validationResult.type === "ss58" &&
          !polkadotIdentity.data &&
          !polkadotIdentity.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>• No identity found</span>
            </div>
          )}
      </div>
    );
  }
);

AddressInput.displayName = "AddressInput";
