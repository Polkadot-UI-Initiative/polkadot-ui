"use client";

import { useEffect, useMemo, useState } from "react";
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
  /** USD conversion rate for the token (1 token -> X USD). When provided,
   *  an estimated USD value is shown below the input. */
  tokenConversionRate?: number;
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
    tokenConversionRate,
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

  const formattedMax = useMemo(
    () =>
      maxValue != null
        ? formatPlanck(maxValue, decimals, {
            thousandsSeparator: "",
            decimalSeparator: ".",
            trimTrailingZeros: true,
            round: false,
          })
        : undefined,
    [maxValue, decimals]
  );

  // USD estimate based on current sanitized input and conversion rate
  const usdEstimate = useMemo(() => {
    if (tokenConversionRate == null) return null;
    const parsed = parseDecimalToPlanck(inputAmount, decimals, {
      round: false,
    });
    if (parsed == null) return null;
    const divisor = 10 ** Math.max(0, decimals);
    const tokenAmount = Number(parsed) / divisor;
    if (!Number.isFinite(tokenAmount)) return null;
    const usd = tokenAmount * tokenConversionRate;
    return Number.isFinite(usd) ? usd : null;
  }, [inputAmount, decimals, tokenConversionRate]);

  const usdLabel = useMemo(() => {
    if (usdEstimate == null) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdEstimate);
  }, [usdEstimate]);

  /**
   * Normalize raw user input into a parser-friendly decimal string.
   * - Keeps digits and one dot
   * - Drops extra dots/invalid chars
   * - Prefixes standalone dot with a leading zero
   */
  function sanitize(raw: string): string {
    let s = raw.replace(/[^0-9.]/g, "");
    const firstDot = s.indexOf(".");
    if (firstDot !== -1)
      s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
    if (s.startsWith(".")) s = "0" + s;
    return s;
  }

  /**
   * Parse sanitized decimal into planck, detect max overflow, and clamp
   * to max when clampOnMax is enabled. Returns the effective string/value
   * and whether overflow occurred.
   */
  function validateAndClamp(s: string): {
    sanitized: string;
    parsed: bigint | null;
    exceeds: boolean;
  } {
    if (s === "") return { sanitized: s, parsed: null, exceeds: false };
    const parsed = parseDecimalToPlanck(s, decimals, { round: false });
    const exceeds = parsed != null && maxValue != null && parsed > maxValue;
    if (exceeds && clampOnMax)
      return {
        sanitized: formattedMax ?? s,
        parsed: maxValue ?? parsed,
        exceeds,
      };
    return { sanitized: s, parsed, exceeds };
  }

  /**
   * Emit structured validation to consumers when provided, covering
   * empty/invalid/exceeds cases in a consistent shape.
   */
  function emitValidation(
    sanitized: string,
    parsed: bigint | null,
    exceeds: boolean
  ) {
    if (!onValidationChange) return;
    if (sanitized === "") {
      onValidationChange({
        isValid: false,
        reason: "empty",
        error: undefined,
        valuePlanck: null,
        maxPlanck: maxValue ?? null,
      });
      return;
    }
    if (exceeds && !clampOnMax) {
      onValidationChange({
        isValid: false,
        reason: "exceedsMax",
        error: "That amount exceeds your wallet's funds",
        valuePlanck: parsed,
        maxPlanck: maxValue ?? null,
      });
      return;
    }
    onValidationChange({
      isValid: parsed != null,
      reason: parsed != null ? undefined : "invalid",
      error: parsed != null ? undefined : "Invalid amount",
      valuePlanck: parsed,
      maxPlanck: maxValue ?? null,
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const sanitized = sanitize(raw);
    const {
      sanitized: nextSanitized,
      parsed,
      exceeds,
    } = validateAndClamp(sanitized);
    emitValidation(nextSanitized, parsed, exceeds);
    setInputAmount(nextSanitized);
    onChange?.(nextSanitized === "" ? null : parsed);
  }

  function handleMaxClick() {
    if (maxValue == null || maxValue === 0n) return;
    // If a step is provided, floor max to the nearest step multiple to satisfy
    // native <input type="number"> validation constraints.
    let steppedMax: bigint = maxValue;
    const stepProp = (inputProps as { step?: number | string })?.step;
    if (stepProp != null && stepProp !== "any") {
      const stepStr =
        typeof stepProp === "number" ? String(stepProp) : String(stepProp);
      const stepPlanckMaybe = parseDecimalToPlanck(stepStr, decimals, {
        round: false,
      });
      if (typeof stepPlanckMaybe === "bigint" && stepPlanckMaybe > 0n) {
        const stepPlanck = stepPlanckMaybe;
        steppedMax = (maxValue / stepPlanck) * stepPlanck; // floor to step
      }
    }

    const maxStr = formatPlanck(steppedMax, decimals, {
      thousandsSeparator: "",
      decimalSeparator: ".",
      trimTrailingZeros: true,
      round: false,
    });
    setInputAmount(maxStr);
    onChange?.(steppedMax);
  }

  const showMax = Boolean(withMaxButton);
  const showLeftIcon = Boolean(leftIconUrl);

  const finalDisabled =
    (inputProps.disabled ?? false) ||
    (requiredBalance === true && maxValue === 0n);

  return (
    <div className="basis-full flex flex-col gap-0.5">
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
          {leftIconAlt}
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
            e.preventDefault();
            const text = e.clipboardData.getData("text");
            // Reuse input change logic by faking a target
            const fakeEvent = {
              target: { value: text },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(fakeEvent);
          }}
          onDrop={(e) => e.preventDefault()}
          placeholder={placeholder}
          autoComplete="off"
          min="0"
          max={inputProps.max ?? (clampOnMax ? formattedMax : undefined)}
          inputMode="decimal"
          pattern={inputProps.pattern ?? "[0-9]*\\.?[0-9]*"}
          className={className}
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
      {usdLabel && (
        <div className="text-xs text-muted-foreground mt-1">
          ~ {usdLabel} USD
        </div>
      )}
    </div>
  );
}
