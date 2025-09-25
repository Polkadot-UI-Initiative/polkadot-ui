import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RequireConnectionBase } from "@/registry/polkadot-ui/blocks/require-connection/require-connection.base";

describe("RequireConnectionBase", () => {
  it("renders children when connected", () => {
    render(
      <RequireConnectionBase
        chainId="paseo"
        services={{ isLoading: false, isConnected: true }}
        fallback={<div>fallback</div>}
      >
        <div>content</div>
      </RequireConnectionBase>
    );

    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders fallback when not connected", () => {
    render(
      <RequireConnectionBase
        chainId="paseo"
        services={{ isLoading: false, isConnected: false }}
        fallback={<div>fallback</div>}
      >
        <div>content</div>
      </RequireConnectionBase>
    );

    expect(screen.getByText("fallback")).toBeInTheDocument();
  });

  it("renders loadingFallback when loading", () => {
    render(
      <RequireConnectionBase
        chainId="paseo"
        services={{ isLoading: true, isConnected: false }}
        fallback={<div>fallback</div>}
        loadingFallback={<div>loading</div>}
      >
        <div>content</div>
      </RequireConnectionBase>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
  });
});
