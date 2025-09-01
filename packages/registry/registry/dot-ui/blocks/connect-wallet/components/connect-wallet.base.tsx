// "use client";

// import { Wallet, ExtensionWallet } from "typink";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { ChevronDown } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   AccountSelectionBase,
//   AccountSelectionServices,
// } from "@/registry/dot-ui/blocks/account-selection/components/account-selection.base";
// import { truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";
// import {
//   AccountManagementHookProps,
//   WalletManagementHookProps,
// } from "@/registry/dot-ui/lib/types.dedot";

// // Services interface for dependency injection
// export interface ConnectWalletServices {
//   useWalletManagement: () => WalletManagementHookProps;
//   useAccountManagement: () => AccountManagementHookProps;
// }

// interface WalletButtonProps {
//   walletInfo: Wallet;
//   afterSelectWallet?: () => void;
//   services: ConnectWalletServices;
// }

// function WalletButton({
//   walletInfo,
//   afterSelectWallet,
//   services,
// }: WalletButtonProps) {
//   const { name, id, logo, ready, installed } = walletInfo;
//   const { connectWallet } = services.useWalletManagement();

//   const doConnectWallet = () => {
//     if (!installed) {
//       if (walletInfo instanceof ExtensionWallet) {
//         const newWindow = window.open(
//           walletInfo.installUrl,
//           "_blank",
//           "noopener,noreferrer"
//         );
//         if (newWindow) newWindow.opener = null;
//       }
//       return;
//     }
//     connectWallet(id);
//     afterSelectWallet?.();
//   };

//   const isLoading = installed && !ready;

//   if (isLoading) {
//     return (
//       <Button disabled aria-busy="true" variant="outline">
//         Loading{typeof name === "string" ? ` ${name}` : ""}...
//       </Button>
//     );
//   }

//   return (
//     <Button onClick={doConnectWallet} className="group">
//       <div className="flex items-center gap-2">
//         <Image src={logo} alt={name} width={24} height={24} />
//         <span>{installed ? name : `Install ${name}`}</span>
//       </div>
//       <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
//     </Button>
//   );
// }

// export interface ConnectWalletBaseProps {
//   buttonLabel?: string;
//   // Injected services - this makes it reusable
//   services: AccountSelectionServices;
// }

// function WalletOption({ services }: { services: AccountSelectionServices }) {
//   const { wallets } = services.useWalletManagement();
//   return (
//     <>
//       <DialogHeader>
//         <DialogTitle>Connect Wallet</DialogTitle>
//         <DialogDescription>Select a wallet to connect to</DialogDescription>
//       </DialogHeader>
//       {wallets.map((wallet) => (
//         <DialogClose asChild key={wallet.id}>
//           <WalletButton walletInfo={wallet} services={services} />
//         </DialogClose>
//       ))}
//     </>
//   );
// }

// export function ConnectWalletBase({
//   buttonLabel = "Connect Wallet",
//   services,
// }: ConnectWalletBaseProps) {
//   const { activeSigner } = services.useWalletManagement();
//   const { activeAccount } = services.useAccountManagement();

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <div className="flex items-center gap-2">
//             <span>
//               {activeAccount?.name ? `(${activeAccount.name})` : null}
//             </span>
//             <span>
//               {activeAccount
//                 ? truncateAddress(activeAccount.address)
//                 : buttonLabel}
//             </span>
//           </div>
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         {activeSigner ? (
//           <AccountSelectionBase services={services} />
//         ) : (
//           <WalletOption services={services} />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
