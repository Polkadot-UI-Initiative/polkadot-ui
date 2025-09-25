import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RequireAccountBase } from "@/registry/polkadot-ui/blocks/require-account/require-account.base";

describe("RequireAccountBase", () => {
  it("renders children when account exists", () => {
    render(
      <RequireAccountBase
        chainId="paseo"
        services={{ isLoading: false, hasAccount: true }}
        fallback={<div>no-account</div>}
      >
        <div>with-account</div>
      </RequireAccountBase>
    );
    expect(screen.getByText("with-account")).toBeInTheDocument();
  });

  it("renders fallback when no account", () => {
    render(
      <RequireAccountBase
        chainId="paseo"
        services={{ isLoading: false, hasAccount: false }}
        fallback={<div>no-account</div>}
      >
        <div>with-account</div>
      </RequireAccountBase>
    );
    expect(screen.getByText("no-account")).toBeInTheDocument();
  });

  it("renders loadingFallback when loading", () => {
    render(
      <RequireAccountBase
        chainId="paseo"
        services={{ isLoading: true, hasAccount: false }}
        fallback={<div>no-account</div>}
        loadingFallback={<div>loading</div>}
      >
        <div>with-account</div>
      </RequireAccountBase>
    );
    expect(screen.getByText("loading")).toBeInTheDocument();
  });
});
