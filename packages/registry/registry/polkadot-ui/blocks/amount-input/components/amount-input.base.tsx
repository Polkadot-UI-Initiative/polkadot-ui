"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import type { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { Input } from "@/registry/polkadot-ui/ui/input";
import { SelectTokenDialogBase } from "@/registry/polkadot-ui/blocks/select-token/components/select-token-dialog.base";
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
  decimals?: number;
  maxValue?: bigint;
  displayValue?: bigint;
  required?: boolean;
  withTokenSelector?: boolean;
  selectedTokenId?: number;
  onTokenChange?: (assetId: number) => void;
  chainId?: string;
  assetIds?: number[];
  disabled?: boolean;
  className?: string;
  services: AmountInputServices<TNetworkId>;
}

const AmountInputWithTokenSelectorBase = forwardRef(
  function AmountInputWithTokenSelectorBase<TNetworkId extends string = string>(
    {
      value = "",
      onChange,
      placeholder = "Enter amount",
      onTokenChange,
      services,
      ...props
    }: AmountInputBaseProps<TNetworkId>,
    _ref: React.ForwardedRef<HTMLInputElement>
  ) {
    // Support both new and legacy service properties
    const isConnected = services.isConnected ?? false;
    const isDisabled = services.isDisabled ?? props.disabled ?? false;
    const connectedAccount = services.connectedAccount ?? null;

    const [inputAmount, setInputAmount] = useState(value);

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

    const handleTokenChange = (assetId: number) => {
      setSelectedTokenId(assetId);
      onTokenChange?.(assetId);
    };

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
            placeholder={placeholder}
            autoComplete="off"
            required={props.required}
            min="0"
            inputMode="decimal"
            className={cn("pl-24", props.className)}
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <SelectTokenDialogBase
              chainId={props.chainId || ""}
              assetIds={props.assetIds || []}
              withBalance={false}
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
          </div>
        </div>
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
    ...props
  }: AmountInputBaseProps<TNetworkId>,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  // Support both new and legacy service properties
  const isConnected = services.isConnected ?? false;
  const isDisabled = services.isDisabled ?? props.disabled ?? false;
  const connectedAccount = services.connectedAccount ?? null;

  const [inputAmount, setInputAmount] = useState(value);
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

  return (
    <div className="space-y-1 w-full">
      {props.label && <Label htmlFor={props.id}>{props.label}</Label>}

      <div className="relative">
        <Input
          id={props.id}
          disabled={isDisabled || !isConnected || !connectedAccount}
          type="number"
          ref={inputRef}
          value={inputAmount}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
          required={props.required}
          min="0"
          inputMode="decimal"
          className={cn(props.className)}
        />
      </div>
    </div>
  );
});
