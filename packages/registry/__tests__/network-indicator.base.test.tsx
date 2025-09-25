import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { NetworkIndicatorBase } from "@/registry/polkadot-ui/blocks/network-indicator/network-indicator.base";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";

const supportedNetworks = [
  { id: "paseo", name: "Paseo", symbol: "PAS", decimals: 12 },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", decimals: 10 },
];

describe("NetworkIndicatorBase", () => {
  it("shows block number when connected and showBlockNumber=true", () => {
    render(
      <NetworkIndicatorBase
        chainId="paseo"
        at="best"
        showBlockNumber
        services={{
          connectionStatus: ClientConnectionStatus.Connected,
          supportedNetworks,
          blockInfo: { best: { number: 123456, hash: "0xabc" } },
        }}
      />
    );

    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  it("hides block number when not connected", () => {
    render(
      <NetworkIndicatorBase
        chainId="paseo"
        at="best"
        showBlockNumber
        services={{
          connectionStatus: ClientConnectionStatus.Connecting,
          supportedNetworks,
          blockInfo: { best: { number: 123456, hash: "0xabc" } },
        }}
      />
    );

    expect(screen.queryByText("123456")).not.toBeInTheDocument();
  });
});
