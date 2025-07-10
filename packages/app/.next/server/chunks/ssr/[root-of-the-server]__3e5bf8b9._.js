module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/node:crypto [external] (node:crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}}),
"[project]/packages/app/registry/polkadot-ui/lib/types.polkadot-ui.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "definePolkadotConfig": (()=>definePolkadotConfig)
});
function definePolkadotConfig(config) {
    return config;
}
}}),
"[project]/packages/app/registry/polkadot-ui/lib/config.polkadot-ui.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// To add more chains, run: npx papi add <chain-name> -n <chain-name>
// Then import the descriptor here and add it to the chains configuration
__turbopack_context__.s({
    "polkadotConfig": (()=>polkadotConfig)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$descriptors$40$file$2b$packages$2b$app$2b2e$papi$2b$descriptors_polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2_$2f$node_modules$2f40$polkadot$2d$api$2f$descriptors$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+descriptors@file+packages+app+.papi+descriptors_polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2_/node_modules/@polkadot-api/descriptors/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$types$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/app/registry/polkadot-ui/lib/types.polkadot-ui.ts [app-ssr] (ecmascript)");
;
;
const polkadotConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$types$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["definePolkadotConfig"])({
    chains: {
        paseo_asset_hub: {
            descriptor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$descriptors$40$file$2b$packages$2b$app$2b2e$papi$2b$descriptors_polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2_$2f$node_modules$2f40$polkadot$2d$api$2f$descriptors$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["paseo_asset_hub"],
            endpoint: "wss://sys.ibp.network/asset-hub-paseo",
            displayName: "Paseo Asset Hub"
        },
        paseo: {
            descriptor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$descriptors$40$file$2b$packages$2b$app$2b2e$papi$2b$descriptors_polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2_$2f$node_modules$2f40$polkadot$2d$api$2f$descriptors$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["paseo"],
            endpoint: "wss://sys.ibp.network/paseo",
            displayName: "Paseo Relay Chain"
        }
    },
    defaultChain: "paseo_asset_hub"
});
}}),
"[project]/packages/app/registry/polkadot-ui/lib/utils.polkadot-ui.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getChainConfig": (()=>getChainConfig),
    "getChainIds": (()=>getChainIds),
    "isValidChainId": (()=>isValidChainId)
});
function getChainIds(chains) {
    return Object.keys(chains);
}
function getChainConfig(chains, chainId) {
    return chains[chainId];
}
function isValidChainId(chains, chainId) {
    return chainId in chains;
}
}}),
"[project]/packages/app/registry/polkadot-ui/providers/polkadot-provider.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "PolkadotProvider": (()=>PolkadotProvider),
    "usePolkadot": (()=>usePolkadot),
    "useTypedPolkadotApi": (()=>useTypedPolkadotApi)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.1_@babel+core@7.28.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$client$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/client.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$ws$2d$provider$40$0$2e$4$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$ws$2d$provider$2f$dist$2f$web$2f$esm$2f$web$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+ws-provider@0.4.0/node_modules/@polkadot-api/ws-provider/dist/web/esm/web.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$polkadot$2d$sdk$2d$compat$40$2$2e$3$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$polkadot$2d$sdk$2d$compat$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+polkadot-sdk-compat@2.3.2/node_modules/@polkadot-api/polkadot-sdk-compat/dist/esm/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.1_@babel+core@7.28.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/app/registry/polkadot-ui/lib/config.polkadot-ui.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$utils$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/app/registry/polkadot-ui/lib/utils.polkadot-ui.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const PolkadotContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function PolkadotProvider({ children }) {
    const [currentChain, setCurrentChain] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["polkadotConfig"].defaultChain);
    const [apis, setApis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [clients, setClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const [loadingStates, setLoadingStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Map());
    const [errorStates, setErrorStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Map());
    // Initialize the default chain on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        initializeChain(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["polkadotConfig"].defaultChain);
    }, []);
    const initializeChain = async (chainId)=>{
        // Don't initialize if already connected
        if (apis[chainId]) return;
        setLoadingStates((prev)=>new Map(prev).set(chainId, true));
        setErrorStates((prev)=>new Map(prev).set(chainId, null));
        try {
            const chainConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$utils$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getChainConfig"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["polkadotConfig"].chains, chainId);
            console.log(`Connecting to ${chainConfig.displayName} at ${chainConfig.endpoint}`);
            // Create client with the selected chain
            const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$client$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$polkadot$2d$sdk$2d$compat$40$2$2e$3$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$polkadot$2d$sdk$2d$compat$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withPolkadotSdkCompat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$ws$2d$provider$40$0$2e$4$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$ws$2d$provider$2f$dist$2f$web$2f$esm$2f$web$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getWsProvider"])(chainConfig.endpoint)));
            // Get typed API for the selected chain
            const typedApi = client.getTypedApi(chainConfig.descriptor);
            setClients((prev)=>new Map(prev).set(chainId, client));
            setApis((prev)=>({
                    ...prev,
                    [chainId]: typedApi
                }));
            console.log(`Successfully connected to ${chainConfig.displayName}`);
        } catch (err) {
            console.error(`Failed to initialize ${chainId}:`, err);
            setErrorStates((prev)=>new Map(prev).set(chainId, err instanceof Error ? err.message : "Failed to initialize Polkadot API"));
        } finally{
            setLoadingStates((prev)=>new Map(prev).set(chainId, false));
        }
    };
    const setApi = (chainId)=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$utils$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidChainId"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["polkadotConfig"].chains, chainId)) {
            console.error(`Invalid chain ID: ${chainId}`);
            return;
        }
        setCurrentChain(chainId);
        // Initialize the chain if not already connected
        if (!apis[chainId]) {
            initializeChain(chainId);
        }
    };
    const disconnect = ()=>{
        clients.forEach((client)=>client.destroy());
        setClients(new Map());
        setApis({});
        setLoadingStates(new Map());
        setErrorStates(new Map());
        setCurrentChain(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["polkadotConfig"].defaultChain);
    };
    const isConnected = (chainId)=>{
        return !!apis[chainId];
    };
    const isLoading = (chainId)=>{
        return loadingStates.get(chainId) || false;
    };
    const currentChainConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$utils$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getChainConfig"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["polkadotConfig"].chains, currentChain);
    const value = {
        currentChain,
        api: apis[currentChain] || null,
        error: errorStates.get(currentChain) || null,
        apis,
        setApi,
        disconnect,
        isConnected,
        isLoading,
        chainName: currentChainConfig.displayName,
        availableChains: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$utils$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getChainIds"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$registry$2f$polkadot$2d$ui$2f$lib$2f$config$2e$polkadot$2d$ui$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["polkadotConfig"].chains)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PolkadotContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/app/registry/polkadot-ui/providers/polkadot-provider.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
function usePolkadot() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$1_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(PolkadotContext);
    if (context === undefined) {
        throw new Error("usePolkadot must be used within a PolkadotProvider");
    }
    return context;
}
function useTypedPolkadotApi() {
    const { api } = usePolkadot();
    return api;
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__3e5bf8b9._.js.map