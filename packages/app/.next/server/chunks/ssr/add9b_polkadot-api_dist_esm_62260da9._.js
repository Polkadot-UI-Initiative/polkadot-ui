module.exports = {

"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/compatibility.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CompatibilityToken": (()=>CompatibilityToken),
    "OpType": (()=>OpType),
    "RuntimeToken": (()=>RuntimeToken),
    "compatibilityHelper": (()=>compatibilityHelper),
    "createCompatibilityToken": (()=>createCompatibilityToken),
    "createRuntimeToken": (()=>createRuntimeToken),
    "getCompatibilityApi": (()=>getCompatibilityApi),
    "minCompatLevel": (()=>minCompatLevel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-compatibility@0.3.0/node_modules/@polkadot-api/metadata-compatibility/dist/esm/entryPoint.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$typedef$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-compatibility@0.3.0/node_modules/@polkadot-api/metadata-compatibility/dist/esm/typedef.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-compatibility@0.3.0/node_modules/@polkadot-api/metadata-compatibility/dist/esm/isStaticCompatible.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/shaped.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
;
;
class RuntimeToken {
    constructor(){}
    // @ts-ignore
    _runtime(value) {}
}
class CompatibilityToken {
    constructor(){}
    // @ts-ignore
    _compatibility(value) {}
}
const compatibilityTokenApi = /* @__PURE__ */ new WeakMap();
const runtimeTokenApi = /* @__PURE__ */ new WeakMap();
const getCompatibilityApi = (token)=>token instanceof RuntimeToken ? runtimeTokenApi.get(token) : compatibilityTokenApi.get(token);
var OpType = /* @__PURE__ */ ((OpType2)=>{
    OpType2["Storage"] = "storage";
    OpType2["Tx"] = "tx";
    OpType2["Event"] = "events";
    OpType2["Const"] = "constants";
    OpType2["ViewFns"] = "viewFns";
    OpType2["Api"] = "apis";
    return OpType2;
})(OpType || {});
const EntryPointsCodec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EntryPointCodec"]);
const TypedefsCodec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$typedef$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TypedefCodec"]);
const TypesCodec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tuple"])(EntryPointsCodec, TypedefsCodec);
const createCompatibilityToken = (chainDefinition, chainHead)=>{
    const awaitedRuntime = new Promise(async (resolve)=>{
        const loadedRuntime$ = chainHead.runtime$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])((v)=>v != null));
        let latest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(loadedRuntime$);
        loadedRuntime$.subscribe((v)=>latest = v);
        resolve(()=>latest);
    });
    const promise = Promise.all([
        chainDefinition.metadataTypes.then(TypesCodec.dec),
        chainDefinition.descriptors,
        awaitedRuntime
    ]).then(([[entryPoints, typedefNodes], descriptors, runtime])=>{
        const token = new CompatibilityToken();
        compatibilityTokenApi.set(token, {
            runtime,
            getEntryPoint (opType, pallet, name) {
                const idx = descriptors[opType]?.[pallet]?.[name];
                if (idx == null) throw new Error(`Descriptor for ${opType} ${pallet}.${name} does not exist`);
                return entryPoints[idx];
            },
            typedefNodes
        });
        return token;
    });
    return promise;
};
const createRuntimeToken = (chainHead)=>{
    const awaitedRuntime = new Promise(async (resolve)=>{
        const loadedRuntime$ = chainHead.runtime$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])((v)=>v != null));
        let latest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(loadedRuntime$);
        loadedRuntime$.subscribe((v)=>latest = v);
        resolve(()=>latest);
    });
    const promise = awaitedRuntime.then((runtime)=>{
        const token = new RuntimeToken();
        runtimeTokenApi.set(token, {
            runtime
        });
        return token;
    });
    return promise;
};
const metadataCache = /* @__PURE__ */ new WeakMap();
const getMetadataCache = (ctx)=>{
    if (!metadataCache.has(ctx.metadataRaw)) {
        metadataCache.set(ctx.metadataRaw, {
            compat: /* @__PURE__ */ new Map(),
            lookup: ctx.lookup,
            typeNodes: []
        });
    }
    return metadataCache.get(ctx.metadataRaw);
};
const compatibilityHelper = (descriptors, getDescriptorEntryPoint, getRuntimeEntryPoint)=>{
    const getRuntimeTypedef = (ctx, id)=>{
        var _a;
        const cache = getMetadataCache(ctx);
        return (_a = cache.typeNodes)[id] || (_a[id] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$typedef$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapLookupToTypedef"])(cache.lookup(id)));
    };
    function getCompatibilityLevels(descriptors2, ctx) {
        if (descriptors2 instanceof RuntimeToken) {
            return {
                args: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Identical,
                values: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Identical
            };
        }
        const compatibilityApi = compatibilityTokenApi.get(descriptors2);
        ctx || (ctx = compatibilityApi.runtime());
        const runtimeEntryPoint = getRuntimeEntryPoint(ctx);
        if (runtimeEntryPoint == null) return {
            args: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Incompatible,
            values: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Incompatible
        };
        const descriptorNodes = compatibilityApi.typedefNodes;
        const cache = getMetadataCache(ctx);
        const descriptorEntryPoint = getDescriptorEntryPoint(compatibilityApi);
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entryPointsAreCompatible"])(descriptorEntryPoint, (id)=>descriptorNodes[id], runtimeEntryPoint, (id)=>getRuntimeTypedef(ctx, id), cache.compat);
        return {
            args: result.args.level,
            values: result.values.level
        };
    }
    const getCompatibilityLevel = withOptionalToken(descriptors, (runtime)=>minCompatLevel(getCompatibilityLevels(runtime)));
    const isCompatible = withOptionalToken(descriptors, (threshold, runtime)=>getCompatibilityLevel(runtime) >= threshold);
    const compatibleRuntime$ = (chainHead, hash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineLatest"])([
            descriptors,
            chainHead.getRuntimeContext$(hash)
        ]);
    const withCompatibleRuntime = (chainHead, mapper)=>(source$)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineLatest"])([
                source$.pipe(chainHead.withRuntime(mapper)),
                descriptors
            ]).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([[x, ctx], descriptors2])=>[
                    x,
                    descriptors2,
                    ctx
                ]));
    const argsAreCompatible = (descriptors2, ctx, args)=>{
        if (descriptors2 instanceof RuntimeToken) return true;
        const levels = getCompatibilityLevels(descriptors2, ctx);
        if (levels.args === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Incompatible) return false;
        if (levels.args > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Partial) return true;
        if (levels.values === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Incompatible) return false;
        const entryPoint = getRuntimeEntryPoint(ctx);
        if (entryPoint == null) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["valueIsCompatibleWithDest"])(entryPoint.args, (id)=>getRuntimeTypedef(ctx, id), args);
    };
    const valuesAreCompatible = (descriptors2, ctx, values)=>{
        if (descriptors2 instanceof RuntimeToken) return true;
        const level = getCompatibilityLevels(descriptors2, ctx).values;
        if (level === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Incompatible) return false;
        if (level > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Partial) return true;
        const compatibilityApi = compatibilityTokenApi.get(descriptors2);
        const entryPoint = getDescriptorEntryPoint(compatibilityApi);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["valueIsCompatibleWithDest"])(entryPoint.values, (id)=>compatibilityApi.typedefNodes[id], values);
    };
    return {
        isCompatible,
        getCompatibilityLevel,
        getCompatibilityLevels,
        descriptors,
        withCompatibleRuntime,
        compatibleRuntime$,
        argsAreCompatible,
        valuesAreCompatible,
        getRuntimeTypedef
    };
};
const minCompatLevel = (levels)=>Math.min(levels.args, levels.values);
const withOptionalToken = (compatibilityToken, fn)=>(...args)=>{
        const lastElement = args.at(-1);
        if (lastElement instanceof CompatibilityToken || lastElement instanceof RuntimeToken) {
            return fn(...args);
        }
        return compatibilityToken.then((token)=>fn(...args, token));
    };
;
 //# sourceMappingURL=compatibility.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/constants.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createConstantEntry": (()=>createConstantEntry)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/compatibility.mjs [app-ssr] (ecmascript)");
;
const createConstantEntry = (palletName, name, { valuesAreCompatible, descriptors, isCompatible, getCompatibilityLevel })=>{
    const cachedResults = /* @__PURE__ */ new WeakMap();
    const getValueWithContext = (ctx)=>{
        if (cachedResults.has(ctx)) {
            return cachedResults.get(ctx);
        }
        const pallet = ctx.lookup.metadata.pallets.find((p)=>p.name === palletName);
        const constant = pallet?.constants.find((c)=>c.name === name);
        if (constant == null) throw new Error(`Runtime entry Constant(${palletName}.${name}) not found`);
        const result = ctx.dynamicBuilder.buildConstant(palletName, name).dec(constant.value);
        cachedResults.set(ctx, result);
        return result;
    };
    const fn = (token)=>{
        if (token) {
            const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompatibilityApi"])(token).runtime();
            const value = getValueWithContext(ctx);
            if (!valuesAreCompatible(token, ctx, value)) throw new Error(`Incompatible runtime entry Constant(${palletName}.${name})`);
            return value;
        }
        return descriptors.then(fn);
    };
    return Object.assign(fn, {
        isCompatible,
        getCompatibilityLevel
    });
};
;
 //# sourceMappingURL=constants.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/shareLatest.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "shareLatest": (()=>shareLatest)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const shareLatest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["share"])({
    connector: ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReplaySubject"](1),
    resetOnError: true,
    resetOnComplete: true,
    resetOnRefCountZero: true
});
;
 //# sourceMappingURL=shareLatest.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/event.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createEventEntry": (()=>createEventEntry)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$concatMapEager$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/concatMapEager.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/shareLatest.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
const createEventEntry = (pallet, name, chainHead, { isCompatible, getCompatibilityLevel, withCompatibleRuntime, argsAreCompatible, valuesAreCompatible })=>{
    const compatibilityError = ()=>new Error(`Incompatible runtime entry Event(${pallet}.${name})`);
    const shared$ = chainHead.finalized$.pipe(withCompatibleRuntime(chainHead, (x)=>x.hash), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([block, runtime, ctx])=>{
        const eventsIdx = ctx.lookup.metadata.pallets.find((p)=>p.name === pallet)?.events?.type;
        if (eventsIdx == null || ctx.lookup.metadata.lookup[eventsIdx].def.tag !== "variant" || ctx.lookup.metadata.lookup[eventsIdx].def.value.find((ev)=>ev.name === name) == null) throw new Error(`Runtime entry Event(${pallet}.${name}) not found`);
        if (!argsAreCompatible(runtime, ctx, null)) throw compatibilityError();
        return [
            block,
            runtime,
            ctx
        ];
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$concatMapEager$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["concatMapEager"])(([block, runtime, ctx])=>chainHead.eventsAt$(block.hash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((events)=>{
            const winners = events.filter((e)=>e.event.type === pallet && e.event.value.type === name);
            return winners.map((x)=>{
                if (!valuesAreCompatible(runtime, ctx, x.event.value.value)) throw compatibilityError();
                return {
                    meta: {
                        phase: x.phase,
                        block
                    },
                    payload: x.event.value.value
                };
            });
        }))), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareLatest"]);
    const watch = (f)=>shared$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((x)=>f ? x.filter((d)=>f(d.payload)) : x));
    const pull = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(shared$);
    const filter = (events)=>events.filter((e)=>e.type === pallet && e.value.type === name).map((x)=>x.value.value);
    return {
        watch,
        pull,
        filter,
        getCompatibilityLevel,
        isCompatible
    };
};
;
 //# sourceMappingURL=event.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/firstValueFromWithSignal.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "firstValueFromWithSignal": (()=>firstValueFromWithSignal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$AbortError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/AbortError.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
;
function firstValueFromWithSignal(source, signal) {
    return new Promise((resolve, reject)=>{
        let subscription = null;
        let isDone = false;
        const onAbort = signal ? ()=>{
            subscription?.unsubscribe();
            reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$AbortError$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AbortError"]());
        } : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
        subscription = source.subscribe({
            next: (value)=>{
                resolve(value);
                subscription?.unsubscribe();
                isDone = true;
            },
            error: (e)=>{
                signal?.removeEventListener("abort", onAbort);
                reject(e);
                isDone = true;
            },
            complete: ()=>{
                signal?.removeEventListener("abort", onAbort);
                reject(new Error("Observable completed without emitting"));
                isDone = true;
            }
        });
        if (!isDone) signal?.addEventListener("abort", onAbort);
    });
}
;
 //# sourceMappingURL=firstValueFromWithSignal.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/optional-arg.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "isOptionalArg": (()=>isOptionalArg)
});
const isOptionalArg = (lastArg)=>typeof lastArg === "object" && lastArg !== null && Object.entries(lastArg).every(([k, v])=>k === "at" && (v === void 0 || typeof v === "string") || k === "signal" && (v === void 0 || v instanceof AbortSignal));
;
 //# sourceMappingURL=optional-arg.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/runtime-call.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createRuntimeCallEntry": (()=>createRuntimeCallEntry)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$firstValueFromWithSignal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/firstValueFromWithSignal.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/optional-arg.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const createRuntimeCallEntry = (api, method, chainHead, { isCompatible, getCompatibilityLevel, compatibleRuntime$, argsAreCompatible, valuesAreCompatible })=>{
    const callName = `${api}_${method}`;
    const compatibilityError = ()=>new Error(`Incompatible runtime entry RuntimeCall(${callName})`);
    const fn = (...args)=>{
        const lastArg = args[args.length - 1];
        const isLastArgOptional = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOptionalArg"])(lastArg);
        const { signal, at: _at } = isLastArgOptional ? lastArg : {};
        const at = _at ?? null;
        const result$ = compatibleRuntime$(chainHead, at).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(([runtime, ctx])=>{
            let codecs;
            try {
                codecs = ctx.dynamicBuilder.buildRuntimeCall(api, method);
            } catch  {
                throw new Error(`Runtime entry RuntimeCall(${callName}) not found`);
            }
            if (!argsAreCompatible(runtime, ctx, args)) throw compatibilityError();
            return chainHead.call$(at, callName, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])(codecs.args.enc(args))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(codecs.value.dec), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((value)=>{
                if (!valuesAreCompatible(runtime, ctx, value)) throw compatibilityError();
                return value;
            }));
        }));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$firstValueFromWithSignal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFromWithSignal"])(result$, signal);
    };
    return Object.assign(fn, {
        getCompatibilityLevel,
        isCompatible
    });
};
;
 //# sourceMappingURL=runtime-call.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/lossLessExhaustMap.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "lossLessExhaustMap": (()=>lossLessExhaustMap)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const EMPTY_VALUE = Symbol("EMPTY_VALUE");
const lossLessExhaustMap = (mapper)=>(source$)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            let idx = 0;
            let innerSubscription = null;
            let queuedValue = EMPTY_VALUE;
            let isOutterDone = false;
            const setInnerSubscription = ()=>{
                const observable = mapper(queuedValue, idx++);
                queuedValue = EMPTY_VALUE;
                innerSubscription = observable.subscribe({
                    next (vv) {
                        observer.next(vv);
                    },
                    error (ee) {
                        observer.error(ee);
                    },
                    complete () {
                        if (queuedValue !== EMPTY_VALUE) setInnerSubscription();
                        else {
                            innerSubscription = null;
                            if (isOutterDone) observer.complete();
                        }
                    }
                });
            };
            const subscription = source$.subscribe({
                next (v) {
                    queuedValue = v;
                    if (!innerSubscription) setInnerSubscription();
                },
                error (e) {
                    observer.error(e);
                },
                complete () {
                    if (!innerSubscription) observer.complete();
                    isOutterDone = true;
                }
            });
            return ()=>{
                innerSubscription?.unsubscribe();
                subscription.unsubscribe();
            };
        });
;
 //# sourceMappingURL=lossLessExhaustMap.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/storage.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createStorageEntry": (()=>createStorageEntry)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$firstValueFromWithSignal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/firstValueFromWithSignal.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$lossLessExhaustMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/lossLessExhaustMap.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/optional-arg.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-compatibility@0.3.0/node_modules/@polkadot-api/metadata-compatibility/dist/esm/isStaticCompatible.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Binary$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/Binary.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/compatibility.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const toMapped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>x.mapped);
const createStorageEntry = (pallet, name, chainHead, getWatchEntries, { isCompatible, getCompatibilityLevel, getCompatibilityLevels, descriptors: descriptorsPromise, argsAreCompatible, valuesAreCompatible })=>{
    const isSystemNumber = pallet === "System" && name === "Number";
    const isBlockHash = pallet === "System" && name === "BlockHash";
    const sysNumberMapper$ = chainHead.runtime$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])(Boolean), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(({ dynamicBuilder })=>typeof dynamicBuilder.buildStorage("System", "Number").value.dec(new Uint8Array(32)) === "bigint" ? BigInt : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["identity"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareReplay"])());
    const bigIntOrNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pipe"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineLatestWith"])(sysNumberMapper$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([input, mapper])=>mapper(input)));
    const incompatibleError = ()=>new Error(`Incompatible runtime entry Storage(${pallet}.${name})`);
    const invalidArgs = (args)=>new Error(`Invalid Arguments calling ${pallet}.${name}(${args})`);
    const getCodec = (ctx)=>{
        try {
            return ctx.dynamicBuilder.buildStorage(pallet, name);
        } catch (e) {
            throw new Error(`Runtime entry Storage(${pallet}.${name}) not found`);
        }
    };
    const watchValue = (...args)=>{
        const target = args[args.length - 1];
        const isBest = target === "best";
        const actualArgs = isBest || target === "finalized" ? args.slice(0, -1) : args;
        return chainHead[isBest ? "best$" : "finalized$"].pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$lossLessExhaustMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lossLessExhaustMap"])(()=>getRawValue$(...actualArgs, isBest ? {
                at: "best"
            } : {})), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.raw === b.raw), toMapped);
    };
    const getRawValue$ = (...args)=>{
        const lastArg = args[args.length - 1];
        const isLastArgOptional = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOptionalArg"])(lastArg);
        const { at: _at } = isLastArgOptional ? lastArg : {};
        const at = _at ?? null;
        const result$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["from"])(descriptorsPromise).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((descriptors)=>chainHead.storage$(at, "value", (ctx)=>{
                const codecs = getCodec(ctx);
                const actualArgs = args.length === codecs.len ? args : args.slice(0, -1);
                if (args !== actualArgs && !isLastArgOptional) throw invalidArgs(args);
                if (!argsAreCompatible(descriptors, ctx, actualArgs)) throw incompatibleError();
                return codecs.keys.enc(...actualArgs);
            }, null, (data, ctx)=>{
                const codecs = getCodec(ctx);
                const mapped = data === null ? codecs.fallback : codecs.value.dec(data);
                if (!valuesAreCompatible(descriptors, ctx, mapped)) throw incompatibleError();
                return {
                    raw: data,
                    mapped
                };
            })));
        if (isSystemNumber) return chainHead.pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((blocks)=>{
            const hash = at === "finalized" || !at ? blocks.finalized : at === "best" ? blocks.best : at;
            const block = blocks.blocks.get(hash);
            if (!block) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"](hash, "System.Number");
            }
            return block.number;
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])(), bigIntOrNumber, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((mapped)=>({
                raw: mapped.toString(),
                mapped
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((e)=>{
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"]) return result$;
            throw e;
        }));
        return isBlockHash && Number(args[0]) === 0 ? chainHead.genesis$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((raw)=>({
                raw,
                mapped: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Binary$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FixedSizeBinary"].fromHex(raw)
            }))) : result$;
    };
    const getValue = async (...args)=>{
        const lastArg = args[args.length - 1];
        const isLastArgOptional = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOptionalArg"])(lastArg);
        const { signal } = isLastArgOptional ? lastArg : {};
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$firstValueFromWithSignal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFromWithSignal"])(getRawValue$(...args).pipe(toMapped), signal);
    };
    const getEntries = async (...args)=>{
        const lastArg = args[args.length - 1];
        const isLastArgOptional = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOptionalArg"])(lastArg);
        const { signal, at: _at } = isLastArgOptional ? lastArg : {};
        const at = _at ?? null;
        const descriptors = await descriptorsPromise;
        const result$ = chainHead.storage$(at, "descendantsValues", (ctx)=>{
            const codecs = getCodec(ctx);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["minCompatLevel"])(getCompatibilityLevels(descriptors, ctx)) === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isStaticCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityLevel"].Incompatible) throw incompatibleError();
            if (args.length > codecs.len) throw invalidArgs(args);
            const actualArgs = args.length > 0 && isLastArgOptional ? args.slice(0, -1) : args;
            if (args.length === codecs.len && actualArgs === args) throw invalidArgs(args);
            return codecs.keys.enc(...actualArgs);
        }, null, (values, ctx)=>{
            const codecs = getCodec(ctx);
            const decodedValues = values.map(({ key, value })=>({
                    keyArgs: codecs.keys.dec(key),
                    value: codecs.value.dec(value)
                }));
            if (decodedValues.some(({ value })=>!valuesAreCompatible(descriptors, ctx, value))) throw incompatibleError();
            return decodedValues;
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$firstValueFromWithSignal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFromWithSignal"])(result$, signal);
    };
    const getValues = (keyArgs, options)=>Promise.all(keyArgs.map((args)=>getValue(...options ? [
                ...args,
                options
            ] : args)));
    const watchEntries = (...args)=>{
        const lastArg = args.at(-1);
        const isLastArgOptional = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOptionalArg"])(lastArg);
        return getWatchEntries(pallet, name, isLastArgOptional ? args.slice(0, -1) : args, isLastArgOptional && lastArg.at === "best");
    };
    const getKey = (...args)=>{
        const token = args.at(-1);
        if (token instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompatibilityToken"] || token instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RuntimeToken"]) {
            const actualArgs = args.slice(0, -1);
            const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompatibilityApi"])(token).runtime();
            if (!argsAreCompatible(token, ctx, actualArgs)) throw incompatibleError();
            return getCodec(ctx).keys.enc(...actualArgs);
        }
        return descriptorsPromise.then((x)=>getKey(...args, x));
    };
    return {
        isCompatible,
        getCompatibilityLevel,
        getKey,
        getValue,
        getValues,
        getEntries,
        watchValue,
        watchEntries
    };
};
;
 //# sourceMappingURL=storage.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/system-version.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getSystemVersionStruct": (()=>getSystemVersionStruct)
});
const getSystemVersionStruct = (lookupFn, dynamicBuilder)=>{
    const constant = lookupFn.metadata.pallets.find((x)=>x.name === "System").constants.find((s)=>s.name === "Version");
    const systemVersion = lookupFn(constant.type);
    const systemVersionDec = dynamicBuilder.buildDefinition(constant.type).dec;
    if (systemVersion.type !== "struct") throw new Error("not a struct");
    return systemVersionDec(constant.value);
};
;
 //# sourceMappingURL=system-version.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/mortal-enc.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mortal": (()=>mortal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/scale-ts@1.6.1/node_modules/scale-ts/dist/scale-ts.js [app-ssr] (ecmascript)");
;
function trailingZeroes(n) {
    let i = 0;
    while(!(n & 1)){
        i++;
        n >>= 1;
    }
    return i;
}
const nextPower = (n)=>1 << Math.ceil(Math.log2(n));
const mortal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enhanceEncoder"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bytes"])(2)[0], (value)=>{
    const period = Math.min(Math.max(nextPower(value.period), 4), 1 << 16);
    const phase = value.startAtBlock % period;
    const factor = Math.max(period >> 12, 1);
    const left = Math.min(Math.max(trailingZeroes(period) - 1, 1), 15);
    const right = phase / factor << 4;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u16"][0](left | right);
});
;
 //# sourceMappingURL=mortal-enc.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/charge-asset-tx-enc.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ChargeAssetTxPaymentEnc": (()=>ChargeAssetTxPaymentEnc)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/shaped.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/scale-ts@1.6.1/node_modules/scale-ts/dist/scale-ts.js [app-ssr] (ecmascript)");
;
const [ChargeAssetTxPaymentEnc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Struct"])({
    tip: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compact"],
    asset: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Option"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bytes"])(Infinity))
});
;
 //# sourceMappingURL=charge-asset-tx-enc.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/sign-extensions.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getSignExtensionsCreator": (()=>getSignExtensionsCreator)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mapObject$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/mapObject.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$system$2d$version$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/system-version.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$mortal$2d$enc$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/mortal-enc.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$charge$2d$asset$2d$tx$2d$enc$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/charge-asset-tx-enc.mjs [app-ssr] (ecmascript)");
;
;
;
;
const empty = new Uint8Array();
const zero = Uint8Array.from([
    0
]);
const value = (value2)=>({
        value: value2,
        additionalSigned: empty
    });
const additionalSigned = (additionalSigned2)=>({
        value: empty,
        additionalSigned: additionalSigned2
    });
const both = (value2, additionalSigned2)=>({
        value: value2,
        additionalSigned: additionalSigned2
    });
const getSignExtensionsCreator = (genesis, lookupFn, dynamicBuilder)=>{
    const signedExtensionsEncoders = {};
    lookupFn.metadata.extrinsic.signedExtensions.forEach(({ identifier, type, additionalSigned: additionalSigned2 })=>{
        signedExtensionsEncoders[identifier] = [
            type,
            additionalSigned2
        ].map((x)=>dynamicBuilder.buildDefinition(x)[0]);
    });
    return ({ mortality, tip = 0n, nonce, customSignedExtensions = {}, ...rest })=>{
        const invalidKeys = [];
        const systemVersion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$system$2d$version$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSystemVersionStruct"])(lookupFn, dynamicBuilder);
        const getFromCustomEntry = (key)=>{
            const [valueEnc, additionalEnc] = signedExtensionsEncoders[key];
            const customEntry = customSignedExtensions[key];
            try {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mapObject$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapObject"])({
                    value: valueEnc,
                    additionalSigned: additionalEnc
                }, (encoder, key2)=>{
                    const input = customEntry?.[key2];
                    return input instanceof Uint8Array ? input : encoder(input);
                });
            } catch  {
                invalidKeys.push(key);
                return null;
            }
        };
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mapObject$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapObject"])(signedExtensionsEncoders, ([valueEnc, additionalEnc], key)=>{
            if (customSignedExtensions[key]) return getFromCustomEntry(key);
            switch(key){
                case "CheckNonce":
                    return value(valueEnc(nonce));
                case "CheckMortality":
                    return mortality.mortal ? both((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$mortal$2d$enc$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mortal"])({
                        period: mortality.period,
                        startAtBlock: mortality.startAtBlock.height
                    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(mortality.startAtBlock.hash)) : both(zero, genesis);
                case "ChargeTransactionPayment":
                    return value(valueEnc(tip));
                case "ChargeAssetTxPayment":
                    return value((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$charge$2d$asset$2d$tx$2d$enc$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChargeAssetTxPaymentEnc"])({
                        tip,
                        asset: rest.asset
                    }));
                case "CheckGenesis":
                    return additionalSigned(genesis);
                case "CheckMetadataHash":
                    return both(zero, zero);
                case "CheckSpecVersion":
                    return additionalSigned(additionalEnc(systemVersion["spec_version"]));
                case "CheckTxVersion":
                    return additionalSigned(additionalEnc(systemVersion["transaction_version"]));
                default:
                    return getFromCustomEntry(key);
            }
        });
        invalidKeys.forEach((key)=>{
            delete result[key];
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mapObject$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapObject"])(result, (x, identifier)=>({
                ...x,
                identifier
            }));
    };
};
;
 //# sourceMappingURL=sign-extensions.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/create-tx.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createTx": (()=>createTx)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/scale-ts@1.6.1/node_modules/scale-ts/dist/scale-ts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$sign$2d$extensions$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/signed-extensions/sign-extensions.mjs [app-ssr] (ecmascript)");
;
;
;
;
const NONCE_RUNTIME_CALL = "AccountNonceApi_account_nonce";
const lenToDecoder = {
    1: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"].dec,
    2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u16"].dec,
    4: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"].dec,
    8: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u64"].dec
};
const getNonceAtBlock$ = (call$, from, at)=>call$(at, NONCE_RUNTIME_CALL, from).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((result)=>{
        const bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(result);
        const decoder = lenToDecoder[bytes.length];
        if (!decoder) throw new Error(`${NONCE_RUNTIME_CALL} retrieved wrong data`);
        return decoder(bytes);
    }));
const createTx = (chainHead, signer, callData, atBlock, customSignedExtensions, hinted = {})=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineLatest"])([
        hinted.nonce ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(hinted.nonce) : getNonce$(chainHead, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])(signer.publicKey)),
        chainHead.getRuntimeContext$(atBlock.hash),
        chainHead.genesis$
    ]).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(([nonce, ctx, genesis])=>{
        const signExtCreator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$signed$2d$extensions$2f$sign$2d$extensions$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSignExtensionsCreator"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(genesis), ctx.lookup, ctx.dynamicBuilder);
        const mortality = hinted.mortality ?? {
            period: 64,
            mortal: true
        };
        const signExtensions = signExtCreator({
            nonce,
            tip: hinted.tip ?? 0n,
            mortality: mortality.mortal ? {
                mortal: true,
                period: mortality.period,
                startAtBlock: {
                    height: atBlock.number,
                    hash: atBlock.hash
                }
            } : {
                mortal: false
            },
            customSignedExtensions,
            asset: hinted.asset
        });
        return signer.signTx(callData, signExtensions, ctx.metadataRaw, atBlock.number);
    }));
const getNonce$ = (chainHead, from)=>{
    const followHead$ = (head)=>chainHead.newBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scan"])((acc, block)=>block.parent === acc ? block.hash : acc, head), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startWith"])(head), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])());
    const followNonce$ = (head)=>followHead$(head).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(2), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["switchMap"])((hash)=>getNonceAtBlock$(chainHead.call$, from, hash)));
    const getHeadsNonce$ = (heads)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineLatest"])(heads.map((head)=>followNonce$(head).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((value)=>({
                    success: true,
                    value
                })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((err)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])({
                    success: false,
                    value: err
                }))))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1));
    return chainHead.pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])((v)=>!v.recovering && v.blocks.size > 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(({ blocks, best })=>{
        const bestBlock = blocks.get(best);
        return [
            ...blocks.values()
        ].filter((v)=>!v.unpinnable && v.children.size === 0 && v.number >= bestBlock.number).map((v)=>v.hash);
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["switchMap"])(getHeadsNonce$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((result)=>{
        const winner = result.reduce((acc, v)=>v.success ? v.value >= (acc ?? 0) ? v.value : acc : acc, null);
        if (winner == null) {
            throw result[0].value;
        }
        return winner;
    }));
};
;
 //# sourceMappingURL=create-tx.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/continue-with.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "continueWith": (()=>continueWith)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
let NOTIN = {};
const continueWith = (mapper)=>(source)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            let latestValue = NOTIN;
            let subscription = source.subscribe({
                next (v) {
                    observer.next(latestValue = v);
                },
                error (e) {
                    observer.error(e);
                },
                complete () {
                    if (latestValue === NOTIN) observer.complete();
                    else subscription = mapper(latestValue).subscribe(observer);
                }
            });
            return ()=>{
                subscription.unsubscribe();
            };
        });
;
 //# sourceMappingURL=continue-with.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/submit-fns.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "InvalidTxError": (()=>InvalidTxError),
    "submit": (()=>submit),
    "submit$": (()=>submit$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Binary$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/Binary.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$hashes$2f$blake2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/hashes/blake2.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$continue$2d$with$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/continue-with.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __publicField = (obj, key, value)=>__defNormalProp(obj, key + "", value);
const hashFromTx = (tx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$hashes$2f$blake2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Blake2256"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(tx)));
const computeState = (analized$, blocks$)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
        const analyzedBlocks = /* @__PURE__ */ new Map();
        let pinnedBlocks;
        let latestState;
        const computeNextState = ()=>{
            let current = pinnedBlocks.best;
            let analyzed = analyzedBlocks.get(current);
            let analyzedNumber = pinnedBlocks.blocks.get(current).number;
            while(!analyzed){
                const block = pinnedBlocks.blocks.get(current);
                if (!block) break;
                analyzed = analyzedBlocks.get(current = block.parent);
                analyzedNumber--;
            }
            if (!analyzed) return;
            const isFinalized = analyzedNumber <= pinnedBlocks.blocks.get(pinnedBlocks.finalized).number;
            const found = analyzed.found.type;
            if (found && latestState?.found && latestState.hash === analyzed.hash) {
                if (isFinalized) observer.complete();
                return;
            }
            observer.next(latestState = analyzed.found.type ? {
                found,
                hash: analyzed.hash,
                number: analyzedNumber,
                index: analyzed.found.index,
                events: analyzed.found.events
            } : {
                found,
                validity: analyzed.found.validity
            });
            if (isFinalized) {
                if (found) observer.complete();
                else if (analyzed.found.validity?.success === false) observer.error(new InvalidTxError(analyzed.found.validity.value));
            }
        };
        const subscription = blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.finalized === b.finalized && a.best === b.best)).subscribe({
            next: (pinned)=>{
                pinnedBlocks = pinned;
                if (analyzedBlocks.size === 0) return;
                computeNextState();
            },
            error (e) {
                observer.error(e);
            }
        });
        subscription.add(analized$.subscribe({
            next: (block)=>{
                analyzedBlocks.set(block.hash, block);
                computeNextState();
            },
            error (e) {
                observer.error(e);
            }
        }));
        return subscription;
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a === b));
const getTxSuccessFromSystemEvents = (systemEvents, txIdx)=>{
    const events = systemEvents.filter((x)=>x.phase.type === "ApplyExtrinsic" && x.phase.value === txIdx).map((x)=>({
            ...x.event,
            topics: x.topics
        }));
    const lastEvent = events[events.length - 1];
    if (lastEvent.type === "System" && lastEvent.value.type === "ExtrinsicFailed") {
        return {
            ok: false,
            events,
            dispatchError: lastEvent.value.value.dispatch_error
        };
    }
    return {
        ok: true,
        events
    };
};
class InvalidTxError extends Error {
    // likely to be a `TransactionValidityError`
    constructor(e){
        super(JSON.stringify(e, (_, value)=>{
            if (typeof value === "bigint") return value.toString();
            return value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Binary$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Binary"] ? value.asHex() : value;
        }, 2));
        __publicField(this, "error");
        this.name = "InvalidTxError";
        this.error = e;
    }
}
const submit$ = (chainHead, broadcastTx$, tx, emitSign = false)=>{
    const txHash = hashFromTx(tx);
    const getTxEvent = (type, rest)=>({
            type,
            txHash,
            ...rest
        });
    const validate$ = chainHead.pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((blocks)=>{
        let bestBlocks = [];
        return blocks.finalizedRuntime.runtime.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((r)=>r.getMortalityFromTx(tx)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])({
                mortal: false
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>{
            const { best, finalized } = blocks;
            let current = best;
            while(current !== finalized){
                bestBlocks.push(current);
                current = blocks.blocks.get(current).parent;
            }
            bestBlocks.push(finalized);
            if (!x.mortal) return [
                finalized,
                best
            ];
            const { phase, period } = x;
            const bestBlock = blocks.blocks.get(best);
            const topNumber = bestBlock.number;
            const txBlockNumber = Math.floor((topNumber - phase) / period) * period + phase;
            let result = [
                blocks.blocks.get(blocks.finalized)
            ];
            while(result.length && result[0].number < txBlockNumber){
                result = result.flatMap((x2)=>[
                        ...x2.children
                    ]).map((x2)=>blocks.blocks.get(x2)).filter(Boolean);
            }
            return (result.length ? result : [
                bestBlock
            ]).map((x2)=>x2.hash);
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((toCheck)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])(...[
                ...new Set(toCheck)
            ].map((at)=>chainHead.validateTx$(at, tx).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((result)=>({
                        at,
                        result
                    })))))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["takeWhile"])(({ result })=>!result.success, true), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reduce"])((acc, curr)=>[
                ...acc,
                curr
            ], []), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((results)=>{
            const badOnes = new Map(results.filter(({ result })=>!result.success).map((x)=>[
                    x.at,
                    x.result
                ]));
            if (badOnes.size < results.length) return null;
            throw new InvalidTxError(badOnes.get(// there is a possible, but very unlikely, race-condition in which:
            // we have received a new block that is about to be flagged as best,
            // and that its height is higher than all the others, but the notification
            // that sets it as best has not arrived yet. In that case, that block wouldn't
            // be in the lineage of the best-blocks, but then it would be the only one in the list of `badOnes`
            bestBlocks.find((x)=>badOnes.has(x)) ?? [
                ...badOnes.keys()
            ][0]).value);
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])(Boolean));
    }));
    const track$ = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
        const subscription = chainHead.trackTx$(tx).subscribe(observer);
        subscription.add(broadcastTx$(tx).subscribe({
            error (e) {
                observer.error(e);
            }
        }));
        return subscription;
    });
    const bestBlockState$ = computeState(track$, chainHead.pinnedBlocks$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>{
        if (!x.found) return getTxEvent("txBestBlocksState", {
            found: false,
            isValid: x.validity?.success !== false
        });
        return getTxEvent("txBestBlocksState", {
            found: true,
            block: {
                index: x.index,
                number: x.number,
                hash: x.hash
            },
            ...getTxSuccessFromSystemEvents(x.events, x.index)
        });
    }));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["concat"])(emitSign ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(getTxEvent("signed", {})) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY"], validate$, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(getTxEvent("broadcasted", {})), bestBlockState$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$continue$2d$with$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["continueWith"])(({ found, type, ...rest })=>found ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(getTxEvent("finalized", rest)) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY"])));
};
const submit = async (chainHead, broadcastTx$, transaction, _at)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lastValueFrom"])(submit$(chainHead, broadcastTx$, transaction)).then((x)=>{
        if (x.type !== "finalized") throw null;
        const result = {
            ...x
        };
        delete result.type;
        return result;
    });
;
 //# sourceMappingURL=submit-fns.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/tx.mjs [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createTxEntry": (()=>createTxEntry)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$signer$40$0$2e$2$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$signer$2f$dist$2f$esm$2f$from$2d$raw$2d$signer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+signer@0.2.2/node_modules/@polkadot-api/signer/dist/esm/from-raw-signer.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$AccountId$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/AccountId.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/shaped.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/scale-ts@1.6.1/node_modules/scale-ts/dist/scale-ts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Variant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/Variant.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$compact$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/compact.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$types$2f$enum$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/types/enum.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Binary$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/Binary.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mergeUint8$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/mergeUint8.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/compatibility.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$create$2d$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/create-tx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$submit$2d$fns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/submit-fns.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-compatibility@0.3.0/node_modules/@polkadot-api/metadata-compatibility/dist/esm/isCompatible.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$typedef$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-compatibility@0.3.0/node_modules/@polkadot-api/metadata-compatibility/dist/esm/typedef.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
const accountIdEnc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$AccountId$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountId"])().enc;
const fakeSignature = new Uint8Array(64);
const fakeSignatureEth = new Uint8Array(65);
const getFakeSignature = (isEth)=>()=>isEth ? fakeSignatureEth : fakeSignature;
const [, queryInfoDecFallback] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Struct"])({
    weight: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Struct"])({
        ref_time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$compact$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compactBn"],
        proof_size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$compact$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compactBn"]
    }),
    class: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Variant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Variant"])({
        Normal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        Operational: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        Mandatory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"]
    }),
    partial_fee: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u128"]
});
const createTxEntry = (pallet, name, chainHead, broadcast, { isCompatible: isCompatibleHelper, getCompatibilityLevel, compatibleRuntime$, argsAreCompatible, getRuntimeTypedef }, checkCompatibility)=>{
    const fn = (arg)=>{
        const getCallDataWithContext = (runtime, arg2, txOptions = {})=>{
            const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompatibilityApi"])(runtime).runtime();
            const { dynamicBuilder, assetId, lookup } = ctx;
            let codecs;
            try {
                codecs = dynamicBuilder.buildCall(pallet, name);
            } catch  {
                throw new Error(`Runtime entry Tx(${pallet}.${name}) not found`);
            }
            if (checkCompatibility && !argsAreCompatible(runtime, ctx, arg2)) throw new Error(`Incompatible runtime entry Tx(${pallet}.${name})`);
            let returnOptions = txOptions;
            if (txOptions.asset) {
                if (assetId == null || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$isCompatible$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCompatible"])(txOptions.asset, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$typedef$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapLookupToTypedef"])(lookup(assetId)), (id)=>getRuntimeTypedef(ctx, id))) throw new Error(`Incompatible runtime asset`);
                returnOptions = {
                    ...txOptions,
                    asset: dynamicBuilder.buildDefinition(assetId).enc(txOptions.asset)
                };
            }
            const { location, codec } = codecs;
            return {
                callData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Binary$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Binary"].fromBytes((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mergeUint8$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeUint8"])([
                    new Uint8Array(location),
                    codec.enc(arg2)
                ])),
                options: returnOptions
            };
        };
        const getCallData$ = (arg2, options = {})=>compatibleRuntime$(chainHead, null).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([runtime])=>getCallDataWithContext(runtime, arg2, options)));
        const getEncodedData = (token)=>{
            if (!token) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(getCallData$(arg).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>x.callData)));
            return getCallDataWithContext(token, arg).callData;
        };
        const sign$ = (from, { ..._options }, atBlock)=>getCallData$(arg, _options).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(({ callData, options })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$create$2d$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTx"])(chainHead, from, callData.asBytes(), atBlock, _options.customSignedExtensions || {}, options)));
        const _sign = (from, { at, ..._options } = {})=>{
            return (!at || at === "finalized" ? chainHead.finalized$ : at === "best" ? chainHead.best$ : chainHead.bestBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>x.find((b)=>b.hash === at)))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((atBlock)=>atBlock ? sign$(from, _options, atBlock).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((signed)=>({
                        tx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])(signed),
                        block: atBlock
                    }))) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(()=>new Error(`Uknown block ${at}`))));
        };
        const sign = (from, options)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(_sign(from, options)).then((x)=>x.tx);
        const signAndSubmit = (from, _options)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(_sign(from, _options)).then(({ tx, block })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$submit$2d$fns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["submit"])(chainHead, broadcast, tx, block.hash));
        const signSubmitAndWatch = (from, _options)=>_sign(from, _options).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(({ tx })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$submit$2d$fns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["submit$"])(chainHead, broadcast, tx, true)));
        const getPaymentInfo = async (from, _options)=>{
            if (typeof from === "string") from = from.startsWith("0x") ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(from) : accountIdEnc(from);
            const isEth = from.length === 20;
            const fakeSigner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$signer$40$0$2e$2$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$signer$2f$dist$2f$esm$2f$from$2d$raw$2d$signer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPolkadotSigner"])(from, isEth ? "Ecdsa" : "Sr25519", getFakeSignature(isEth));
            const encoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(await sign(fakeSigner, _options));
            const args = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mergeUint8$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeUint8"])([
                encoded,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"].enc(encoded.length)
            ]));
            const decoder$ = chainHead.getRuntimeContext$(null).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((ctx)=>{
                try {
                    return ctx.dynamicBuilder.buildRuntimeCall("TransactionPaymentApi", "query_info").value[1];
                } catch  {
                    return queryInfoDecFallback;
                }
            }));
            const call$ = chainHead.call$(null, "TransactionPaymentApi_query_info", args);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineLatest"])([
                call$,
                decoder$
            ]).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([result, decoder])=>decoder(result))));
        };
        const getEstimatedFees = async (from, _options)=>(await getPaymentInfo(from, _options)).partial_fee;
        return {
            getPaymentInfo,
            getEstimatedFees,
            decodedCall: {
                type: pallet,
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$types$2f$enum$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Enum"])(name, arg)
            },
            getEncodedData,
            sign,
            signSubmitAndWatch,
            signAndSubmit
        };
    };
    return Object.assign(fn, {
        getCompatibilityLevel,
        isCompatible: isCompatibleHelper
    });
};
;
 //# sourceMappingURL=tx.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/self-dependent.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "selfDependent": (()=>selfDependent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$operators$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/operators/index.js [app-ssr] (ecmascript)");
;
;
const selfDependent = ()=>{
    const activeSubject = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BehaviorSubject"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subject"]());
    return [
        activeSubject.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$operators$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["switchAll"])()),
        ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$operators$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tap"])({
                next: (v)=>activeSubject.value.next(v),
                error: (e)=>{
                    activeSubject.value.error(e);
                    activeSubject.next(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subject"]());
                },
                complete: ()=>{
                    activeSubject.value.complete();
                    activeSubject.next(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subject"]());
                }
            })
    ];
};
;
 //# sourceMappingURL=self-dependent.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/watch-entries.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createWatchEntries": (()=>createWatchEntries)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$block$2d$operations$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/block-operations.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$lossLessExhaustMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/lossLessExhaustMap.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$self$2d$dependent$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/self-dependent.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$rx$2d$state$2b$core$40$0$2e$1$2e$4_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$rx$2d$state$2f$core$2f$dist$2f$rxstate$2e$core$2e$es2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@rx-state+core@0.1.4_rxjs@7.8.2/node_modules/@rx-state/core/dist/rxstate.core.es2017.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const getDiff = (_prev, _current, patch)=>{
    const current = new Map(_current.map((x)=>[
            x.key,
            x
        ]));
    const prev = new Map(_prev.map((x)=>[
            x.key,
            x
        ]));
    const upserted = /* @__PURE__ */ new Map();
    const deleted = [];
    _current.forEach((value)=>{
        const { key } = value;
        const prevVal = prev.get(key);
        if (!prevVal || prevVal.value !== value.value) upserted.set(key, patch(value));
    });
    _prev.forEach((x)=>{
        if (!current.has(x.key)) deleted.push(x);
    });
    return {
        deltas: {
            deleted,
            upserted: [
                ...upserted.values()
            ]
        },
        entries: _current.map(({ key })=>upserted.get(key) ?? prev.get(key))
    };
};
const findPrevious = (start, state2, pinned, includeStart = false)=>{
    try {
        let target = includeStart ? start : pinned.blocks.get(start).parent;
        while(target && !state2[target])target = pinned.blocks.get(target).parent;
        if (!target) return null;
        return state2[target];
    } catch  {
        return null;
    }
};
const getPatcherFromRuntime = (pallet, entry)=>(runtime)=>{
        const { keys, value } = runtime.dynamicBuilder.buildStorage(pallet, entry);
        return (x)=>{
            x.dec = {
                value: value.dec(x.value),
                args: keys.dec(x.key)
            };
            return x;
        };
    };
const createWatchEntries = (blocks$, storage, withRuntime)=>{
    const getMemoryBlocks$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$rx$2d$state$2b$core$40$0$2e$1$2e$4_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$rx$2d$state$2f$core$2f$dist$2f$rxstate$2e$core$2e$es2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["state"])((pallet, entry, storageKey)=>{
        const getPatcher = getPatcherFromRuntime(pallet, entry);
        const getNextMemoryBlock$ = (prev, block)=>{
            const isNotCanonical$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$block$2d$operations$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBestOrFinalizedBlock"])(blocks$, block.hash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])((x)=>!x), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1));
            return storage(block.hash, "closestDescendantMerkleValue", ()=>storageKey).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((rootHash)=>{
                if (rootHash === prev?.rootHash) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])({
                    ...prev,
                    block,
                    deltas: null,
                    prev: prev.block.hash
                });
                return storage(block.hash, "descendantsValues", ()=>storageKey).pipe(withRuntime(()=>block.hash), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([entries, runtimeCtx])=>[
                        entries,
                        getPatcher(runtimeCtx)
                    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([entries, patcher])=>({
                        prev: prev && prev.block.hash,
                        rootHash,
                        block,
                        ...getDiff(prev?.entries ?? [], entries, patcher)
                    })));
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["takeUntil"])(isNotCanonical$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((e)=>e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"] ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(()=>e)));
        };
        const initial$ = blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.finalized === b.finalized), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$lossLessExhaustMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lossLessExhaustMap"])(({ blocks, finalized })=>getNextMemoryBlock$(null, blocks.get(finalized))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>({
                blocks: {
                    [x.block.hash]: x
                },
                finalized: x.block.hash
            })));
        const [_memoryBlocks$, connectMemoryBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$self$2d$dependent$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["selfDependent"])();
        const updates$ = blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.best === b.best), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withLatestFrom"])(_memoryBlocks$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$lossLessExhaustMap$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lossLessExhaustMap"])(([pinned, memoryBlocks])=>{
            const { best } = pinned;
            const { blocks } = memoryBlocks;
            let target = !blocks[best] ? best : null;
            if (!target) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY"];
            const previous = findPrevious(target, blocks, pinned);
            if (previous) return getNextMemoryBlock$(previous, pinned.blocks.get(target)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>{
                blocks[target] = x;
                return memoryBlocks;
            }));
            target = pinned.finalized;
            return getNextMemoryBlock$(blocks[memoryBlocks.finalized], pinned.blocks.get(target)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>{
                x.prev = null;
                return {
                    blocks: {
                        [target]: x
                    },
                    finalized: target
                };
            }));
        }));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])(initial$, updates$).pipe(connectMemoryBlocks());
    });
    const getBestOrFinalized = (isFinalized)=>(pallet, entry, storageKey)=>{
            const memoryBlocks$ = getMemoryBlocks$(pallet, entry, storageKey);
            const getPatcher = getPatcherFromRuntime(pallet, entry);
            const prop = isFinalized ? "finalized" : "best";
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combineLatest"])([
                memoryBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["delay"])(0)),
                blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a[prop] === b[prop]))
            ]).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([state2, blocks])=>findPrevious(blocks[prop], state2.blocks, blocks, true)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])(Boolean), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startWith"])(null), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pairwise"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withLatestFrom"])(memoryBlocks$), withRuntime(([[, _latest]])=>_latest.block.hash), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([[[prevUpdate, latest], memoryBlocks], runtimeCtx])=>[
                    prevUpdate,
                    latest,
                    memoryBlocks,
                    getPatcher(runtimeCtx)
                ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(([prevUpdate, latest, memoryBlocks, patcher])=>{
                if (!prevUpdate) return [
                    latest
                ];
                let ancestor = latest;
                const updates = [];
                while(ancestor && ancestor.block.number > prevUpdate.block.number){
                    updates.unshift(ancestor);
                    ancestor = ancestor.prev ? memoryBlocks.blocks[ancestor.prev] : null;
                }
                if (isFinalized) {
                    memoryBlocks.finalized = latest.block.hash;
                    if (updates.length) {
                        const { blocks } = memoryBlocks;
                        Object.keys(blocks).forEach((key)=>{
                            if (blocks[key].block.number < updates[0].block.number) delete blocks[key];
                        });
                    }
                }
                if (prevUpdate === ancestor) return updates;
                return [
                    {
                        ...latest,
                        ...prevUpdate.rootHash === latest.rootHash ? {
                            entries: prevUpdate.entries,
                            deltas: null
                        } : getDiff(prevUpdate.entries, latest.entries, patcher)
                    }
                ];
            }));
        };
    const getFinalized$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$rx$2d$state$2b$core$40$0$2e$1$2e$4_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$rx$2d$state$2f$core$2f$dist$2f$rxstate$2e$core$2e$es2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["state"])(getBestOrFinalized(true));
    const getBest$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$rx$2d$state$2b$core$40$0$2e$1$2e$4_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$rx$2d$state$2f$core$2f$dist$2f$rxstate$2e$core$2e$es2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["state"])(getBestOrFinalized(false));
    return (pallet, entry, args, atBest)=>{
        const fn = atBest ? getBest$ : getFinalized$;
        const storageKey$ = blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((b)=>b.runtimes[b.blocks.get(b[atBest ? "best" : "finalized"]).runtime].runtime), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((runtime)=>runtime.dynamicBuilder.buildStorage(pallet, entry).keys.enc(...args)));
        return storageKey$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((storageKey)=>fn(pallet, entry, storageKey)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(({ block: { hash, number, parent }, deltas, entries }, idx)=>{
            const actualDeltas = idx > 0 ? deltas : {
                deleted: [],
                upserted: entries
            };
            return {
                block: {
                    hash,
                    number,
                    parent
                },
                entries: entries.map(toDec),
                deltas: actualDeltas && {
                    deleted: actualDeltas.deleted.map(toDec),
                    upserted: actualDeltas.upserted.map(toDec)
                }
            };
        }));
    };
};
const toDec = (x)=>x.dec;
;
 //# sourceMappingURL=watch-entries.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/viewFns.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createViewFnEntry": (()=>createViewFnEntry)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$firstValueFromWithSignal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/firstValueFromWithSignal.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/utils/optional-arg.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mergeUint8$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/mergeUint8.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$compact$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/compact.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const RUNTIME_NAMESPACE = "RuntimeViewFunction";
const RUNTIME_METHOD = "execute_view_function";
const RUNTIME_CALL_NAME = RUNTIME_NAMESPACE + "_" + RUNTIME_METHOD;
const createViewFnEntry = (pallet, entry, chainHead, { isCompatible, getCompatibilityLevel, compatibleRuntime$, argsAreCompatible, valuesAreCompatible })=>{
    const compatibilityError = ()=>new Error(`Incompatible runtime entry ViewFn(${pallet}.${entry})`);
    const fn = (...args)=>{
        const lastArg = args[args.length - 1];
        const isLastArgOptional = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$optional$2d$arg$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOptionalArg"])(lastArg);
        const { signal, at: _at } = isLastArgOptional ? lastArg : {};
        const at = _at ?? null;
        const result$ = compatibleRuntime$(chainHead, at).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(([runtime, ctx])=>{
            let apiCodec;
            try {
                apiCodec = ctx.dynamicBuilder.buildRuntimeCall(RUNTIME_NAMESPACE, RUNTIME_METHOD);
            } catch  {
                throw new Error(`Runtime entry RuntimeCall(${RUNTIME_CALL_NAME}) not found`);
            }
            let viewCodec;
            try {
                viewCodec = ctx.dynamicBuilder.buildViewFn(pallet, entry);
            } catch  {
                throw new Error(`Runtime entry ViewFn(${pallet}.${entry}) not found`);
            }
            if (!argsAreCompatible(runtime, ctx, args)) throw compatibilityError();
            const viewArgs = viewCodec.args.enc(args);
            const arg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mergeUint8$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeUint8"])([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(ctx.lookup.metadata.pallets.find(({ name })=>name === pallet).viewFns.find(({ name })=>name === entry).id),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$compact$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compactNumber"].enc(viewArgs.length),
                viewArgs
            ]);
            return chainHead.call$(at, RUNTIME_CALL_NAME, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])(arg)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((v)=>{
                try {
                    const decoded = apiCodec.value.dec(v);
                    if (!("success" in decoded && "value" in decoded) || !("type" in decoded.value) && !("asBytes" in decoded.value)) throw null;
                    return decoded;
                } catch  {
                    throw new Error(`Unexpected RuntimeCall(${RUNTIME_CALL_NAME}) type`);
                }
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(({ success, value })=>{
                if (!success) throw new Error(`ViewFn API Error: ${value.type}`);
                const decoded = viewCodec.value.dec(value.asBytes());
                if (!valuesAreCompatible(runtime, ctx, decoded)) throw compatibilityError();
                return decoded;
            }));
        }));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$utils$2f$firstValueFromWithSignal$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFromWithSignal"])(result$, signal);
    };
    return Object.assign(fn, {
        getCompatibilityLevel,
        isCompatible
    });
};
;
 //# sourceMappingURL=viewFns.mjs.map
}}),
"[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/client.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-compatibility@0.3.0/node_modules/@polkadot-api/metadata-compatibility/dist/esm/entryPoint.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$getObservableClient$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/getObservableClient.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/with-archive.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$substrate$2d$client$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-client@0.4.1/node_modules/@polkadot-api/substrate-client/dist/esm/substrate-client.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/compatibility.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/constants.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$event$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/event.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$runtime$2d$call$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/runtime-call.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$storage$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/storage.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/tx.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$watch$2d$entries$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/watch-entries.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$viewFns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/viewFns.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$submit$2d$fns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/polkadot-api@1.14.1_jiti@2.4.2_postcss@8.5.6_rxjs@7.8.2/node_modules/polkadot-api/dist/esm/tx/submit-fns.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
const createApi = (compatibilityToken, chainHead, broadcast$)=>{
    const target = {};
    const createProxy = (propCall)=>new Proxy(target, {
            get (_, prop) {
                return propCall(prop);
            }
        });
    const createProxyPath = (pathCall)=>{
        const cache = {};
        return createProxy((a)=>{
            if (!cache[a]) cache[a] = {};
            return createProxy((b)=>{
                if (!cache[a][b]) cache[a][b] = pathCall(a, b);
                return cache[a][b];
            });
        });
    };
    const getPallet = (ctx, name)=>ctx.lookup.metadata.pallets.find((p)=>p.name === name);
    const getWatchEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$watch$2d$entries$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createWatchEntries"])(chainHead.pinnedBlocks$, chainHead.storage$, chainHead.withRuntime);
    const query = createProxyPath((pallet, name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$storage$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStorageEntry"])(pallet, name, chainHead, getWatchEntries, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compatibilityHelper"])(compatibilityToken, (r)=>r.getEntryPoint(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpType"].Storage, pallet, name), // TODO this is way sub-optimal. Needs some rethought - maybe a builder for entry points?.
        (ctx)=>{
            const item = getPallet(ctx, pallet)?.storage?.items.find((s)=>s.name === name);
            return item == null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storageEntryPoint"])(item);
        })));
    const getEnumEntry = (ctx, side, id, name)=>{
        if (id == null) return null;
        const entry = ctx.lookup(id);
        if (entry.type !== "enum") throw new Error("Expected enum");
        if (entry.value[name] == null) return null;
        const node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enumValueEntryPointNode"])(entry.value[name]);
        return {
            args: side === "args" ? node : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["voidEntryPointNode"],
            values: side === "args" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["voidEntryPointNode"] : node
        };
    };
    const tx = createProxyPath((pallet, name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createTxEntry"])(pallet, name, chainHead, broadcast$, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compatibilityHelper"])(compatibilityToken, (r)=>r.getEntryPoint(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpType"].Tx, pallet, name), (ctx)=>getEnumEntry(ctx, "args", getPallet(ctx, pallet)?.calls?.type, name)), true));
    const event = createProxyPath((pallet, name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$event$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEventEntry"])(pallet, name, chainHead, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compatibilityHelper"])(compatibilityToken, (r)=>r.getEntryPoint(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpType"].Event, pallet, name), (ctx)=>getEnumEntry(ctx, "values", getPallet(ctx, pallet)?.events?.type, name))));
    const constants = createProxyPath((pallet, name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createConstantEntry"])(pallet, name, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compatibilityHelper"])(compatibilityToken, (r)=>r.getEntryPoint(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpType"].Const, pallet, name), (ctx)=>{
            const item = getPallet(ctx, pallet)?.constants.find((c)=>c.name === name)?.type;
            return item == null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["singleValueEntryPoint"])(item);
        })));
    const apis = createProxyPath((api, method)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$runtime$2d$call$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRuntimeCallEntry"])(api, method, chainHead, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compatibilityHelper"])(compatibilityToken, (r)=>r.getEntryPoint(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpType"].Api, api, method), (ctx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runtimeCallEntryPoint"])(ctx.lookup.metadata.apis.find((a)=>a.name === api).methods.find((m)=>m.name === method)))));
    const view = createProxyPath((pallet, entry)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$viewFns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createViewFnEntry"])(pallet, entry, chainHead, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compatibilityHelper"])(compatibilityToken, (r)=>r.getEntryPoint(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpType"].ViewFns, pallet, entry), (ctx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$compatibility$40$0$2e$3$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$compatibility$2f$dist$2f$esm$2f$entryPoint$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runtimeCallEntryPoint"])(ctx.lookup.metadata.pallets.find((a)=>a.name === pallet).viewFns.find((m)=>m.name === entry)))));
    const _callDataTx = (callData, token)=>{
        const { lookup, dynamicBuilder } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompatibilityApi"])(token).runtime();
        try {
            const decoded = dynamicBuilder.buildDefinition(lookup.call).dec(callData.asBytes());
            const pallet = decoded.type;
            const call = decoded.value.type;
            const args = decoded.value.value;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createTxEntry"])(pallet, call, chainHead, broadcast$, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compatibilityHelper"])(compatibilityToken, (r)=>r.getEntryPoint(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OpType"].Tx, pallet, call), (ctx)=>getEnumEntry(ctx, "args", getPallet(ctx, pallet)?.calls?.type, call)), false)(args);
        } catch  {
            throw new Error("createTx: invalid call data");
        }
    };
    return {
        query,
        txFromCallData: (callData, token)=>token ? _callDataTx(callData, token) : compatibilityToken.then((t)=>_callDataTx(callData, t)),
        tx,
        event,
        apis,
        constants,
        view
    };
};
function createClient(provider, { getMetadata, setMetadata } = {}) {
    const rawClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$substrate$2d$client$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])(provider);
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$getObservableClient$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getObservableClient"])(rawClient, {
        getMetadata: getMetadata ? (codeHash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["from"])(getMetadata(codeHash)) : void 0,
        setMetadata
    });
    const { getChainSpecData } = rawClient;
    const { genesis$, ..._chainHead } = client.chainHead$();
    const archive = client.archive(_chainHead.getRuntime$);
    const chainHead = {
        ..._chainHead,
        genesis$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(getChainSpecData).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(({ genesisHash })=>genesisHash), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])(()=>genesis$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareReplay"])(1)),
        storage$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withArchive"])(_chainHead.storage$, archive.storage$),
        body$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withArchive"])(_chainHead.body$, archive.body$),
        call$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withArchive"])(_chainHead.call$, archive.call$),
        header$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withArchive"])(_chainHead.header$, archive.header$),
        eventsAt$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withArchive"])(_chainHead.eventsAt$, archive.eventsAt$),
        storageQueries$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withArchive"])(_chainHead.storageQueries$, archive.storageQueries$),
        getRuntimeContext$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withArchive"])(_chainHead.getRuntimeContext$, archive.getRuntimeContext$)
    };
    const _request = rawClient.request;
    let runtimeToken;
    const compatibilityToken = /* @__PURE__ */ new WeakMap();
    const getChainToken = (chainDefinition)=>{
        const result = compatibilityToken.get(chainDefinition) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCompatibilityToken"])(chainDefinition, chainHead);
        compatibilityToken.set(chainDefinition, result);
        return result;
    };
    const getRuntimeToken = ()=>runtimeToken ?? (runtimeToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$compatibility$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRuntimeToken"])(chainHead));
    const { broadcastTx$ } = client;
    return {
        getChainSpecData,
        blocks$: chainHead.newBlocks$,
        finalizedBlock$: chainHead.finalized$,
        getFinalizedBlock: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(chainHead.finalized$),
        bestBlocks$: chainHead.bestBlocks$,
        getBestBlocks: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(chainHead.bestBlocks$),
        watchBlockBody: chainHead.body$,
        getBlockBody: (hash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(chainHead.body$(hash)),
        getBlockHeader: (hash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firstValueFrom"])(chainHead.header$(hash ?? null)),
        submit: (...args)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$submit$2d$fns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["submit"])(chainHead, broadcastTx$, ...args),
        submitAndWatch: (tx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$polkadot$2d$api$40$1$2e$14$2e$1_jiti$40$2$2e$4$2e$2_postcss$40$8$2e$5$2e$6_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$polkadot$2d$api$2f$dist$2f$esm$2f$tx$2f$submit$2d$fns$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["submit$"])(chainHead, broadcastTx$, tx),
        getTypedApi: (chainDefinition)=>{
            const token = getChainToken(chainDefinition);
            return Object.assign(createApi(token, chainHead, broadcastTx$), {
                compatibilityToken: token
            });
        },
        getUnsafeApi: ()=>{
            const token = getRuntimeToken();
            return Object.assign(createApi(token, chainHead, broadcastTx$), {
                runtimeToken: token
            });
        },
        destroy: ()=>{
            chainHead.unfollow();
            client.destroy();
        },
        _request
    };
}
;
 //# sourceMappingURL=client.mjs.map
}}),

};

//# sourceMappingURL=add9b_polkadot-api_dist_esm_62260da9._.js.map