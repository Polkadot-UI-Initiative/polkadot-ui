"use client";

import { useEffect, useState } from "react";
import { Input } from "@/registry/polkadot-ui/ui/input";
import type { InputProps } from "@/registry/polkadot-ui/ui/input";
import { cn } from "@/registry/polkadot-ui/lib/utils";
import { formatPlanck } from "@/registry/polkadot-ui/lib/utils.dot-ui";

export interface AmountInputBaseProps extends Omit<InputProps, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  decimals?: number;
  maxValue?: bigint | null;
  withMaxButton?: boolean;
  leftIconUrl?: string;
  leftIconAlt?: string;
  requiredBalance?: boolean;
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
    className,
    requiredBalance = true,
    ...inputProps
  } = props;

  const [inputAmount, setInputAmount] = useState<string>(value);

  useEffect(() => setInputAmount(value), [value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow only digits and a single dot
    let sanitized = raw.replace(/[^0-9.]/g, "");
    const firstDot = sanitized.indexOf(".");
    if (firstDot !== -1)
      sanitized =
        sanitized.slice(0, firstDot + 1) +
        sanitized.slice(firstDot + 1).replace(/\./g, "");

    setInputAmount(sanitized);
    onChange?.(sanitized);
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

  const showMax = Boolean(withMaxButton);
  const showLeftIcon = Boolean(leftIconUrl);

  const formattedMax =
    maxValue != null
      ? formatPlanck(maxValue, decimals, {
          thousandsSeparator: "",
          decimalSeparator: ".",
          trimTrailingZeros: true,
        })
      : undefined;

  const finalDisabled =
    (inputProps.disabled ?? false) ||
    (requiredBalance === true && maxValue === 0n);

  return (
    <div className="relative w-full">
      <Input
        id={id}
        type="number"
        disabled={finalDisabled}
        value={inputAmount}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (["e", "E", "+", "-", " "].includes(e.key)) e.preventDefault();
        }}
        onBeforeInput={(e) => {
          const ev = e as unknown as InputEvent;
          const data =
            (ev && "data" in ev ? (ev as InputEvent).data : "") || "";
          if (!data) return;
          if (!/^[0-9.]$/.test(data)) {
            e.preventDefault();
            return;
          }
          if (data === "." && inputAmount.includes(".")) e.preventDefault();
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          let sanitized = text.replace(/[^0-9.]/g, "");
          const firstDot = sanitized.indexOf(".");
          if (firstDot !== -1)
            sanitized =
              sanitized.slice(0, firstDot + 1) +
              sanitized.slice(firstDot + 1).replace(/\./g, "");
          e.preventDefault();
          setInputAmount(sanitized);
          onChange?.(sanitized);
        }}
        onDrop={(e) => e.preventDefault()}
        placeholder={placeholder}
        autoComplete="off"
        min="0"
        max={inputProps.max ?? formattedMax}
        inputMode="decimal"
        pattern={inputProps.pattern ?? "[0-9]*\\.?[0-9]*"}
        className={cn(showMax && "pr-14", showLeftIcon && "pl-10", className)}
        {...inputProps}
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
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs rounded border bg-background hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Set max amount"
          disabled={maxValue == null || maxValue === 0n}
        >
          Max
        </button>
      )}
    </div>
  );
}
