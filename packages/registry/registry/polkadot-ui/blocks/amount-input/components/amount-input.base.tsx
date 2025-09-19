import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { forwardRef, useEffect, useRef, useState } from "react";
import type {
  AnyFn,
  TxAdapter,
  BaseProviderProps,
  ExtendedComponentServices,
  BaseChainComponentProps,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { Input } from "@/registry/polkadot-ui/ui/input";

export type AmountInputServices<TNetworkId extends string = string> =
  ExtendedComponentServices<TNetworkId>;

export interface AmountInputBaseProps<
  TTx extends TxAdapter<AnyFn> = TxAdapter<AnyFn>,
  TNetworkId extends string = string,
> extends BaseChainComponentProps<TNetworkId> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  decimals?: number;
  maxValue?: bigint;
  displayValue?: bigint;
  tx?: TTx;
  required?: boolean;
  services: AmountInputServices<TNetworkId>;
}

export type AmountInputProviderProps = BaseProviderProps;

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function AmountInputProvider({
  children,
  queryClient = defaultQueryClient,
}: AmountInputProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export const AmountInputBase = forwardRef(function AmountInputBase<
  TTx extends TxAdapter<AnyFn> = TxAdapter<AnyFn>,
  TNetworkId extends string = string,
>(
  {
    value = "",
    onChange,
    placeholder = "Enter amount",
    services,
    ...props
  }: AmountInputBaseProps<TTx, TNetworkId>,
  _ref: React.ForwardedRef<HTMLInputElement>
) {
  // Support both new and legacy service properties
  const isConnected = services.isConnected ?? services.connected ?? false;
  const isDisabled = services.isDisabled ?? props.disabled ?? false;
  const connectedAccount = services.connectedAccount ?? null;

  const [inputAmount, setInputAmount] = useState(value);

  const inputRef = useRef<HTMLInputElement>(null);
  // const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      {props.label && <Label>{props.label}</Label>}

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
          className={props.className}
        />
      </div>
    </div>
  );
});
