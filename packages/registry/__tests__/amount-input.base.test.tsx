import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AmountInputBase } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.base";

describe("AmountInputBase", () => {
  it("renders simple input when not connected (disabled)", () => {
    render(<AmountInputBase value="" />);
    const input = screen.getByRole("spinbutton");
    // Component does not render a visible label; label prop is forwarded as an attribute
    expect(input).toBeDisabled();
  });
});
