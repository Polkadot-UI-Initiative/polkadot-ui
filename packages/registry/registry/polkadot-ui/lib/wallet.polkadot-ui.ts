import { InjectedWindow } from '@coong/sdk/types';

export interface WalletOptions {
  id: string;
  name: string;
  logo: string;
}

abstract class Wallet<Options extends WalletOptions = WalletOptions> {
  #options: Options;

  constructor(options: Options) {
    this.#options = options;
  }

  get id() {
    return this.#options.id;
  }

  get name() {
    return this.#options.name;
  }

  get logo() {
    return this.#options.logo;
  }

  get options() {
    return this.#options;
  }

  get version() {
    return this.injectedProvider?.version;
  }

  get injectedWeb3() {
    const injectedWindow = window as Window & InjectedWindow;

    if (!injectedWindow.injectedWeb3) {
      injectedWindow.injectedWeb3 = {};
    }

    return injectedWindow.injectedWeb3;
  }

  get injectedProvider() {
    return this.injectedWeb3[this.id];
  }

  get ready() {
    return !!this.injectedProvider;
  }

  get installed() {
    return false;
  }

  async initialize() {
    // To implement in subclass
  }

  async waitUntilReady() {
    return new Promise<void>((resolve) => {
      if (this.ready) {
        resolve();
        return;
      }

      const interval = setInterval(() => {
        if (this.ready) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  }
}

export default Wallet;