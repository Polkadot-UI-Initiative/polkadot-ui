"use client";

import {
  type IdentitySearchResult,
  type PolkadotIdentity,
} from "@/registry/dot-ui/lib/types.dot-ui";
import { cn } from "@/registry/dot-ui/lib/utils";
import {
  truncateAddress,
  validateAddress,
  type ValidationResult,
} from "@/registry/dot-ui/lib/utils.dot-ui";
import { Button } from "@/registry/dot-ui/ui/button";
import { Input } from "@/registry/dot-ui/ui/input";
import { Label } from "@/registry/dot-ui/ui/label";
import { Identicon } from "@polkadot/react-identicon";
import { type IconTheme } from "@polkadot/react-identicon/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClientConnectionStatus, NetworkId, paseoPeople } from "typink";
import { Check, CircleCheck, Copy, Loader2 } from "lucide-react";
import { forwardRef, ReactNode, useEffect, useRef, useState } from "react";

// Services interface for dependency injection
//TODO this has dedot dependencies, we need generic service types
export interface AddressInputServices {
  // Hook for fetching identity by address
  useIdentity: (
    address: string,
    identityChain?: NetworkId
  ) => UseQueryResult<PolkadotIdentity | null, Error>;
  // Hook for searching identities by display name
  useIdentitySearch: (
    displayName: string | null,
    identityChain?: NetworkId
  ) => UseQueryResult<IdentitySearchResult[], Error>;
  clientStatus: ClientConnectionStatus;
  explorerUrl: string;
}

export interface AddressInputBaseProps {
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
  onIdentityFound?: (identity: IdentityResult) => void;
  ethProviderUrl?: string;
  truncate?: boolean | number;
  showIdenticon?: boolean;
  identiconTheme?: IconTheme;
  className?: string;
  identityChain?: NetworkId;
  required?: boolean;
  // Injected services - this makes it reusable
  services: AddressInputServices;
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

// Provider wrapper interface
export interface AddressInputProviderProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

// Default query client
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Generic provider wrapper component
export function AddressInputProvider({
  children,
  queryClient = defaultQueryClient,
}: AddressInputProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export const AddressInputBase = forwardRef<
  HTMLInputElement,
  AddressInputBaseProps
>(
  (
    {
      value = "",
      onChange,
      format = "ss58",
      identityChain = paseoPeople.id,
      withIdentityLookup = true,
      withIdentitySearch = true,
      withCopyButton = true,
      onIdentityFound,
      // withEnsLookup = false, // TODO: Implement ENS lookup
      // ethProviderUrl, // TODO: Implement ENS lookup
      truncate = 8,
      showIdenticon = true,
      identiconTheme = "polkadot",
      className,
      services, // Injected services - this makes it reusable for papi + dedot
      ...props
    },
    _ref
  ) => {
    const { useIdentity, useIdentitySearch, clientStatus } = services;

    const [inputValue, setInputValue] = useState(value);
    const [validationResult, setValidationResult] =
      useState<ValidationResult>();
    const [debouncedAddress, setDebouncedAddress] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectedFromSearch, setSelectedFromSearch] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    const polkadotIdentity = useIdentity(
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
        onChange(result.normalizedAddress || inputValue);
      }
    }, [inputValue, format, onChange]);

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

    // Notify parent element when identity is found
    useEffect(() => {
      if (currentIdentity && onIdentityFound) {
        onIdentityFound({
          type: "polkadot",
          data: currentIdentity,
        });
      }
    }, [currentIdentity, onIdentityFound]);

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
      if (
        showDropdown &&
        identitySearch.data &&
        identitySearch.data.length > 0
      ) {
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

    const handleSelectIdentity = (address: string, display: string) => {
      setSelectedFromSearch(true);
      setInputValue(address);
      setShowDropdown(false);
      setHighlightedIndex(-1);

      if (onChange) {
        onChange(address);
      }
      inputRef.current?.blur();

      // Trigger identity found callback
      if (onIdentityFound) {
        const selectedResult = identitySearch.data?.find(
          (result) => result.address === address
        );
        onIdentityFound({
          type: "polkadot",
          data: {
            display,
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
      <div className="space-y-1 w-full">
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
            aria-expanded={
              showDropdown &&
              withIdentitySearch &&
              !validationResult?.isValid &&
              debouncedSearch.length > 2
            }
            aria-haspopup="listbox"
            aria-controls={showDropdown ? "address-search-listbox" : undefined}
            className={cn(
              "mb-2",
              showIdenticon && validationResult?.isValid && "pl-10",
              inputValue.trim() &&
                validationResult?.isValid === false &&
                "border-red-500 focus:border-red-500",
              inputValue.trim() &&
                validationResult?.isValid === true &&
                "border-green-500 focus:border-green-500",
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
                  identitySearch.data.map((result, index) => (
                    <button
                      key={result.address}
                      type="button"
                      role="option"
                      aria-selected={index === highlightedIndex}
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
                        <span className="text-sm font-medium truncate text-foreground">
                          {result.identity.display}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[120px] font-mono">
                        {truncateAddress(result.address, 6)}
                      </span>
                    </button>
                  ))}
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

          {/* Identicon placeholder */}
          {showIdenticon && validationResult?.isValid && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <Identicon
                value={inputValue}
                size={26}
                theme={
                  validationResult.type === "eth" ? "ethereum" : identiconTheme
                }
              />
            </div>
          )}

          {/* Copy button - shown when not editing and has valid address and not loading */}
          {withCopyButton &&
            !isEditing &&
            validationResult?.isValid &&
            inputValue &&
            !isIdentityLoading &&
            !isApiLoading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 h-7 w-7 rounded-sm"
                title={isCopied ? "Copied!" : "Copy address"}
              >
                {isCopied ? (
                  <Check className="h-2 w-2" />
                ) : (
                  <Copy className="h-2 w-2" />
                )}
              </Button>
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
                <span>
                  Not connected to chain. Identity lookup unavailable.
                </span>
              </div>
            )}

          {/* Validation error display (only after user interaction and when blurred) */}
          {validationResult?.error && hasInteracted && !isEditing && (
            <div className="flex items-center gap-2 text-sm text-red-600">
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
  }
);

AddressInputBase.displayName = "AddressInputBase";
