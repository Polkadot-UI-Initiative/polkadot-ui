import { PolkadotLogo } from "@/components/polkadot-logo";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "../logo";

// Removed sitemap links in favor of social icons

export function Footer() {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-polkadot-violet/10 to-polkadot-violet/50">
      <div className="px-8">
        <footer>
          <div className="relative mb-8 flex w-full flex-col gap-x-28 gap-y-8 md:flex-row md:justify-between md:gap-y-0">
            <div className="max-w-96">
              <div className="mb-6 flex items-center gap-3">
                <Logo props={{ className: "size-8" }} />
                <h3 className="text-xl font-bold">Polkadot UI</h3>
              </div>
              <p className="text-muted-foreground text-base font-medium">
                Customizable and open source Polkadot react components built on
                top of Papi/Reactive-Dot + Dedot/Typink.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href={SOCIAL_LINKS.x}
                aria-label="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-5" />
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                aria-label="Telegram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <TelegramIcon className="size-5" />
              </a>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                aria-label="Email"
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-5" />
              </a>
            </div>
          </div>
          <div className="border-border flex flex-col items-baseline justify-between gap-8 border-t pt-8 md:flex-row md:gap-16">
            <div className="text-muted-foreground text-xs sm:text-sm">
              <Link href="https://github.com/Polkadot-UI-Initiative/polkadot-ui/blob/main/LICENSE">
                MIT License
              </Link>
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

const SOCIAL_LINKS = {
  x: "https://x.com/PolkadotUX",
  telegram: "https://t.me/polkadotui",
  email: "contact@polkadot-ui.com",
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2H21l-6.53 7.46L22 22h-6.933l-4.53-5.993L4.3 22H2l7.06-8.06L2 2h6.933l4.2 5.56L18.244 2zm-1.21 18h2.009L7.03 4H5.02l12.014 16z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M21.944 3.2a1.5 1.5 0 0 0-1.6-.2L2.7 10.3c-.9.4-.86 1.7.06 2l4.23 1.38 1.67 5.37c.27.87 1.38 1.08 1.94.36l2.49-3.12 4.32 3.3c.78.6 1.93.15 2.13-.84l3.3-15.6c.13-.62-.17-1.25-.79-1.35zM8.6 13.2l9.9-6.1-7.78 7.3c-.1.1-.17.23-.2.37l-.4 2.4-1.52-4.07z" />
    </svg>
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
