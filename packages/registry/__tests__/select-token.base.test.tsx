import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SelectTokenBase } from "../registry/polkadot-ui/blocks/select-token/select-token.base";

const mockServices = (
  overrides?: Partial<Parameters<typeof SelectTokenBase>[0]["services"]>
) => {
  const services = {
    isConnected: true,
    isLoading: false,
    isDisabled: false,
    connectedAccount: { address: "addr" },
    chainTokens: [
      {
        id: "native",
        symbol: "DOT",
        decimals: 10,
        name: "Polkadot",
        assetId: "substrate-native",
      },
      { id: "1", symbol: "AAA", decimals: 12, name: "Alpha", assetId: "1" },
      { id: "2", symbol: "BBB", decimals: 12, name: "Beta", assetId: "2" },
    ],
    balances: { 1: 1000000000000n, 2: 0n },
    ...(overrides || {}),
  } as Parameters<typeof SelectTokenBase>[0]["services"];
  return services;
};

describe("SelectTokenBase", () => {
  it("opens and selects a token, calling onChange with numeric asset id", () => {
    const onChange = jest.fn();
    const services = mockServices();
    render(
      <SelectTokenBase
        chainId="paseo"
        assetIds={[1, 2]}
        withBalance={true}
        services={services}
        onChange={onChange}
      />
    );

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const listbox = screen.getByRole("listbox");
    const option = within(listbox).getByText(/AAA/);
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("filters by assetIds to only show allowed tokens", () => {
    const services = mockServices();
    render(
      <SelectTokenBase
        chainId="paseo"
        assetIds={[2]}
        withBalance={false}
        services={services}
      />
    );

    fireEvent.click(screen.getByRole("combobox"));

    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getByText("BBB")).toBeInTheDocument();
    expect(within(listbox).queryByText("AAA")).not.toBeInTheDocument();
  });
});
