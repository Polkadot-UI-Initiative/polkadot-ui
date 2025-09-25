import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { BalanceDisplayBase } from "@/registry/polkadot-ui/blocks/balance-display/balance-display.base";

const token = {
  id: "polkadot:native",
  symbol: "DOT",
  decimals: 10,
  name: "Polkadot",
  assetId: "substrate-native",
};
const usdc = {
  id: "polkadot:usdc",
  symbol: "USDC",
  decimals: 6,
  name: "USD Coin",
  assetId: "123",
};

describe("BalanceDisplayBase", () => {
  it("renders formatted balance and token symbol", () => {
    render(
      <BalanceDisplayBase
        balance={123_000_000_000n}
        token={token}
        precision={2}
      />
    );

    // 123_000_000_000 with 10 decimals -> 12.3 => 12.30 with precision 2
    expect(screen.getByText(/12\.30/)).toBeInTheDocument();
    expect(screen.getByText(/DOT/)).toBeInTheDocument();
  });

  it("shows skeletons when loading (undefined)", () => {
    render(<BalanceDisplayBase balance={undefined} token={undefined} />);
    // Skeletons render but without text; ensure no crash by asserting container exists
    // Using role or text is not reliable; we just ensure the component rendered
    expect(
      document.querySelector("div.inline-flex.flex-col.items-end")
    ).toBeTruthy();
  });

  it("renders compare row when compare props provided", () => {
    render(
      <BalanceDisplayBase
        balance={1_000_000_000n} // 10 decimals -> 0.1 DOT
        token={token}
        compareToken={usdc}
        tokenConversionRate={5} // 1 DOT = $5
        precision={2}
      />
    );

    // Primary shows 0.10 DOT
    expect(screen.getByText(/0\.10/)).toBeInTheDocument();
    expect(screen.getByText(/DOT/)).toBeInTheDocument();

    // Compare should show calculated value in USDC (0.10 * 5 = 0.50 USDC)
    expect(screen.getByText(/0\.50/)).toBeInTheDocument();
    expect(screen.getByText(/USDC/)).toBeInTheDocument();
  });
});
