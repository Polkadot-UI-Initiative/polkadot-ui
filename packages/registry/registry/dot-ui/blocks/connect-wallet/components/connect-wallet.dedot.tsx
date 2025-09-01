// "use client";

// import { useMemo } from "react";
// import {
//   ConnectWalletBase,
//   type ConnectWalletBaseProps,
// } from "@/registry/dot-ui/blocks/connect-wallet/components/connect-wallet.base";
// import {
//   useAccountManagement,
//   usePolkadotBalances,
//   useWalletManagement,
// } from "@/registry/dot-ui/blocks/connect-wallet/hooks/use-polkadot-hooks";
// import {
//   ConfiguredTypinkProvider,
//   useConfiguredTypink,
// } from "@/registry/dot-ui/providers/dedot-provider";

// // Props type - removes services prop since we inject it
// export type ConnectWalletProps = Omit<ConnectWalletBaseProps, "services">;

// export function ConnectWallet(props: ConnectWalletProps) {
//   const typinkContext = useConfiguredTypink();

//   // Simple services object with type-compatible wrappers
//   const services = useMemo(
//     () => ({
//       useWalletManagement,
//       useAccountManagement,
//       usePolkadotBalances,
//     }),
//     [typinkContext]
//   );

//   return <ConnectWalletBase {...props} services={services} />;
// }

// // Wrapped version with provider for drop-in usage
// export function ConnectWalletWithProvider(props: ConnectWalletProps) {
//   return (
//     <ConfiguredTypinkProvider>
//       <ConnectWallet {...props} />
//     </ConfiguredTypinkProvider>
//   );
// }

// ConnectWalletWithProvider.displayName = "ConnectWalletWithProvider";
