import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AmountInputBase } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.base";

describe("AmountInputBase", () => {
  it("renders simple input enabled by default", () => {
    render(<AmountInputBase value={null} className="bg-background" />);
    const input = screen.getByRole("spinbutton");
    expect(input).toBeEnabled();
  });
});
