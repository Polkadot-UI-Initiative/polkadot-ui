import { PolkadotLogo } from "@/components/polkadot-logo";
import Link from "next/link";
import { Logo } from "../logo";

const sitemap = [
  {
    title: "Company",
    links: [
      {
        title: "About Us",
        href: "#",
      },
      {
        title: "Careers",
        href: "#",
      },
      {
        title: "Contact",
        href: "#",
      },
      {
        title: "Press",
        href: "#",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        title: "Help Center",
        href: "#",
      },
      {
        title: "Community",
        href: "#",
      },
      {
        title: "Status",
        href: "#",
      },
      {
        title: "API Docs",
        href: "#",
      },
    ],
  },
];

export function Footer() {
  return (
    <section className="py-16 bg-gradient-to-b from-background via-polkadot-violet/10 to-polkadot-violet/50">
      <div className="px-8">
        <footer>
          <div className="relative mb-8 flex w-full flex-col gap-x-28 gap-y-8 md:flex-row md:justify-between md:gap-y-0">
            <div className="max-w-96">
              <div className="mb-6 flex items-center gap-3">
                <Logo props={{ className: "size-8" }} />
                <h3 className="text-xl font-bold">Polkadot UI</h3>
              </div>
              <p className="text-muted-foreground text-base font-medium">
                Copy the code and make it yours.
              </p>
            </div>
            <div className="flex flex-col items-start gap-x-20 gap-y-14 xl:flex-row">
              <div className="inline-grid w-fit grid-cols-1 gap-x-20 gap-y-14 sm:grid-cols-2">
                {sitemap.map((section) => (
                  <div key={section.title} className="h-fit w-min">
                    <h4 className="mb-6 whitespace-nowrap text-base font-semibold">
                      {section.title}
                    </h4>
                    <ul className="text-muted-foreground space-y-3 text-base font-medium">
                      {section.links.map((link) => (
                        <li key={link.title}>
                          <a
                            href={link.href}
                            className="hover:text-accent-foreground whitespace-nowrap text-base"
                          >
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-border flex flex-col items-baseline justify-between gap-8 border-t pt-8 md:flex-row md:gap-16">
            <div className="text-muted-foreground text-xs sm:text-sm">
              Open Source, MIT License
            </div>
            <div>
              <span className="mr-1 text-sm font-light">Supported by</span>
              <Link href="https://uxbounty.xyz" className="font-unbounded">
                Polkadot UX Bounty
              </Link>
            </div>
            <Link href="https://polkadot.com" className="font-unbounded">
              <PolkadotLogo withPoweredBy />
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}

// return (
//   <footer className="flex justify-center items-center mt-12 mb-4 p-4">
//     <div className="flex flex-col items-center gap-2 text-center">
//       <div>
//         <span className="mr-1 text-sm font-light">Funded by</span>
//         <Link href="https://uxbounty.xyz" className="font-unbounded">
//           UX Bounty
//         </Link>
//       </div>
//       <Link href="https://polkadot.com" className="font-unbounded">
//         <PolkadotLogo withPoweredBy />
//       </Link>
//     </div>
//   </footer>
// );
