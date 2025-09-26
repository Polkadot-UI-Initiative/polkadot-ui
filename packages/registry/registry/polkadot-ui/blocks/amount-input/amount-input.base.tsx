"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { Input } from "@/registry/polkadot-ui/ui/input";
import { Button } from "@/registry/polkadot-ui/ui/button";
import { SelectTokenDialogBase } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.base";
import { TokenLogoWithNetwork } from "@/registry/polkadot-ui/blocks/select-token/shared-token-components";
import {
  formatTokenBalance,
  getTokenBalance,
  validateAmount,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { cn } from "@/registry/polkadot-ui/lib/utils";

export interface AmountInputServices<TNetworkId extends string = string> {
  // Connection status
  isConnected?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  connectedAccount?: { address?: string } | null;

  // Token/Asset data
  chainTokens?: Array<TokenInfo>;
  balances?: Record<number, bigint | null>;

  // Network info
  network?: {
    id: TNetworkId;
    decimals: number;
    symbol: string;
    name: string;
    logo?: string;
  };
}

export interface AmountInputBaseProps<TNetworkId extends string = string> {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  precision?: number;
  maxValue?: bigint;
  displayValue?: bigint;
  required?: boolean;
  withTokenSelector?: boolean;
  selectedTokenId?: number;
  onTokenChange?: (assetId: number) => void;
  chainId?: string;
  assetIds?: number[];
  includeNative?: boolean;
  disabled?: boolean;
  className?: string;
  services: AmountInputServices<TNetworkId>;
  step?: number | string;
  showMaxButton?: boolean;
  showAvailableBalance?: boolean;
  onMaxClick?: () => void;
  onValidationError?: (error: string | null) => void;
}

const AmountInputWithTokenSelectorBase = forwardRef(
  function AmountInputWithTokenSelectorBase<TNetworkId extends string = string>(
    {
      value = "",
      onChange,
      placeholder = "Enter amount",
      onTokenChange,
      services,
      onValidationError,
      precision,
      ...props
    }: AmountInputBaseProps<TNetworkId>,
    _ref: React.ForwardedRef<HTMLInputElement>
  ) {
    const isConnected = services.isConnected ?? false;
    const isDisabled = Boolean(services.isDisabled) || Boolean(props.disabled);
    const connectedAccount = services.connectedAccount ?? null;

    const [inputAmount, setInputAmount] = useState(value);
    const [validationError, setValidationError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

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

    // Sync input value with external value prop
    useEffect(() => {
      setInputAmount(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputAmount(newValue);
      onChange?.(newValue);
    };

    const [selectedTokenId, setSelectedTokenId] = useState<number | undefined>(
      props.selectedTokenId
    );

    // Keep internal token state in sync with prop changes
    useEffect(() => {
      setSelectedTokenId(props.selectedTokenId);
    }, [props.selectedTokenId]);

    // Auto-select single token if no token is selected
    useEffect(() => {
      if (
        !selectedTokenId &&
        services.chainTokens &&
        services.chainTokens.length === 1
      ) {
        const singleTokenId = Number(services.chainTokens[0].assetId);
        setSelectedTokenId(singleTokenId);
      }
    }, [selectedTokenId, services.chainTokens]);

    const handleTokenChange = (assetId: number) => {
      setSelectedTokenId(assetId);
      onTokenChange?.(assetId);
    };

    // Check if we should show fixed token display (single token)
    const shouldShowFixedToken =
      services.chainTokens && services.chainTokens.length === 1;
    const singleToken = shouldShowFixedToken ? services.chainTokens![0] : null;

    // Get current token for display
    const currentToken =
      selectedTokenId && services.chainTokens
        ? services.chainTokens.find(
            (t) => Number(t.assetId) === selectedTokenId
          )
        : singleToken;

    // Get balance for current token
    const currentBalance = currentToken
      ? getTokenBalance(
          services.balances,
          services.connectedAccount,
          Number(currentToken.assetId)
        )
      : null;

    const handleMaxClick = () => {
      if (currentBalance && currentToken) {
        const maxAmount = formatTokenBalance(
          currentBalance,
          currentToken.decimals,
          currentToken.decimals
        );
        setInputAmount(maxAmount);
        onChange?.(maxAmount);
      }
      props.onMaxClick?.();
    };

    // Validate input and update error state
    const validateInput = useCallback(
      (value: string) => {
        // Skip validation only if balance is undefined (not loaded yet)
        // null balance represents 0 balance and should be validated

        if (currentBalance === undefined) {
          setValidationError(null);
          onValidationError?.(null);
          return true;
        }

        const result = validateAmount(
          value,
          currentBalance,
          currentToken?.decimals ?? 12,
          precision
        );

        if (result.isValid) {
          setValidationError(null);
          onValidationError?.(null);
          return true;
        } else {
          const errorMessage = currentToken?.symbol
            ? result.error?.replace(/\)$/, ` ${currentToken.symbol})`)
            : result.error;
          setValidationError(errorMessage || "Invalid input");
          onValidationError?.(errorMessage || "Invalid input");
          return false;
        }
      },
      [currentBalance, currentToken, onValidationError, precision]
    );

    useEffect(() => {
      validateInput(inputAmount);
    }, [inputAmount, validateInput]);

    return (
      <div className="space-y-1 w-full">
        {props.label && <Label htmlFor={props.id}>{props.label}</Label>}

        <div className="relative">
          <Input
            disabled={isDisabled || !isConnected || !connectedAccount}
            type="number"
            ref={inputRef}
            value={inputAmount}
            onChange={handleInputChange}
            onKeyDown={(evt) =>
              ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
            }
            placeholder={placeholder}
            autoComplete="off"
            required={props.required}
            min="0"
            step={props.step}
            inputMode="decimal"
            className={cn(
              shouldShowFixedToken ? "pl-20" : "pl-24",
              props.showMaxButton ? "pr-16" : "",
              // Hide number input step controls
              "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
              // Error state styling
              validationError &&
                "border-destructive focus-visible:ring-destructive/20",
              props.className
            )}
          />

          {/* Token selector or fixed token display */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {shouldShowFixedToken && singleToken ? (
              <div className="flex items-center gap-1.5">
                <TokenLogoWithNetwork
                  tokenLogo={singleToken.logo}
                  networkLogo={services.network?.logo}
                  tokenSymbol={singleToken.symbol}
                  size="sm"
                />
                <span className="text-xs font-medium text-foreground">
                  {singleToken.symbol}
                </span>
              </div>
            ) : (
              <SelectTokenDialogBase
                withBalance
                withSearch
                compact={true}
                value={selectedTokenId}
                onChange={handleTokenChange}
                placeholder="Token"
                className="w-fit flex-shrink-0 h-6 px-1 py-0 text-xs border-0 bg-transparent hover:bg-accent/50"
                services={{
                  isConnected,
                  isLoading: services.isLoading ?? false,
                  isDisabled,
                  chainTokens: services.chainTokens || [],
                  connectedAccount,
                  network: services.network,
                  balances: services.balances,
                }}
              />
            )}
          </div>

          {/* Max button */}
          {props.showMaxButton && currentToken && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
              onClick={handleMaxClick}
              disabled={
                isDisabled ||
                !isConnected ||
                !connectedAccount ||
                currentBalance === null ||
                currentBalance === 0n
              }
            >
              MAX
            </Button>
          )}
        </div>

        {/* Available balance display */}
        {props.showAvailableBalance &&
          currentToken &&
          connectedAccount?.address && (
            <div className="text-xs text-muted-foreground mt-1">
              Available:{" "}
              {formatTokenBalance(currentBalance, currentToken.decimals, 4)}{" "}
              {currentToken.symbol}
            </div>
          )}

        {/* Validation error display */}
        {validationError && (
          <div className="text-xs text-destructive mt-1">{validationError}</div>
        )}
      </div>
    );
  }
);

export const AmountInputBase = forwardRef(function AmountInputBase<
  TNetworkId extends string = string,
>(
  props: AmountInputBaseProps<TNetworkId>,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  const { withTokenSelector = false } = props;

  // Use conditional rendering to choose between components
  if (withTokenSelector) {
    return <AmountInputWithTokenSelectorBase {...props} ref={_ref} />;
  }

  return <AmountInputSimpleBase {...props} ref={_ref} />;
});

export const AmountInputSimpleBase = forwardRef(function AmountInputSimpleBase<
  TNetworkId extends string = string,
>(
  {
    value = "",
    onChange,
    placeholder = "Enter amount",
    services,
    precision,
    ...props
  }: AmountInputBaseProps<TNetworkId>,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  // Support both new and legacy service properties
  const isConnected = services.isConnected ?? false;
  const isDisabled = Boolean(services.isDisabled) || Boolean(props.disabled);
  const connectedAccount = services.connectedAccount ?? null;

  const [inputAmount, setInputAmount] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Sync input value with external value prop
  useEffect(() => {
    setInputAmount(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputAmount(newValue);
    onChange?.(newValue);
  };

  // For simple input, we might still want to show max button if there's a network token
  const networkToken = useMemo(
    () =>
      services.network
        ? {
            symbol: services.network.symbol,
            decimals: services.network.decimals,
            assetId: "substrate-native",
            name: services.network.name,
            logo: services.network.logo,
          }
        : null,
    [services.network]
  );

  const nativeBalance =
    services.balances && networkToken
      ? getTokenBalance(
          services.balances,
          services.connectedAccount,
          "substrate-native"
        )
      : null;

  const handleMaxClick = () => {
    if (nativeBalance && networkToken) {
      const maxAmount = formatTokenBalance(
        nativeBalance,
        networkToken.decimals,
        networkToken.decimals
      );
      setInputAmount(maxAmount);
      onChange?.(maxAmount);
    }
    props.onMaxClick?.();
  };

  // Validate input and update error state
  const { onValidationError } = props;
  const validateInput = useCallback(
    (value: string) => {
      if (nativeBalance === undefined) {
        setValidationError(null);
        onValidationError?.(null);
        return true;
      }

      const result = validateAmount(
        value,
        nativeBalance,
        networkToken?.decimals,
        precision
      );

      if (result.isValid) {
        setValidationError(null);
        onValidationError?.(null);
        return true;
      } else {
        const errorMessage = networkToken?.symbol
          ? result.error?.replace(/\)$/, ` ${networkToken.symbol})`)
          : result.error;
        setValidationError(errorMessage || "Invalid input");
        onValidationError?.(errorMessage || "Invalid input");
        return false;
      }
    },
    [nativeBalance, networkToken, onValidationError, precision]
  );

  // Validate on input change
  useEffect(() => {
    validateInput(inputAmount);
  }, [inputAmount, validateInput]);

  return (
    <div className="space-y-1 w-full">
      {props.label && <Label htmlFor={props.id}>{props.label}</Label>}

      <div className="relative">
        <Input
          id={props.id}
          step={props.step}
          disabled={isDisabled || !isConnected || !connectedAccount}
          type="number"
          ref={inputRef}
          value={inputAmount}
          onChange={handleInputChange}
          onKeyDown={(evt) =>
            ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
          }
          placeholder={placeholder}
          autoComplete="off"
          required={props.required}
          min="0"
          inputMode="decimal"
          className={cn(
            props.showMaxButton ? "pr-16" : "",
            // Hide number input step controls
            "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
            // Error state styling
            validationError &&
              "border-destructive focus-visible:ring-destructive/20",
            props.className
          )}
        />

        {/* Max button for simple input */}
        {props.showMaxButton && networkToken && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
            onClick={handleMaxClick}
            disabled={
              isDisabled ||
              !isConnected ||
              !connectedAccount ||
              nativeBalance === null ||
              nativeBalance === 0n
            }
          >
            MAX
          </Button>
        )}
      </div>

      {/* Available balance display for simple input */}
      {props.showAvailableBalance &&
        networkToken &&
        connectedAccount?.address && (
          <div className="text-xs text-muted-foreground mt-1">
            Available:{" "}
            {formatTokenBalance(nativeBalance, networkToken.decimals, 2)}{" "}
            {networkToken.symbol}
          </div>
        )}

      {/* Validation error display */}
      {validationError && (
        <div className="text-xs text-destructive mt-1">{validationError}</div>
      )}
    </div>
  );
});
