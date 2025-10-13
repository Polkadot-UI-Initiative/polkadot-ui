"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressInput } from "@/registry/polkadot-ui/blocks/address-input/address-input.dedot";
import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.dedot";
import { ConnectWallet } from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { polkadotPeople } from "typink";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FormValues {
  to: string;
  amount: bigint | null;
}

const formSchema = z.object({
  to: z.string().min(1, "Address is required"),
  amount: z.bigint().min(0n, "Amount must be >= 0").nullable(),
});

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { to: "", amount: null },
  });

  const values = watch();
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  function onSubmit(data: FormValues) {
    setSubmitted(data);
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>
            {JSON.stringify(
              { to: data.to, amount: data.amount?.toString() },
              null,
              2
            )}
          </code>
        </pre>
      ),
      position: "bottom-right",
      classNames: { content: "flex flex-col gap-2" },
    });
  }

  const chainId = useMemo(() => polkadotPeople.id, []);

  return (
    <PolkadotProvider>
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Send Demo</h1>
          <ConnectWallet />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient</label>
            <Controller
              control={control}
              name="to"
              render={({
                field,
              }: {
                field: { value: string; onChange: (addr: string) => void };
              }) => (
                <AddressInput
                  identityChain={polkadotPeople.id}
                  className="w-full"
                  truncate={8}
                  format="both"
                  required={false}
                  placeholder="Enter an address or search for an identity"
                  value={field.value}
                  onChange={(addr) => field.onChange(addr)}
                />
              )}
            />
            {errors.to && (
              <p className="text-xs text-destructive">{errors.to.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <AmountInput
                  chainId={chainId}
                  assetId={NATIVE_TOKEN_KEY}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  withMaxButton={true}
                  // maxValue={55555555555555n}
                />
              )}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">
                {errors.amount.message as string}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit">Submit</Button>
          </div>
        </form>

        <div className="rounded-md border p-3 text-xs">
          <div className="font-medium mb-1">Form State</div>
          <pre>
            {JSON.stringify(
              { values: stringify(values), submitted: stringify(submitted) },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </PolkadotProvider>
  );
}

function stringify(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}
