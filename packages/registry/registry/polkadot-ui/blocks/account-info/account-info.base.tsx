"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/registry/polkadot-ui/lib/utils";
import { truncateAddress } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { Identicon } from "@polkadot/react-identicon";
import { Check, CircleCheck, Copy } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import type { PolkadotIdentity } from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface AccountInfoServices {
  identity: PolkadotIdentity | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AccountInfoBaseProps<TNetworkId = string> {
  chainId?: TNetworkId;
  address: string;
  showIcon?: boolean;
  iconTheme?: "polkadot" | "substrate" | "beachball" | "jdenticon";
  fields?: AccountInfoField[] | "all"; // fields shown in popover details
  truncate?: number | boolean;
  componentType?: "popover" | "hover";
  className?: string;
  services: AccountInfoServices;
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
  address,
  showIcon = true,
  iconTheme = "polkadot",
  fields = "all",
  truncate = 6,
  componentType = "hover",
  className,
  services,
}: AccountInfoBaseProps<TNetworkId>) {
  const { identity, isLoading, error } = services;

  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    setImageLoaded(false);
  }, [identity?.image]);

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

  // if (isLoading) {
  //   return <AccountInfoSkeleton address={address} />;
  // }

  const rawName = identity?.display ?? identity?.legal ?? "";
  const summaryAddress = truncate
    ? truncateAddress(address, truncate)
    : address;
  const name =
    rawName && rawName !== address ? rawName.toString() : summaryAddress;

  const trigger = (
    <div
      className={cn(
        "inline-flex items-center justify-start text-left gap-2 p-2",
        className
      )}
    >
      {showIcon && !identity?.image && (
        <Identicon value={address} size={28} theme={iconTheme} />
      )}
      {showIcon && identity?.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={identity.image.toString()}
          alt={name}
          className={cn(
            "w-7 h-7 !my-0 rounded-full transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      )}
      <div className="flex flex-col leading-tight items-start text-left min-w-0 flex-1">
        <span className="text-sm inline-flex items-center gap-1 min-w-0">
          {identity?.verified && (
            <CircleCheck className="h-4 w-4 text-background fill-green-600 stroke-background" />
          )}
          <span className="truncate">{name || summaryAddress}</span>
        </span>
        <span className="text-xs text-muted-foreground font-mono truncate w-full">
          {summaryAddress}
        </span>
      </div>
    </div>
  );

  if (componentType === undefined) {
    const links = buildLinks({ identity, fields: fieldsToShow });
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

  if (componentType === "popover") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="cursor-pointer inline-flex items-start justify-start text-left bg-transparent border-0 p-0 m-0 min-w-0"
          >
            {trigger}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2 mb-2">
            {showIcon && !identity?.image && (
              <Identicon value={address} size={28} theme={iconTheme} />
            )}
            {showIcon && identity?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={identity.image.toString()}
                alt={name}
                className="w-7 h-7 !my-0 rounded-full"
              />
            )}
            <HeaderWithCopy
              name={name}
              address={address}
              truncated={truncateAddress(address, truncate)}
              isVerified={!!identity?.verified}
            />
          </div>
          {!isLoading && (
            <div className="text-xs space-y-1">
              {renderDetails({ fields: fieldsToShow, identity })}
            </div>
          )}
          {error && (
            <div className="text-xs text-red-600 mt-2">{error.message}</div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard openDelay={200} closeDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="cursor-pointer inline-flex items-start justify-start text-left bg-transparent border-0 p-0 m-0 min-w-0"
        >
          {trigger}
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="center" className="bg-background">
        <div className="flex items-center gap-2 mb-2">
          {showIcon && !identity?.image && (
            <Identicon value={address} size={28} theme={iconTheme} />
          )}
          {showIcon && identity?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={identity.image.toString()}
              alt={name}
              className={cn(
                "w-7 h-7 !my-0 rounded-full transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          <HeaderWithCopy
            name={name}
            address={address}
            truncated={truncateAddress(address, truncate)}
            isVerified={!!identity?.verified}
          />
        </div>
        {!isLoading && (
          <div className="text-xs space-y-1">
            {renderDetails({ fields: fieldsToShow, identity })}
          </div>
        )}
        {error && (
          <div className="text-xs text-red-600 mt-2">{error.message}</div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

// removed summary fields (we only show name and address in summary)

AccountInfoBase.displayName = "AccountInfoBase";

function renderDetails({
  fields,
  identity,
}: {
  fields: AccountInfoField[];
  identity: PolkadotIdentity | null | undefined;
}) {
  if (!identity) return null;
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
    if (f === "legal") push("Legal", identity.legal);
    if (f === "email")
      push(
        "Email",
        identity.email ? (
          <a
            href={`mailto:${identity.email}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {identity.email}
          </a>
        ) : undefined
      );
    if (f === "twitter") {
      const handle = identity.twitter?.toString().replace(/^@/, "");
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
        identity.github ? (
          <a
            href={`https://github.com/${identity.github}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {identity.github}
          </a>
        ) : undefined
      );
    if (f === "discord")
      push(
        "Discord",
        identity.discord ? (
          <a
            href={`https://discord.com/users/${encodeURIComponent(identity.discord)}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {identity.discord}
          </a>
        ) : undefined
      );
    if (f === "matrix")
      push(
        "Matrix",
        identity.matrix ? (
          <a
            href={`https://matrix.to/#/${encodeURIComponent(identity.matrix)}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {identity.matrix}
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
  identity,
  fields,
}: {
  identity: PolkadotIdentity | null | undefined;
  fields: AccountInfoField[];
}): { label: string; href: string; text?: string }[] {
  if (!identity) return [];
  const links: { label: string; href: string; text?: string }[] = [];
  const add = (label: string, href?: string, text?: string) => {
    if (href) links.push({ label, href, text });
  };

  if (fields.includes("email"))
    add(
      "Email",
      identity.email ? `mailto:${identity.email}` : undefined,
      identity.email?.toString() ?? undefined
    );
  if (fields.includes("twitter")) {
    const handle = identity.twitter?.toString().replace(/^@/, "");
    add(
      "Twitter",
      handle ? `https://x.com/${handle}` : undefined,
      handle ? `@${handle}` : undefined
    );
  }
  if (fields.includes("github"))
    add(
      "GitHub",
      identity.github ? `https://github.com/${identity.github}` : undefined,
      identity.github?.toString() ?? undefined
    );
  if (fields.includes("discord"))
    add(
      "Discord",
      identity.discord
        ? `https://discord.com/users/${encodeURIComponent(identity.discord)}`
        : undefined,
      identity.discord?.toString() ?? undefined
    );
  if (fields.includes("matrix"))
    add(
      "Matrix",
      identity.matrix
        ? `https://matrix.to/#/${encodeURIComponent(identity.matrix)}`
        : undefined,
      identity.matrix?.toString() ?? undefined
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
        <Tooltip delayDuration={400}>
          <TooltipTrigger>{truncated}</TooltipTrigger>
          <TooltipContent>{address}</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={400}>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>Copy address</TooltipContent>
        </Tooltip>
      </span>
    </div>
  );
}

export function AccountInfoSkeleton(
  props: Omit<AccountInfoBaseProps, "services">
) {
  const truncLen = typeof props.truncate === "number" ? props.truncate : 6;
  return (
    <div
      className={cn(
        "inline-flex items-center justify-start text-left gap-2 p-2",
        props.className
      )}
    >
      <Identicon
        value={props.address}
        size={28}
        theme={props.iconTheme || "polkadot"}
      />
      <div className="flex flex-col leading-tight items-start text-left min-w-0 flex-1">
        <span className="text-sm inline-flex items-center gap-1 min-w-0">
          <span className="truncate">
            {truncateAddress(props.address, truncLen)}
          </span>
        </span>
        <span className="text-xs text-muted-foreground font-mono truncate w-full">
          {truncateAddress(props.address, truncLen)}
        </span>
      </div>
    </div>
  );
}
