import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SelectTokenDialogBase } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.base";

const mockServices = (
  overrides?: Partial<Parameters<typeof SelectTokenDialogBase>[0]["services"]>
) => {
  const services = {
    isConnected: true,
    isLoading: false,
    isDisabled: false,
    chainTokens: [
      { id: "1", symbol: "AAA", decimals: 12, name: "Alpha", assetId: "1" },
      { id: "2", symbol: "BBB", decimals: 12, name: "Beta", assetId: "2" },
    ],
    connectedAccount: { address: "addr" },
    network: { id: "paseo", name: "Paseo", decimals: 12, symbol: "PAS" },
    balances: { 1: 1000000000000n, 2: 0n },
    ...(overrides || {}),
  } as Parameters<typeof SelectTokenDialogBase>[0]["services"];
  return services;
};

describe("SelectTokenDialogBase", () => {
  it("opens dialog and selects a token", () => {
    const onChange = jest.fn();
    const services = mockServices();
    render(<SelectTokenDialogBase services={services} onChange={onChange} />);

    const trigger = screen.getByRole("button", { name: /select token/i });
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: /Select Token/i })
    ).toBeInTheDocument();

    const item = within(dialog).getByText("AAA");
    fireEvent.click(item);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("filters tokens when searching", () => {
    const services = mockServices();
    render(<SelectTokenDialogBase services={services} withSearch />);

    fireEvent.click(screen.getByRole("button", { name: /select token/i }));
    const dialog = screen.getByRole("dialog");
    const search = within(dialog).getByPlaceholderText(/search for a token/i);
    fireEvent.change(search, { target: { value: "bet" } });

    expect(within(dialog).getByText("BBB")).toBeInTheDocument();
    expect(within(dialog).queryByText("AAA")).not.toBeInTheDocument();
  });
});
