"use client";

import { useEffect, useState } from "react";
import { cn } from "@/registry/polkadot-ui/lib/utils";
import {
  formatPlanck,
  parseDecimalToPlanck,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export interface AmountInputBaseProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value?: bigint | null;
  onChange?: (value: bigint | null) => void;
  decimals?: number;
  maxValue?: bigint | null;
  withMaxButton?: boolean;
  leftIconUrl?: string;
  leftIconAlt?: string;
  requiredBalance?: boolean;
  onValidationChange?: (validation: AmountValidation) => void;
  clampOnMax?: boolean;
}

export interface AmountValidation {
  isValid: boolean;
  reason?: "exceedsMax" | "invalid" | "empty";
  error?: string;
  valuePlanck: bigint | null;
  maxPlanck: bigint | null;
}

export function AmountInputBase(props: AmountInputBaseProps) {
  const {
    id,
    value = null,
    onChange,
    placeholder = "0.00",
    decimals = 12,
    maxValue,
    withMaxButton = true,
    leftIconUrl,
    leftIconAlt,
    className,
    requiredBalance = true,
    onValidationChange,
    clampOnMax = true,
    ...inputProps
  } = props;

  const [inputAmount, setInputAmount] = useState<string>(
    value == null
      ? ""
      : formatPlanck(value, decimals, {
          thousandsSeparator: "",
          decimalSeparator: ".",
          trimTrailingZeros: true,
          round: false,
        })
  );

  useEffect(() => {
    const next =
      value == null
        ? ""
        : formatPlanck(value, decimals, {
            thousandsSeparator: "",
            decimalSeparator: ".",
            trimTrailingZeros: true,
            round: false,
          });
    setInputAmount(next);
  }, [value, decimals]);
  const formattedMax =
    maxValue != null
      ? formatPlanck(maxValue, decimals, {
          thousandsSeparator: "",
          decimalSeparator: ".",
          trimTrailingZeros: true,
        })
      : undefined;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow only digits and a single dot
    let sanitized = raw.replace(/[^0-9.]/g, "");
    const firstDot = sanitized.indexOf(".");
    if (firstDot !== -1)
      sanitized =
        sanitized.slice(0, firstDot + 1) +
        sanitized.slice(firstDot + 1).replace(/\./g, "");

    // if the first character is a dot, add a 0 in front
    if (sanitized.startsWith(".")) {
      sanitized = "0" + sanitized;
    }

    // Parse and clamp
    let parsed: bigint | null = null;
    if (sanitized !== "") {
      parsed = parseDecimalToPlanck(sanitized, decimals, { round: false });
      const exceeds = parsed != null && maxValue != null && parsed > maxValue;
      if (exceeds && clampOnMax) {
        sanitized = formattedMax ?? sanitized;
        parsed = maxValue;
      }
      if (onValidationChange) {
        if (sanitized === "") {
          onValidationChange({
            isValid: false,
            reason: "empty",
            error: undefined,
            valuePlanck: null,
            maxPlanck: maxValue ?? null,
          });
        } else if (exceeds && !clampOnMax) {
          onValidationChange({
            isValid: false,
            reason: "exceedsMax",
            error: "That amount exceeds your wallet's funds",
            valuePlanck: parsed,
            maxPlanck: maxValue ?? null,
          });
        } else {
          onValidationChange({
            isValid: parsed != null,
            reason: parsed != null ? undefined : "invalid",
            error: parsed != null ? undefined : "Invalid amount",
            valuePlanck: parsed,
            maxPlanck: maxValue ?? null,
          });
        }
      }
    }

    setInputAmount(sanitized);
    onChange?.(sanitized === "" ? null : parsed);
  }

  function handleMaxClick() {
    if (maxValue == null || maxValue === 0n) return;
    const maxStr = formatPlanck(maxValue, decimals, {
      thousandsSeparator: "",
      decimalSeparator: ".",
      trimTrailingZeros: true,
    });
    setInputAmount(maxStr);
    onChange?.(maxValue);
  }

  const showMax = Boolean(withMaxButton);
  const showLeftIcon = Boolean(leftIconUrl);

  const finalDisabled =
    (inputProps.disabled ?? false) ||
    (requiredBalance === true && maxValue === 0n);

  return (
    <InputGroup>
      <InputGroupAddon>
        {showLeftIcon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={leftIconUrl}
            alt={leftIconAlt ?? "token"}
            className="size-5 rounded"
            aria-hidden={!leftIconAlt}
          />
        )}
      </InputGroupAddon>
      <InputGroupInput
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
          if (sanitized.startsWith(".")) sanitized = "0" + sanitized;

          // Clamp against maxValue on paste as well
          let parsed: bigint | null = null;
          if (sanitized !== "") {
            parsed = parseDecimalToPlanck(sanitized, decimals, {
              round: false,
            });
            const exceeds =
              parsed != null && maxValue != null && parsed > maxValue;
            if (exceeds && clampOnMax) {
              sanitized = formattedMax ?? sanitized;
              parsed = maxValue;
            }
            if (onValidationChange) {
              if (sanitized === "") {
                onValidationChange({
                  isValid: false,
                  reason: "empty",
                  error: undefined,
                  valuePlanck: null,
                  maxPlanck: maxValue ?? null,
                });
              } else if (exceeds && !clampOnMax) {
                onValidationChange({
                  isValid: false,
                  reason: "exceedsMax",
                  error: "That amount exceeds your wallet's funds",
                  valuePlanck: parsed,
                  maxPlanck: maxValue ?? null,
                });
              } else {
                onValidationChange({
                  isValid: parsed != null,
                  reason: parsed != null ? undefined : "invalid",
                  error: parsed != null ? undefined : "Invalid amount",
                  valuePlanck: parsed,
                  maxPlanck: maxValue ?? null,
                });
              }
            }
          }
          e.preventDefault();
          setInputAmount(sanitized);
          onChange?.(sanitized === "" ? null : parsed);
        }}
        onDrop={(e) => e.preventDefault()}
        placeholder={placeholder}
        autoComplete="off"
        min="0"
        max={inputProps.max ?? (clampOnMax ? formattedMax : undefined)}
        inputMode="decimal"
        pattern={inputProps.pattern ?? "[0-9]*\\.?[0-9]*"}
        className={cn("bg-background", className)}
        // className={cn(showMax && "pr-14", showLeftIcon && "pl-10", className)}
        {...inputProps}
      />
      {showMax && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={handleMaxClick}
            className="text-xs"
            aria-label="Set max amount"
            variant="outline"
            size="xs"
            disabled={maxValue == null || maxValue === 0n}
          >
            Max
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
