"use client";

import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import ExtensionWallet from '../../../lib/extension-wallet.polkadot-ui';
import Wallet from '../../../lib/wallet.polkadot-ui';

const WALLETS: Wallet[] = [
  new ExtensionWallet({
    name: 'SubWallet',
    id: 'subwallet-js',
    logo: '/subwallet-logo.svg',
    installUrl: '',
  }),
  new ExtensionWallet({
    name: 'Polkadot{.js}',
    id: 'polkadot-js',
    logo: '/polkadot-js-logo.svg',
    installUrl: '',
  }),
  new ExtensionWallet({
    name: 'Talisman',
    id: 'talisman',
    logo: '/talisman-logo.svg',
    installUrl: '',
  }),
];

export default function useWallets(): Wallet[] {
  const [wallets, setWallets] = useState<Wallet[]>(WALLETS);

  useEffectOnce(() => {
    for (let wallet of wallets) {
      wallet
        .initialize()
        .then(() => {
          setWallets([...wallets]);
        })
        .catch(() => {
          console.error('Error while initializing wallet: ', wallet.name);
        });
    }
  });

  return wallets;
}