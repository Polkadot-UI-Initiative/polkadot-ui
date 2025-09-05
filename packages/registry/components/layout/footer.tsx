import { PolkadotLogo } from "@/components/polkadot-logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex justify-center items-center mt-12 mb-4 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div>
          <span className="mr-1 text-sm font-light">Funded by</span>
          <Link href="https://uxbounty.xyz" className="font-unbounded">
            UX Bounty
          </Link>
        </div>
        <Link href="https://polkadot.com" className="font-unbounded">
          <PolkadotLogo withPoweredBy />
        </Link>
      </div>
    </footer>
  );
}
