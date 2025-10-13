"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ClientConnectionStatus,
  type IdentitySearchResult,
  type PolkadotIdentity,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import { cn } from "@/registry/polkadot-ui/lib/utils";
import {
  truncateAddress,
  type ValidationResult,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { Button } from "@/registry/polkadot-ui/ui/button";
import { Input } from "@/registry/polkadot-ui/ui/input";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { Identicon } from "@polkadot/react-identicon";
import { type IconTheme } from "@polkadot/react-identicon/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { ethers } from "ethers";

import { Check, CircleCheck, Copy, Loader2 } from "lucide-react";
import { forwardRef, type ReactNode, useEffect, useRef, useState } from "react";

// Services interface for dependency injection

export interface AddressInputServices<TNetworkId> {
  // Hook for fetching identity by address
  useIdentityOf: (
    address: string,
    identityChain?: TNetworkId | undefined
  ) => UseQueryResult<PolkadotIdentity | null, Error>;
  // Hook for searching identities by display name
  useIdentitySearch: (
    displayName: string | null,
    identityChain?: TNetworkId | undefined
  ) => UseQueryResult<IdentitySearchResult[], Error>;
  clientStatus: ClientConnectionStatus;
  explorerUrl: string;
}

export interface AddressInputBaseProps<TNetworkId = string> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  format?: "eth" | "ss58" | "both";
  withIdentityLookup?: boolean;
  withIdentitySearch?: boolean;
  withEnsLookup?: boolean;
  withCopyButton?: boolean;
  onIdentitySelected?: (identity: IdentityResult) => void;
  ethProviderUrl?: string;
  truncate?: boolean | number;
  showIdenticon?: boolean;
  identiconTheme?: IconTheme;
  className?: string;
  identityChain?: TNetworkId | undefined;
  required?: boolean;
  // Injected services - this makes it reusable
  services: AddressInputServices<TNetworkId>;
}

export interface IdentityResult {
  type: "polkadot" | "ens";
  data: PolkadotIdentity;
}

// Provider wrapper interface
export interface AddressInputProviderProps {
  children: ReactNode;
}

export const AddressInputBase = forwardRef(function AddressInputBase<
  TNetworkId extends string = string,
>(
  {
    value = "",
    onChange,
    format = "ss58",
    identityChain = undefined,
    withIdentityLookup = true,
    withIdentitySearch = true,
    withCopyButton = true,
    onIdentitySelected,
    // withEnsLookup = false, // TODO: Implement ENS lookup
    // ethProviderUrl, // TODO: Implement ENS lookup
    truncate = 8,
    showIdenticon = true,
    identiconTheme = "polkadot",
    className,
    services, // Injected services - this makes it reusable for papi + dedot
    ...props
  }: AddressInputBaseProps<TNetworkId>,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { useIdentityOf, useIdentitySearch, clientStatus } = services;

  const [inputValue, setInputValue] = useState(value);
  const [validationResult, setValidationResult] = useState<ValidationResult>();
  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedFromSearch, setSelectedFromSearch] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {}
  );
  const [inputAvatarFailed, setInputAvatarFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge forwarded ref with internal ref
  useEffect(() => {
    if (_ref) {
      if (typeof _ref === "function") {
        _ref(inputRef.current);
      } else {
        _ref.current = inputRef.current;
      }
    }
  }, [_ref]);

  // Debounce address for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (validationResult?.isValid) {
        setDebouncedAddress(validationResult.normalizedAddress || inputValue);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, validationResult]);

  // Debounce search for identity search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!validationResult?.isValid && inputValue.length > 2) {
        setDebouncedSearch(inputValue);
      } else if (!selectedFromSearch) {
        setDebouncedSearch("");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, validationResult, selectedFromSearch]);

  // Identity lookup (skip if selected from search to avoid redundant call)
  const polkadotIdentity = useIdentityOf(
    withIdentityLookup &&
      validationResult?.type === "ss58" &&
      !selectedFromSearch
      ? debouncedAddress
      : "",
    identityChain
  );

  // Identity search
  const identitySearch = useIdentitySearch(
    withIdentitySearch && format !== "eth" && debouncedSearch.length > 2
      ? debouncedSearch
      : null,
    identityChain
  );
  // Validation on input change
  useEffect(() => {
    const result = validateAddress(inputValue, format);
    setValidationResult(result);

    if (result.isValid && onChange) {
      const nextValue = result.normalizedAddress ?? inputValue;
      // Avoid infinite update loops by only emitting when external value differs
      if (nextValue !== value) {
        onChange(nextValue);
      }
    }
  }, [inputValue, format, onChange, value]);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
    setIsEditing(false); // Stop editing when value changes externally
  }, [value]);

  // Get identity data from search results when selected from search
  const searchResultIdentity =
    selectedFromSearch && validationResult?.isValid
      ? identitySearch.data?.find((result) => result.address === inputValue)
          ?.identity
      : null;

  // Combined identity data - use search result if available, otherwise polkadot identity
  const currentIdentity = searchResultIdentity || polkadotIdentity.data;

  // Reset input avatar error when identity image changes
  useEffect(() => {
    setInputAvatarFailed(false);
  }, [currentIdentity?.image]);

  // Notify parent element when identity is found
  useEffect(() => {
    if (currentIdentity && onIdentitySelected) {
      onIdentitySelected({
        type: "polkadot",
        data: currentIdentity,
      });
    }
  }, [currentIdentity, onIdentitySelected]);

  // Loading states
  const isIdentityLoading = polkadotIdentity.isLoading;
  const isIdentitySearching = identitySearch.isLoading;
  const isApiLoading = clientStatus === ClientConnectionStatus.Connecting;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(false);
    setIsEditing(true);
    setSelectedFromSearch(false);
  };

  const handleFocus = () => {
    setIsEditing(true);
    if (!hasInteracted) setHasInteracted(true);
    if (
      !validationResult?.isValid &&
      debouncedSearch.length > 2 &&
      identitySearch.data &&
      identitySearch.data.length > 0
    ) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Delay hiding dropdown to allow clicks on dropdown items
    timeoutRef.current = setTimeout(() => setShowDropdown(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation for search results
    if (showDropdown && identitySearch.data && identitySearch.data.length > 0) {
      const optionsCount = identitySearch.data.length;

      switch (e.key) {
        // Selecting options
        case "ArrowDown":
        case "Tab": {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < optionsCount - 1 ? prev + 1 : 0
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : optionsCount - 1
          );
          break;
        }
        // Confirming the first option or the highlighted option
        case "Enter": {
          e.preventDefault();
          const selectedIndex = highlightedIndex >= 0 ? highlightedIndex : 0;
          const selectedResult = identitySearch.data[selectedIndex];
          if (selectedResult) {
            handleSelectIdentity(
              selectedResult.address,
              selectedResult.identity.display || ""
            );
          }
          break;
        }
        // Closing the dropdown
        case "Escape": {
          e.preventDefault();
          setShowDropdown(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
        }
      }
    }
  };

  const handleSelectIdentity = (address: string, display: string | number) => {
    setSelectedFromSearch(true);
    setInputValue(address);
    setShowDropdown(false);
    setHighlightedIndex(-1);

    if (onChange) {
      onChange(address);
    }
    inputRef.current?.blur();

    // Trigger identity found callback
    if (onIdentitySelected) {
      const selectedResult = identitySearch.data?.find(
        (result) => result.address === address
      );
      onIdentitySelected({
        type: "polkadot",
        data: {
          display: typeof display === "number" ? String(display) : display,
          verified: selectedResult?.identity.verified || false,
        },
      });
    }
  };

  const handleCopy = async () => {
    if (!inputValue) return;

    try {
      await navigator.clipboard.writeText(inputValue);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  // Sanitize image URLs coming from identity data
  function sanitizeImageUrl(value: unknown): string | null {
    if (!value) return null;
    const raw = String(value);
    try {
      const url = new URL(raw);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      if (url.protocol === "http:") url.protocol = "https:";
      return url.toString();
    } catch {
      return null;
    }
  }

  const currentImageUrl = sanitizeImageUrl(currentIdentity?.image);
  const showInputAvatar = !!currentImageUrl && !inputAvatarFailed;

  // Show dropdown when search is active or results are available
  useEffect(() => {
    if (
      !validationResult?.isValid &&
      debouncedSearch.length > 2 &&
      (isIdentitySearching ||
        (identitySearch.data && identitySearch.data.length > 0))
    ) {
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } else {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  }, [
    validationResult,
    debouncedSearch,
    identitySearch.data,
    isIdentitySearching,
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const displayValue =
    truncate && validationResult?.isValid && !isEditing
      ? truncateAddress(inputValue, truncate)
      : inputValue;

  const placeholder =
    format === "eth"
      ? "Enter Ethereum address"
      : format === "ss58" && withIdentitySearch
        ? "Polkadot address or identity"
        : format === "ss58" && !withIdentitySearch
          ? "Polkadot address"
          : props.placeholder || "Enter address";

  return (
    <div
      className="space-y-1 w-full"
      aria-busy={isIdentityLoading || isApiLoading || isIdentitySearching}
    >
      {props.label && <Label>{props.label}</Label>}

      <div className="relative">
        <Input
          ref={inputRef}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          required={props.required} // TODO: Add required prop
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={
            showDropdown &&
            withIdentitySearch &&
            !validationResult?.isValid &&
            debouncedSearch.length > 2
          }
          aria-haspopup="listbox"
          aria-controls={showDropdown ? "address-search-listbox" : undefined}
          aria-activedescendant={
            showDropdown && highlightedIndex >= 0
              ? `address-option-${highlightedIndex}`
              : undefined
          }
          aria-invalid={
            inputValue.trim() && validationResult?.isValid === false
              ? true
              : undefined
          }
          aria-describedby={
            validationResult?.error && hasInteracted && !isEditing
              ? "address-input-error"
              : undefined
          }
          className={cn(
            "mb-2",
            showIdenticon && validationResult?.isValid && "pl-10",
            inputValue.trim() &&
              validationResult?.isValid === false &&
              "border-red-500 focus:border-red-500",
            inputValue.trim() &&
              validationResult?.isValid === true &&
              "focus:border-green-500",
            className
          )}
          {...props}
        />

        {/* Search Results Dropdown */}
        {showDropdown &&
          withIdentitySearch &&
          !validationResult?.isValid &&
          debouncedSearch.length > 2 && (
            <div
              id="address-search-listbox"
              role="listbox"
              aria-label="Address search results"
              className="absolute left-0 top-full z-50 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {isIdentitySearching && (
                <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching identities...
                </div>
              )}
              {identitySearch.error && (
                <div className="p-3 text-sm text-red-600">
                  Search failed: {identitySearch.error.message}
                </div>
              )}
              {!isIdentitySearching &&
                !identitySearch.error &&
                identitySearch.data &&
                identitySearch.data.length > 0 &&
                identitySearch.data.map((result, index) => {
                  const imageUrl = sanitizeImageUrl(result.identity?.image);
                  const showAvatar =
                    !!imageUrl && !failedAvatars[result.address];
                  return (
                    <button
                      key={result.address}
                      type="button"
                      role="option"
                      aria-selected={index === highlightedIndex}
                      id={`address-option-${index}`}
                      className={cn(
                        "w-full text-left px-3 py-2 focus:outline-none transition-colors duration-150 ease-in-out flex items-center gap-3",
                        index === highlightedIndex
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted/50"
                      )}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() =>
                        handleSelectIdentity(
                          result.address,
                          result.identity.display || ""
                        )
                      }
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {showAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl as string}
                            alt={
                              result.identity.display
                                ? String(result.identity.display)
                                : result.address
                            }
                            className="w-6 h-6 rounded-full"
                            onError={() =>
                              setFailedAvatars((prev) => ({
                                ...prev,
                                [result.address]: true,
                              }))
                            }
                          />
                        ) : (
                          <Identicon
                            value={result.address}
                            size={24}
                            theme={
                              validateAddress(result.address, format).type ===
                              "eth"
                                ? "ethereum"
                                : identiconTheme
                            }
                          />
                        )}
                        <span className="text-sm font-medium truncate text-foreground">
                          {result.identity.display}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[120px] font-mono">
                        {truncateAddress(result.address, 6)}
                      </span>
                    </button>
                  );
                })}
              {!isIdentitySearching &&
                !identitySearch.error &&
                identitySearch.data &&
                identitySearch.data.length === 0 && (
                  <div className="p-3 text-sm text-muted-foreground">
                    No identities found matching &ldquo;{debouncedSearch}
                    &rdquo;
                  </div>
                )}
            </div>
          )}

        {/* Avatar or identicon placeholder */}
        {showIdenticon && validationResult?.isValid && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {showInputAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentImageUrl as string}
                alt={
                  currentIdentity?.display
                    ? String(currentIdentity.display)
                    : inputValue
                }
                className="w-[26px] h-[26px] rounded-full"
                onError={() => setInputAvatarFailed(true)}
              />
            ) : (
              <Identicon
                value={inputValue}
                size={26}
                theme={
                  validationResult.type === "eth" ? "ethereum" : identiconTheme
                }
              />
            )}
          </div>
        )}

        {/* Copy button - shown when not editing and has valid address and not loading */}
        {withCopyButton &&
          !isEditing &&
          validationResult?.isValid &&
          inputValue &&
          !isIdentityLoading &&
          !isApiLoading && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 h-7 w-7 rounded-sm"
                    aria-label={isCopied ? "Copied!" : "Copy address"}
                  >
                    {isCopied ? (
                      <Check className="h-2 w-2" />
                    ) : (
                      <Copy className="h-2 w-2" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={6}>
                  {isCopied ? "Copied!" : "Copy address"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        {/* Loading spinner */}
        {(isIdentityLoading || isApiLoading) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Fixed height when status messages are shown to prevent layout shift */}
      <div className="min-h-[60px] space-y-1">
        {/* Connection status */}
        {validationResult?.type === "ss58" &&
          clientStatus !== ClientConnectionStatus.Connected && (
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <span>Not connected to chain. Identity lookup unavailable.</span>
            </div>
          )}

        {/* Validation error display (only after user interaction and when blurred) */}
        {validationResult?.error && hasInteracted && !isEditing && (
          <div
            id="address-input-error"
            className="flex items-center gap-2 text-sm text-red-600"
          >
            <span>{validationResult.error}</span>
          </div>
        )}

        {/* Valid address info */}
        {validationResult?.isValid &&
          (!currentIdentity || !currentIdentity.verified) && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CircleCheck className="h-4 w-4" />
              <span>
                Valid{" "}
                {validationResult.type === "ss58" ? "Polkadot" : "Ethereum"}{" "}
                address
              </span>
            </div>
          )}

        {/* Identity loading state - only show if not selected from search results */}
        {validationResult?.isValid &&
          withIdentityLookup &&
          validationResult.type === "ss58" &&
          !selectedFromSearch &&
          (polkadotIdentity.isFetching || isIdentityLoading) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Looking up identity...</span>
            </div>
          )}

        {/* Identity display */}
        {currentIdentity?.verified && (
          <div className="flex items-center gap-1 text-sm">
            <CircleCheck className="h-5 w-5 text-background fill-green-600 stroke-background" />
            {services.explorerUrl ? (
              <a
                href={`${services.explorerUrl}account/${inputValue}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:after:content-['_↗']"
              >
                {currentIdentity.display
                  ? `${currentIdentity.display}`
                  : "No identity defined"}
              </a>
            ) : (
              <span>
                {currentIdentity.display
                  ? `${currentIdentity.display}`
                  : "No identity defined"}
              </span>
            )}
          </div>
        )}

        {/* No identity found info */}
        {validationResult?.isValid &&
          withIdentityLookup &&
          validationResult.type === "ss58" &&
          !currentIdentity &&
          !selectedFromSearch &&
          !isIdentityLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>• No identity found</span>
            </div>
          )}
      </div>
    </div>
  );
});

AddressInputBase.displayName = "AddressInputBase";

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

export function AddressInputSkeleton({
  placeholder,
}: {
  placeholder?: string;
}) {
  return (
    <div className="space-y-1 w-full">
      <div className="relative">
        <Input
          onChange={() => {}}
          placeholder={placeholder || "Enter address"}
          className="mb-2"
          disabled
        />
      </div>
      <div className="min-h-[60px] space-y-1">
        <div className="flex items-center gap-1 text-sm text-muted-foreground"></div>
      </div>
    </div>
  );
}
