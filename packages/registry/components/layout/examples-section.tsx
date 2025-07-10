import Link from "next/link";
import { BlockNumber } from "@/registry/polkadot-ui/blocks/block-number/components/block-number";

const examples = [
  {
    name: "Block Number",
    href: "/blocks",
    code: "block-number",
    description: "Display the current block number on a chain",
    component: <BlockNumber />,
  },
];

// const categories = [
//   {
//     name: "Featured",
//     href: "/examples",
//     description: "Most popular Polkadot components",
//     className: "text-primary border-primary",
//   },
//   {
//     name: "Blockchain",
//     href: "/examples/blockchain",
//     description: "Core blockchain interactions",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
//   {
//     name: "Wallet",
//     href: "/examples/wallet",
//     description: "Wallet connection and management",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
//   {
//     name: "DeFi",
//     href: "/examples/defi",
//     description: "Decentralized finance components",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
//   {
//     name: "Governance",
//     href: "/examples/governance",
//     description: "On-chain governance tools",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
// ];

export function ExamplesSection() {
  return (
    <section className="container space-y-6 py-8 md:py-8 lg:py-12">
      {/* Examples grid */}
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {examples.map((example) => (
          <div
            key={example.name}
            className="relative overflow-hidden rounded-lg border bg-background p-2"
          >
            <div className="flex  flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">{example.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {example.description}
                </p>
              </div>
              <div className="flex items-center justify-center">
                {example.component}
              </div>
            </div>
            <div className="flex items-center justify-between p-6">
              <div className="text-xs text-muted-foreground font-mono">
                {example.code}
              </div>
              <Link
                href={example.href}
                className="text-xs text-primary hover:underline"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
        <div className="relative overflow-hidden rounded-lg border bg-background p-2 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-between rounded-md">
            <div className="space-y-2">
              <h3 className="font-bold">More Coming Soon</h3>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="text-xs text-muted-foreground font-mono"></div>
            <Link
              href="https://github.com/Polkadot-UI-Initiative/dot-ui"
              className="text-xs text-primary hover:underline"
            >
              View on GitHub →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
