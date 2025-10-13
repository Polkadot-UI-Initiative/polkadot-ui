import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { AccountInfoBase } from "@/registry/polkadot-ui/blocks/account-info/account-info.base";

describe("AccountInfoBase", () => {
  it("renders skeletons when loading", () => {
    render(
      <AccountInfoBase
        services={{ isLoading: true, identity: null, error: null }}
        address={"14xmwinm..."}
      />
    );
    const matches = screen.getAllByText(/14xm/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
