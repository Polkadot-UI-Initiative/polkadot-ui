"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export function PolkadotLogo({
  withPoweredBy = false,
}: {
  withPoweredBy?: boolean;
}) {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "Powered by Polkadot";

  const logo =
    theme === "dark"
      ? "/Polkadot_Logo_Horizontal_Pink_White.svg"
      : "/Polkadot_Logo_Horizontal_Pink_Black.svg";

  return (
    <div className="flex items-center">
      {withPoweredBy && <span className="text-sm font-light">Powered by</span>}
      <Image src={logo} alt="Polkadot Logo" width={100} height={28} />
    </div>
  );
}
