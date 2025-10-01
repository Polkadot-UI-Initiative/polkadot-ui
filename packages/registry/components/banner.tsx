import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BannerProps {
  title: string;
  buttonText: string;
  buttonUrl: string;
  defaultVisible?: boolean;
}

export const Banner = ({ buttonText, buttonUrl }: BannerProps) => {
  return (
    <section className="bg-polkadot-pink/80 w-full p-4">
      <div className="container">
        <div className="relative flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-center">
          <div className="text-primary-foreground flex flex-col items-center gap-3 pt-2 md:flex-row md:items-center md:pt-0">
            <div className="flex flex-col gap-1 md:flex-row md:items-center">
              <p className="text-white text-sm">
                Polkadot UI is in beta version. Please{" "}
                <Link
                  href={buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  report any issues
                </Link>{" "}
                or feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={buttonUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="link" asChild>
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
