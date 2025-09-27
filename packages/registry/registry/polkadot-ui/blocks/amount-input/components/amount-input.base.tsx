"use client";

import { useEffect, useState } from "react";
import { Input } from "@/registry/polkadot-ui/ui/input";
import { cn } from "@/registry/polkadot-ui/lib/utils";
import { formatPlanck } from "@/registry/polkadot-ui/lib/utils.dot-ui";

export interface AmountInputBaseProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  decimals?: number;
  maxValue?: bigint | null;
  withMaxButton?: boolean;
  leftIconUrl?: string;
  leftIconAlt?: string;
  disabled?: boolean;
  className?: string;
  step?: number | string;
}

export function AmountInputBase(props: AmountInputBaseProps) {
  const {
    id,
    value = "",
    onChange,
    placeholder = "Enter amount",
    decimals = 12,
    maxValue,
    withMaxButton = true,
    leftIconUrl,
    leftIconAlt,
    disabled,
    className,
    step,
  } = props;

  const [inputAmount, setInputAmount] = useState<string>(value);

  useEffect(() => setInputAmount(value), [value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setInputAmount(newValue);
    onChange?.(newValue);
  }

  function handleMaxClick() {
    if (maxValue == null || maxValue === 0n) return;
    const maxStr = formatPlanck(maxValue, decimals, {
      thousandsSeparator: "",
      decimalSeparator: ".",
      trimTrailingZeros: true,
    });
    setInputAmount(maxStr);
    onChange?.(maxStr);
  }

  const showMax = withMaxButton && maxValue != null && maxValue > 0n;
  const showLeftIcon = Boolean(leftIconUrl);

  return (
    <div className="relative w-full">
      <Input
        id={id}
        step={step}
        type="number"
        disabled={disabled}
        value={inputAmount}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
        min="0"
        inputMode="decimal"
        className={cn(showMax && "pr-14", showLeftIcon && "pl-10", className)}
      />
      {showLeftIcon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={leftIconUrl}
          alt={leftIconAlt ?? "token"}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-5 rounded"
          aria-hidden={!leftIconAlt}
        />
      )}
      {showMax && (
        <button
          type="button"
          onClick={handleMaxClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs rounded border bg-background hover:bg-accent/50"
          aria-label="Set max amount"
        >
          Max
        </button>
      )}
    </div>
  );
}
