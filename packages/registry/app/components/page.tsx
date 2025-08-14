import AddressInputPage from "@/registry/dot-ui/blocks/address-input/demo/page.dedot";
import RequireConnectionPage from "@/registry/dot-ui/blocks/require-connection/demo/page.papi";
import ConnectWalletPage from "@/registry/dot-ui/blocks/connect-wallet/demo/page.dedot";

export default function Docs() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <AddressInputPage />
      <RequireConnectionPage />
      <ConnectWalletPage />
    </div>
  );
}
