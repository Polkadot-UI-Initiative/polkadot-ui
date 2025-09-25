import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ConnectWalletBase } from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.base";

function createServices(
  overrides?: Partial<Parameters<typeof ConnectWalletBase>[0]["services"]>
) {
  const services = {
    wallets: [
      { id: "walletA", name: "Wallet A", installed: true },
      {
        id: "walletB",
        name: "Wallet B",
        installed: false,
        installUrl: "https://example.com",
      },
    ],
    connectedWallets: [],
    accounts: [
      { address: "addr1", name: "Alice", source: "walletA" },
      { address: "addr2", name: "Bob", source: "walletA" },
    ],
    connectedAccount: undefined,
    connectWallet: jest.fn(async () => {}),
    disconnect: jest.fn(() => {}),
    setConnectedAccount: jest.fn(() => {}),
    ...(overrides || {}),
  } as Parameters<typeof ConnectWalletBase>[0]["services"];
  return services;
}

describe("ConnectWalletBase", () => {
  it("renders button and opens dialog", () => {
    const services = createServices();
    render(<ConnectWalletBase placeholder="Connect" services={services} />);

    const trigger = screen.getByRole("button", { name: /connect/i });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByText(/SelectWallet/i)).toBeInTheDocument();
  });

  it("opens install URL for non-installed wallet", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    const services = createServices();
    render(<ConnectWalletBase placeholder="Connect" services={services} />);

    fireEvent.click(screen.getByRole("button", { name: /connect/i }));
    const walletBButton = screen.getByRole("button", { name: /Wallet B/i });
    fireEvent.click(walletBButton);

    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
