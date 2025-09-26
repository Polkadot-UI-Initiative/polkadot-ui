import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AmountInputBase } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.base";

describe("AmountInputBase", () => {
  it("renders simple input when not connected (disabled)", () => {
    render(
      <AmountInputBase
        value=""
        label="Amount"
        services={{ isConnected: false, connectedAccount: null }}
      />
    );
    expect(screen.getByText("Amount")).toBeInTheDocument();
    const input = screen.getByRole("spinbutton");
    expect(input).toBeDisabled();
  });
});
