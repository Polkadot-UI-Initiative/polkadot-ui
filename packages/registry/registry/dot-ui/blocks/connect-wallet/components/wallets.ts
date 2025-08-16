export enum SubstrateWalletPlatform {
  Browser = "browser",
  Android = "Android OS",
  iOS = "iOS",
}

export interface SubstrateWallet {
  id: string;
  name: string;
  platforms: SubstrateWalletPlatform[];
  urls: {
    website: string;
    chromeExtension?: string;
    firefoxExtension?: string;
    androidApp?: string;
    iosApp?: string;
  };
  logoUrls: string[];
}

/**
 * Defined Substrate Wallet Constants
 */
export const polkadotjs: SubstrateWallet = {
  id: "polkadot-js",
  name: "Polkadot{.js}",
  platforms: [SubstrateWalletPlatform.Browser],
  urls: {
    website: "https://polkadot.js.org/extension/",
    chromeExtension:
      "https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd",
    firefoxExtension:
      "https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/",
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/polkadot@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/polkadot@512w.png",
  ],
};

export const talisman: SubstrateWallet = {
  id: "talisman",
  name: "Talisman",
  platforms: [SubstrateWalletPlatform.Browser],
  urls: {
    website: "https://www.talisman.xyz/",
    chromeExtension:
      "https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld",
    firefoxExtension:
      "https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/",
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/talisman@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/talisman@512w.png",
  ],
};

export const subwallet: SubstrateWallet = {
  id: "subwallet-js",
  name: "SubWallet",
  platforms: [
    SubstrateWalletPlatform.Android,
    SubstrateWalletPlatform.iOS,
    SubstrateWalletPlatform.Browser,
  ],
  urls: {
    website: "https://subwallet.app/",
    chromeExtension:
      "https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn",
    firefoxExtension:
      "https://addons.mozilla.org/en-US/firefox/addon/subwallet/",
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/subwallet@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/subwallet@512w.png",
  ],
};

export const nova: SubstrateWallet = {
  id: "nova",
  name: "Nova Wallet",
  platforms: [SubstrateWalletPlatform.Android, SubstrateWalletPlatform.iOS],
  urls: {
    website: "https://novawallet.io/",
    androidApp:
      "https://play.google.com/store/apps/details?id=io.novafoundation.nova.market",
    iosApp:
      "https://apps.apple.com/app/nova-polkadot-kusama-wallet/id1597119355",
  },
  logoUrls: [
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nova@128w.png",
    "https://github.com/scio-labs/use-inkathon/raw/main/assets/wallet-logos/nova@512w.png",
  ],
};

/**
 * Exporting all wallets separately
 */
export const allSubstrateWallets: SubstrateWallet[] = [
  talisman,
  nova,
  subwallet,
  polkadotjs,
];
