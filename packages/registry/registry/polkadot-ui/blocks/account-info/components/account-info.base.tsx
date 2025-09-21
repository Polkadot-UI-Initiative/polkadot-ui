"use client";

import { cn } from "@/registry/polkadot-ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { truncateAddress } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { Identicon } from "@polkadot/react-identicon";
import React, { useState, Fragment } from "react";
import { Copy, Check, CircleCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface AccountInfoServices<TNetworkId> {
  useIdentityOf: (params: { chainId: TNetworkId; address: string }) => {
    data: PolkadotIdentity | null;
    isLoading: boolean;
    error: Error | null;
  };
}

export interface AccountInfoBaseProps<TNetworkId = string> {
  chainId: TNetworkId;
  address: string;
  showIcon?: boolean;
  iconTheme?: "polkadot" | "substrate" | "beachball" | "jdenticon";
  fields?: AccountInfoField[] | "all"; // fields shown in popover details
  truncate?: number | boolean;
  withPopover?: boolean;
  className?: string;
  services: AccountInfoServices<TNetworkId>;
}

export interface PolkadotIdentity {
  display?: string;
  legal?: string;
  email?: string;
  twitter?: string;
  github?: string;
  discord?: string;
  matrix?: string;
  image?: string;
  verified: boolean;
}

export type AccountInfoField =
  | "display"
  | "legal"
  | "email"
  | "twitter"
  | "github"
  | "discord"
  | "matrix"
  | "image"
  | "verified";

export function AccountInfoBase<TNetworkId extends string = string>({
  chainId,
  address,
  showIcon = true,
  iconTheme = "polkadot",
  fields = "all",
  truncate = 6,
  withPopover = true,
  className,
  services,
}: AccountInfoBaseProps<TNetworkId>) {
  const { data, isLoading, error } = services.useIdentityOf({
    chainId,
    address,
  });

  const fieldsToShow =
    fields === "all"
      ? ([
          "display",
          "legal",
          "twitter",
          "github",
          "email",
          "matrix",
          "discord",
          "verified",
        ] as AccountInfoField[])
      : fields;

  if (isLoading) {
    return <AccountInfoSkeleton address={address} />;
  }

  const rawName = data?.display ?? data?.legal ?? "";
  const summaryAddress = truncate
    ? truncateAddress(address, truncate)
    : address;
  const name = rawName && rawName !== address ? rawName : summaryAddress;

  const trigger = (
    <div className={cn("inline-flex items-center gap-2 p-2", className)}>
      {showIcon && !data?.image && (
        <Identicon value={address} size={28} theme={iconTheme} />
      )}
      {showIcon && data?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.image} alt={name} className="w-7 h-7 rounded-full" />
      )}
      <div className="flex flex-col leading-tight items-start text-left min-w-0 flex-1">
        <span className="text-sm inline-flex items-center gap-1 min-w-0">
          {data?.verified && (
            <CircleCheck className="h-4 w-4 text-background fill-green-600 stroke-background" />
          )}
          <span className="truncate">
            {isLoading ? "Loading…" : name || summaryAddress}
          </span>
        </span>
        <span className="text-xs text-muted-foreground font-mono truncate w-full">
          {summaryAddress}
        </span>
      </div>
    </div>
  );

  if (!withPopover) {
    const links = buildLinks({ data, fields: fieldsToShow });
    return (
      <div className="inline-flex items-center gap-2">
        {trigger}
        {links.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            {links.map((l: { label: string; href: string; text?: string }) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted"
              >
                {l.text ?? l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="cursor-pointer">
          {trigger}
        </button>
      </PopoverTrigger>
      <PopoverContent align="center">
        <div className="flex items-center gap-2 mb-2">
          {showIcon && !data?.image && (
            <Identicon value={address} size={28} theme={iconTheme} />
          )}
          {showIcon && data?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.image} alt={name} className="w-7 h-7 rounded-full" />
          )}
          <HeaderWithCopy
            name={name}
            address={address}
            truncated={truncateAddress(address, truncate)}
            isVerified={!!data?.verified}
          />
        </div>
        {!isLoading && (
          <div className="text-xs space-y-1">
            {renderDetails({ fields: fieldsToShow, data })}
          </div>
        )}
        {error && (
          <div className="text-xs text-red-600 mt-2">{error.message}</div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// removed summary fields (we only show name and address in summary)

AccountInfoBase.displayName = "AccountInfoBase";

function renderDetails({
  fields,
  data,
}: {
  fields: AccountInfoField[];
  data: PolkadotIdentity | null | undefined;
}) {
  if (!data) return null;
  const safe = (v?: string) => (v && v !== "[object Object]" ? v : undefined);
  const rows: { label: string; value: React.ReactNode }[] = [];
  const push = (label: string, v?: string | React.ReactNode) => {
    if (typeof v === "string") {
      const s = safe(v);
      if (!s) return;
      rows.push({ label, value: s });
      return;
    }
    if (v) rows.push({ label, value: v });
  };
  for (const f of fields) {
    if (f === "legal") push("Legal", data.legal);
    if (f === "email")
      push(
        "Email",
        data.email ? (
          <a
            href={`mailto:${data.email}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.email}
          </a>
        ) : undefined
      );
    if (f === "twitter") {
      const handle = data.twitter?.replace(/^@/, "");
      push(
        "Twitter",
        handle ? (
          <a
            href={`https://x.com/${handle}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @{handle}
          </a>
        ) : undefined
      );
    }
    if (f === "github")
      push(
        "GitHub",
        data.github ? (
          <a
            href={`https://github.com/${data.github}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.github}
          </a>
        ) : undefined
      );
    if (f === "discord")
      push(
        "Discord",
        data.discord ? (
          <a
            href={`https://discord.com/users/${encodeURIComponent(data.discord)}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.discord}
          </a>
        ) : undefined
      );
    if (f === "matrix")
      push(
        "Matrix",
        data.matrix ? (
          <a
            href={`https://matrix.to/#/${encodeURIComponent(data.matrix)}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.matrix}
          </a>
        ) : undefined
      );
  }

  return (
    <div className="grid grid-cols-[70px_1fr] gap-y-1 gap-x-2">
      {rows.map((r) => (
        <Fragment key={r.label}>
          <div className="text-muted-foreground">{r.label}</div>
          <div className="font-mono truncate">{r.value}</div>
        </Fragment>
      ))}
    </div>
  );
}

function buildLinks({
  data,
  fields,
}: {
  data: PolkadotIdentity | null | undefined;
  fields: AccountInfoField[];
}): { label: string; href: string; text?: string }[] {
  if (!data) return [];
  const links: { label: string; href: string; text?: string }[] = [];
  const add = (label: string, href?: string, text?: string) => {
    if (href) links.push({ label, href, text });
  };

  if (fields.includes("email"))
    add(
      "Email",
      data.email ? `mailto:${data.email}` : undefined,
      data.email ?? undefined
    );
  if (fields.includes("twitter")) {
    const handle = data.twitter?.replace(/^@/, "");
    add(
      "Twitter",
      handle ? `https://x.com/${handle}` : undefined,
      handle ? `@${handle}` : undefined
    );
  }
  if (fields.includes("github"))
    add(
      "GitHub",
      data.github ? `https://github.com/${data.github}` : undefined,
      data.github ?? undefined
    );
  if (fields.includes("discord"))
    add(
      "Discord",
      data.discord
        ? `https://discord.com/users/${encodeURIComponent(data.discord)}`
        : undefined,
      data.discord ?? undefined
    );
  if (fields.includes("matrix"))
    add(
      "Matrix",
      data.matrix
        ? `https://matrix.to/#/${encodeURIComponent(data.matrix)}`
        : undefined,
      data.matrix ?? undefined
    );

  return links;
}

function HeaderWithCopy({
  name,
  address,
  truncated,
  isVerified,
}: {
  name: string;
  address: string;
  truncated: string;
  isVerified: boolean;
}) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-medium inline-flex items-center gap-1">
        {isVerified && (
          <CircleCheck className="h-4 w-4 text-background fill-green-500 stroke-background" />
        )}
        {name}
      </span>
      <span className="text-xs text-muted-foreground font-mono inline-flex items-center gap-1">
        {truncated}
        <button
          type="button"
          aria-label="Copy address"
          onClick={onCopy}
          className="ml-1 p-0.5 rounded-sm hover:bg-muted text-muted-foreground"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </span>
    </div>
  );
}

export function AccountInfoSkeleton({ address }: { address?: string }) {
  return (
    <div className="inline-flex items-center gap-2 p-2">
      <div className="flex items-center justify-center">
        <Identicon value={address ?? "0x"} size={28} theme="polkadot" />
      </div>
      <div className="flex-col leading-tight items-start text-left flex gap-1">
        <span className="text-sm inline-flex items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {address ? truncateAddress(address, 6) : "5xxx…xxxx"}
        </span>
      </div>
    </div>
  );
}
