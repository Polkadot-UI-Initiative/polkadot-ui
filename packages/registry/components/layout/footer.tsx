import { PolkadotLogo } from "@/components/polkadot-logo";

export function Footer() {
  return (
    <footer className="flex justify-center items-center mt-12 mb-4 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div>
          <span className="mr-1 text-sm font-light">Funded by</span>
          <span className="font-unbounded">UX Bounty</span>
        </div>
        <PolkadotLogo withPoweredBy />
      </div>
    </footer>
  );
}
