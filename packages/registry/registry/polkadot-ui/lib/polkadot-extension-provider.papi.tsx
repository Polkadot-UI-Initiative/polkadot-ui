import {
  InjectedExtension,
  InjectedPolkadotAccount,
  connectInjectedExtension,
} from "polkadot-api/pjs-signer";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

interface ExtensionAccount {
  extension: InjectedExtension;
  accounts: InjectedPolkadotAccount[];
}

interface StoredAccount {
  extensionName: string;
  address: string;
}

interface ExtensionContext {
  isInitializing: boolean;
  selectedAccount:
    | (InjectedPolkadotAccount & { extension: InjectedExtension })
    | null;
  setSelectedAccount: (
    extension: InjectedExtension,
    account: InjectedPolkadotAccount
  ) => void;
  onToggleExtension: (name: string) => Promise<void>;
  availableExtensions: string[];
  selectedExtensions: InjectedExtension[];
}

const EXTENSIONS_STORAGE_KEY = "polkadot:connected-extensions";
const SELECTED_ACCOUNT_KEY = "polkadot:selected-extension-account";

const getExtensionsStore = () => {
  let connectedExtensions = new Map<string, ExtensionAccount>();
  const listeners = new Set<() => void>();
  let isRunning = false;

  const serverSnapshot = new Map<string, ExtensionAccount>();

  const getSnapshot = () => connectedExtensions;
  const update = () => {
    connectedExtensions = new Map(connectedExtensions);
    localStorage.setItem(
      EXTENSIONS_STORAGE_KEY,
      JSON.stringify([...connectedExtensions.keys()])
    );
    listeners.forEach((cb) => cb());
  };
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  };

  const onToggleExtension = async (name: string) => {
    if (isRunning) return;
    isRunning = true;
    try {
      if (connectedExtensions.has(name)) {
        connectedExtensions.delete(name);
      } else {
        const extension = await connectInjectedExtension(name);
        const accounts = await extension.getAccounts();
        connectedExtensions.set(name, { extension, accounts });
      }
      update();
    } finally {
      isRunning = false;
    }
  };

  const connectSavedExtensions = async () => {
    if (typeof window === "undefined") return;

    const savedExtensions = localStorage.getItem(EXTENSIONS_STORAGE_KEY);
    if (!savedExtensions) return;

    const extensionNames = JSON.parse(savedExtensions) as string[];
    await Promise.all(
      extensionNames.map(async (name) => {
        if (!connectedExtensions.has(name)) {
          try {
            const extension = await connectInjectedExtension(name);
            const accounts = await extension.getAccounts();
            connectedExtensions.set(name, { extension, accounts });
          } catch (error) {
            console.warn(`Failed to reconnect extension ${name}:`, error);
          }
        }
      })
    );
    update();
  };

  return {
    subscribe,
    getSnapshot,
    getServerSnapshot: () => serverSnapshot,
    onToggleExtension,
    connectSavedExtensions,
  };
};

const extensionsStore = getExtensionsStore();

const getJoinedInjectedExtensions = async () => {
  const { getInjectedExtensions } = await import("polkadot-api/pjs-signer");
  return getInjectedExtensions().join(",");
};

export const ExtensionContext = createContext<ExtensionContext>({
  isInitializing: true,
  selectedAccount: null,
  setSelectedAccount: () => {},
  onToggleExtension: () => Promise.resolve(),
  availableExtensions: [],
  selectedExtensions: [],
});

export function ExtensionProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [availableExtensions, setAvailableExtensions] = useState<string[]>([]);
  const [selectedAccount, _setSelectedAccount] = useState<
    (InjectedPolkadotAccount & { extension: InjectedExtension }) | null
  >(null);

  const setSelectedAccount = (
    extension: InjectedExtension,
    account: InjectedPolkadotAccount
  ) => {
    _setSelectedAccount({ ...account, extension });
    // Store selected account info
    const storedAccount: StoredAccount = {
      extensionName: extension.name,
      address: account.address,
    };
    localStorage.setItem(SELECTED_ACCOUNT_KEY, JSON.stringify(storedAccount));
  };

  const selectedExtensions = useSyncExternalStore(
    extensionsStore.subscribe,
    extensionsStore.getSnapshot,
    extensionsStore.getServerSnapshot
  );

  const restoreSelectedAccount = useCallback(async () => {
    const storedAccountJson = localStorage.getItem(SELECTED_ACCOUNT_KEY);
    if (!storedAccountJson) return;

    try {
      const storedAccount = JSON.parse(storedAccountJson) as StoredAccount;
      const extensionData = [...selectedExtensions.values()].find(
        (ext) => ext.extension.name === storedAccount.extensionName
      );

      if (!extensionData) return;

      const account = extensionData.accounts.find(
        (acc) => acc.address === storedAccount.address
      );

      if (account) {
        _setSelectedAccount({ ...account, extension: extensionData.extension });
      }
    } catch (error) {
      console.warn("Failed to restore selected account:", error);
      localStorage.removeItem(SELECTED_ACCOUNT_KEY);
    }
  }, [selectedExtensions, _setSelectedAccount]);

  useEffect(() => {
    const initializeExtensions = async () => {
      const joinedExtensions = await getJoinedInjectedExtensions();
      setAvailableExtensions(joinedExtensions.split(","));
      await extensionsStore.connectSavedExtensions();
      setIsInitializing(false);
    };
    initializeExtensions();
  }, []);

  // Restore selected account after extensions are connected
  useEffect(() => {
    if (selectedExtensions.size > 0) {
      restoreSelectedAccount();
    }
  }, [selectedExtensions, restoreSelectedAccount]);

  return (
    <ExtensionContext.Provider
      value={{
        isInitializing,
        selectedAccount,
        setSelectedAccount,
        onToggleExtension: extensionsStore.onToggleExtension,
        availableExtensions,
        selectedExtensions: [...selectedExtensions.values()].map(
          (ext) => ext.extension
        ),
      }}
    >
      {children}
    </ExtensionContext.Provider>
  );
}

export const usePolkadotExtension = () => {
  const context = useContext(ExtensionContext);
  if (!context)
    throw new Error(
      "useSelectedExtensions must be used within a ExtensionProvider"
    );
  return context;
};
