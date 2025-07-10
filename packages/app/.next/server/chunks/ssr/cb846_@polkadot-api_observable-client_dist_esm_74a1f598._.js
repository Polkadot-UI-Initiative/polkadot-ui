module.exports = {

"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/operationLimitRecovery.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>PendingTaskQueue),
    "getWithRecovery": (()=>getWithRecovery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-client@0.4.1/node_modules/@polkadot-api/substrate-client/dist/esm/chainhead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
;
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __publicField = (obj, key, value)=>__defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class PendingTaskQueue {
    constructor(){
        __publicField(this, "first");
        __publicField(this, "last");
    }
    getRemoveFn(node) {
        return ()=>{
            if (node.prev) {
                node.prev.next = node.next;
            } else {
                this.first = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            } else {
                this.last = node.prev;
            }
            delete node.prev;
            delete node.next;
        };
    }
    push(value) {
        const newNode = {
            value
        };
        if (this.last === void 0) {
            this.last = this.first = newNode;
        } else {
            this.last.next = newNode;
            newNode.prev = this.last;
            this.last = newNode;
        }
        return this.getRemoveFn(newNode);
    }
    unshift(value) {
        this.first = {
            value,
            next: this.first
        };
        this.first.next && (this.first.next.prev = this.first);
        this.last || (this.last = this.first);
        return this.getRemoveFn(this.first);
    }
    pop() {
        const result = this.first?.value;
        if (this.first) {
            this.first = this.first.next;
            if (!this.first) {
                this.last = void 0;
            } else {
                delete this.first.prev?.next;
                delete this.first.prev;
            }
        }
        return result;
    }
    isEmpty() {
        return !this.first;
    }
}
const getWithRecovery = ()=>{
    const tearDownOperations = /* @__PURE__ */ new Map();
    const setTeardown = (observable, cb)=>{
        tearDownOperations.set(observable, ()=>{
            tearDownOperations.delete(observable);
            cb();
        });
    };
    const teardown = (observable)=>{
        tearDownOperations.get(observable)?.();
    };
    const pendingTasks = new PendingTaskQueue();
    const unshift = pendingTasks.unshift.bind(pendingTasks);
    const push = pendingTasks.push.bind(pendingTasks);
    const addTask = (task, topPriority)=>{
        const fn = topPriority ? unshift : push;
        setTeardown(task.source$, fn(task));
    };
    const onEmptySlot = ()=>{
        const data = pendingTasks.pop();
        if (!data) return;
        tearDownOperations.delete(data.source$);
        process(data);
    };
    const process = (data)=>{
        const { source$, observer } = data;
        let isOperationLimit = false;
        const subscription = source$.subscribe({
            next (x) {
                observer.next(x);
            },
            error (e) {
                (isOperationLimit = e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationLimitError"]) ? addTask(data, true) : observer.error(e);
            },
            complete () {
                observer.complete();
            }
        });
        if (!subscription.closed) {
            setTeardown(source$, ()=>{
                subscription.unsubscribe();
                onEmptySlot();
            });
        } else if (!isOperationLimit) onEmptySlot();
    };
    const withRecovery = (topPriority = false)=>(source$)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
                const pendingTask = {
                    observer,
                    source$
                };
                if (pendingTasks.isEmpty()) {
                    process(pendingTask);
                } else {
                    addTask(pendingTask, topPriority);
                }
                return ()=>{
                    teardown(source$);
                };
            });
    const withNormalRecovery = withRecovery();
    const withRecoveryFn = (fn)=>(...args)=>withNormalRecovery(fn(...args));
    return {
        withRecovery,
        withRecoveryFn
    };
};
;
 //# sourceMappingURL=operationLimitRecovery.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BlockNotPinnedError": (()=>BlockNotPinnedError)
});
class BlockNotPinnedError extends Error {
    constructor(hash, label){
        super(`Block ${hash} is not pinned (${label})`);
        this.name = "BlockNotPinnedError";
    }
}
;
 //# sourceMappingURL=errors.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/optionalHash.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getWithOptionalhash$": (()=>getWithOptionalhash$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-client@0.4.1/node_modules/@polkadot-api/substrate-client/dist/esm/chainhead/errors.mjs [app-ssr] (ecmascript)");
;
;
;
const dynamicBlocks = /* @__PURE__ */ new Set([
    "best",
    "finalized",
    null
]);
const operable = (source$)=>{
    const result = source$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((e)=>e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationInaccessibleError"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timer"])(750).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["concatMap"])(()=>result)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(()=>e)));
    return result;
};
const getWithOptionalhash$ = (finalized$, best$, usingBlock)=>{
    return (fn)=>(hash, ...args)=>{
            if (!dynamicBlocks.has(hash)) return operable(fn(hash, ...args)).pipe(usingBlock(hash));
            const hash$ = hash === "best" ? best$ : finalized$;
            const result$ = hash$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((h)=>fn(h, ...args).pipe(usingBlock(h))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((e)=>{
                return e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"] ? result$ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(()=>e);
            }));
            return operable(result$);
        };
};
;
 //# sourceMappingURL=optionalHash.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/fromAbortControllerFn.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "fromAbortControllerFn": (()=>fromAbortControllerFn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const fromAbortControllerFn = (fn)=>(...args)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            let aborter = new AbortController();
            fn(...[
                ...args,
                aborter.signal
            ]).then((value)=>{
                observer.next(value);
                observer.complete();
            }, (error)=>{
                observer.error(error);
            });
            return ()=>{
                observer.unsubscribe();
                aborter.abort();
                aborter = void 0;
            };
        });
;
 //# sourceMappingURL=fromAbortControllerFn.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/lazyFollower.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "withLazyFollower": (()=>withLazyFollower)
});
const withLazyFollower = (getFollower)=>(key)=>(...args)=>getFollower()[key](...args);
;
 //# sourceMappingURL=lazyFollower.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/withStopRecovery.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "withStopRecovery": (()=>withStopRecovery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)");
;
;
function withStopRecovery(blocks$, fn, label) {
    return (hash, ...args)=>{
        const source$ = fn(hash, ...args);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            let sourceSub = null;
            let isSubscribed = false;
            const performSourceSub = ()=>{
                if (isSubscribed) return;
                isSubscribed = true;
                sourceSub = source$.subscribe({
                    next: (v)=>observer.next(v),
                    error: (e)=>observer.error(e),
                    complete: ()=>observer.complete()
                });
                sourceSub.add(()=>{
                    isSubscribed = false;
                    sourceSub = null;
                });
            };
            let isRecovering = false;
            const blockSub = blocks$.subscribe({
                next: (v)=>{
                    const block = v.blocks.get(hash);
                    if (!block) {
                        if (isRecovering) {
                            observer.error(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"](hash, label));
                        }
                    } else if (block.recovering) {
                        sourceSub?.unsubscribe();
                    } else {
                        performSourceSub();
                    }
                    isRecovering = v.recovering;
                },
                error: (e)=>observer.error(e)
            });
            return ()=>{
                blockSub.unsubscribe();
                sourceSub?.unsubscribe();
            };
        });
    };
}
;
 //# sourceMappingURL=withStopRecovery.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/new-blocks.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getNewBlocks$": (()=>getNewBlocks$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const getNewBlocks$ = (pinnedBlocks$)=>pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scan"])(({ reportedBlocks: prevReportedBlocks }, { blocks })=>{
        const reportedBlocks = new Set(blocks.keys());
        const newBlocks = [];
        if (reportedBlocks.size > prevReportedBlocks.size) {
            blocks.forEach(({ hash, number, parent })=>{
                if (!prevReportedBlocks.has(hash)) {
                    newBlocks.push({
                        hash,
                        number,
                        parent
                    });
                }
            });
        }
        return {
            reportedBlocks,
            newBlocks
        };
    }, {
        reportedBlocks: /* @__PURE__ */ new Set(),
        newBlocks: new Array(0)
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(({ newBlocks })=>newBlocks), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["share"])());
;
 //# sourceMappingURL=new-blocks.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/storage-queries.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getRecoveralStorage$": (()=>getRecoveralStorage$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const getRecoveralStorage$ = (getFollower, withRecovery)=>{
    const recoveralStorage$ = (hash, queries, childTrie, isHighPriority)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>getFollower().storageSubscription(hash, queries, childTrie ?? null, (items)=>{
                observer.next(items);
            }, (error)=>{
                observer.error(error);
            }, ()=>{
                observer.complete();
            }, (nDiscarded)=>{
                if (nDiscarded > 0) observer.next(recoveralStorage$(hash, queries.slice(-nDiscarded), childTrie, true));
            })).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeAll"])(), withRecovery(isHighPriority));
    return recoveralStorage$;
};
;
 //# sourceMappingURL=storage-queries.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/follow.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getFollow$": (()=>getFollow$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$blockHeader$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/blockHeader.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-client@0.4.1/node_modules/@polkadot-api/substrate-client/dist/esm/chainhead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
;
;
const withInitializedNumber = (getHeader)=>(source$)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            let pending = null;
            return source$.subscribe({
                next (event) {
                    if (event.type === "initialized") {
                        pending = [];
                        getHeader(event.finalizedBlockHashes[0]).then((header)=>{
                            if (!observer.closed) {
                                observer.next({
                                    ...event,
                                    number: header.number,
                                    parentHash: header.parentHash
                                });
                                pending.forEach((e)=>{
                                    observer.next(e);
                                });
                                pending = null;
                            }
                        }).catch((e)=>{
                            if (!observer.closed) observer.error(e);
                        });
                    } else if (pending) pending.push(event);
                    else observer.next(event);
                },
                error (e) {
                    observer.error(e);
                },
                complete () {
                    observer.complete();
                }
            });
        });
const getFollow$ = (chainHead)=>{
    let follower = null;
    let unfollow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    const getFollower = ()=>{
        if (!follower) throw new Error("Missing chainHead subscription");
        return follower;
    };
    const getHeader = (hash)=>getFollower().header(hash).then(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$blockHeader$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blockHeader"].dec);
    const follow$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["connectable"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
        follower = chainHead(true, (e)=>{
            observer.next(e);
        }, (e)=>{
            follower = null;
            observer.error(e);
        });
        unfollow = ()=>{
            observer.complete();
            follower?.unfollow();
        };
    }).pipe(withInitializedNumber(getHeader), retryChainHeadError()));
    const startFollow = ()=>{
        follow$.connect();
        return ()=>{
            unfollow();
        };
    };
    return {
        getHeader,
        getFollower,
        startFollow,
        follow$
    };
};
const retryChainHeadError = ()=>(source$)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            const subscription = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subscription"]();
            const subscribe = ()=>source$.subscribe({
                    next: (v)=>observer.next(v),
                    error: (e)=>{
                        subscription.add(subscribe());
                        if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StopError"]) {
                            observer.next({
                                type: "stop-error"
                            });
                        } else {
                            console.warn("ChainHead follow request failed, retrying\u2026", e);
                        }
                    },
                    complete: ()=>observer.complete()
                });
            subscription.add(subscribe());
            return subscription;
        });
;
 //# sourceMappingURL=follow.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/get-raw-metadta.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getRawMetadata$": (()=>getRawMetadata$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/shaped.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/scale-ts@1.6.1/node_modules/scale-ts/dist/scale-ts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
;
;
const versionedArgs = (v)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"].enc(v));
const opaqueBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bytes"])();
const optionalOpaqueBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Option"])(opaqueBytes);
const u32ListDecoder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u32"]).dec;
const getRawMetadata$ = (call$)=>{
    const versions$ = call$("Metadata_metadata_versions", "").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(u32ListDecoder), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])([
            14
        ])));
    const versioned$ = (availableVersions)=>{
        const [v] = availableVersions.filter((x)=>x > 13 && x < 17).sort((a, b)=>b - a);
        return v === 14 ? call$("Metadata_metadata", "").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(opaqueBytes.dec)) : call$("Metadata_metadata_at_version", versionedArgs(v)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>optionalOpaqueBytes.dec(x)));
    };
    return versions$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(versioned$));
};
;
 //# sourceMappingURL=get-raw-metadta.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/create-metadata-ctx.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createRuntimeCtx": (()=>createRuntimeCtx)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$AccountId$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/AccountId.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/scale-ts@1.6.1/node_modules/scale-ts/dist/scale-ts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/shaped.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$compact$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/compact.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$extrinsics$2f$extrinsic$2d$format$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/extrinsics/extrinsic-format.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$builders$40$0$2e$12$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$builders$2f$dist$2f$esm$2f$lookups$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-builders@0.12.2/node_modules/@polkadot-api/metadata-builders/dist/esm/lookups.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$builders$40$0$2e$12$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$builders$2f$dist$2f$esm$2f$dynamic$2d$builder$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+metadata-builders@0.12.2/node_modules/@polkadot-api/metadata-builders/dist/esm/dynamic-builder.mjs [app-ssr] (ecmascript)");
;
;
const CHECK_MORTALITY = "CheckMortality";
const createRuntimeCtx = (metadata, metadataRaw, codeHash)=>{
    const lookup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$builders$40$0$2e$12$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$builders$2f$dist$2f$esm$2f$lookups$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLookupFn"])(metadata);
    const dynamicBuilder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$metadata$2d$builders$40$0$2e$12$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$metadata$2d$builders$2f$dist$2f$esm$2f$dynamic$2d$builder$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDynamicBuilder"])(lookup);
    const events = dynamicBuilder.buildStorage("System", "Events");
    const assetPayment = metadata.extrinsic.signedExtensions.find((x)=>x.identifier === "ChargeAssetTxPayment");
    let assetId = null;
    if (assetPayment) {
        const assetTxPayment = lookup(assetPayment.type);
        if (assetTxPayment.type === "struct") {
            const optionalAssetId = assetTxPayment.value.asset_id;
            if (optionalAssetId.type === "option") assetId = optionalAssetId.value.id;
        }
    }
    const extrinsicDecoder = getExtrinsicDecoder(lookup.metadata, dynamicBuilder);
    const getMortalityFromTx = (tx)=>{
        const decodedExt = extrinsicDecoder(tx);
        return "extra" in decodedExt && decodedExt.extra[CHECK_MORTALITY] || {
            mortal: false
        };
    };
    return {
        assetId,
        metadataRaw,
        codeHash,
        lookup,
        dynamicBuilder,
        events: {
            key: events.keys.enc(),
            dec: events.value.dec
        },
        accountId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$AccountId$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccountId"])(dynamicBuilder.ss58Prefix),
        getMortalityFromTx
    };
};
const allBytesDec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Bytes"])(Infinity).dec;
const mortalDecoder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enhanceDecoder"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u16"][1], (input)=>{
    const period = 2 << input % (1 << 4);
    const factor = Math.max(period >> 12, 1);
    const phase = (input >> 4) * factor;
    return {
        mortal: true,
        period,
        phase
    };
});
const mortalityDecoder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDecoder"])((value)=>{
    const firstByte = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"].dec(value);
    if (firstByte === 0) return {
        mortal: false
    };
    const secondByte = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"].dec(value);
    return mortalDecoder(Uint8Array.from([
        firstByte,
        secondByte
    ]));
});
const getExtrinsicDecoder = (metadata, dynamicBuilder)=>{
    const innerExtra = Object.fromEntries(metadata.extrinsic.signedExtensions.map((x)=>[
            x.identifier,
            x.identifier === CHECK_MORTALITY ? mortalityDecoder : dynamicBuilder.buildDefinition(x.type)[1]
        ]));
    let address;
    let signature;
    const { extrinsic } = metadata;
    if ("address" in extrinsic) {
        address = dynamicBuilder.buildDefinition(extrinsic.address)[1];
        signature = dynamicBuilder.buildDefinition(extrinsic.signature)[1];
    } else {
        const params = metadata.lookup[extrinsic.type]?.params;
        const _call = params?.find((v)=>v.name === "Call")?.type;
        const addr = params?.find((v)=>v.name === "Address")?.type;
        const sig = params?.find((v)=>v.name === "Signature")?.type;
        if (_call == null || addr == null || sig == null) throw new Error("Call, Address and/or signature not found");
        address = dynamicBuilder.buildDefinition(addr)[1];
        signature = dynamicBuilder.buildDefinition(sig)[1];
    }
    const v4Body = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Struct"].dec({
        address,
        signature,
        extra: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Struct"].dec(innerExtra),
        callData: allBytesDec
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDecoder"])((data)=>{
        const len = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$compact$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["compactNumber"].dec(data);
        const { type, version } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$extrinsics$2f$extrinsic$2d$format$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrinsicFormat"][1](data);
        if (type === "bare") return {
            len,
            version,
            type,
            callData: allBytesDec(data)
        };
        if (type === "signed") return {
            len,
            version,
            type,
            ...v4Body(data)
        };
        const extensionVersion = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"].dec(data);
        let extraDec;
        if (metadata.version === 16) {
            const extensionsToApply = metadata.extrinsic.signedExtensionsByVersion.find(([x])=>x === extensionVersion);
            if (!extensionsToApply) throw new Error("Unexpected extension version");
            extraDec = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Struct"].dec(Object.fromEntries(Object.entries(innerExtra).filter((_, idx)=>extensionsToApply[1].includes(idx))));
        } else extraDec = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$shaped$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Struct"].dec(innerExtra);
        const extra = extraDec(data);
        return {
            len,
            type,
            version,
            extensionVersion,
            extra,
            callData: allBytesDec(data)
        };
    });
};
;
 //# sourceMappingURL=create-metadata-ctx.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/get-runtime-creator.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getRuntimeCreator": (()=>getRuntimeCreator)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$unified$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/metadata/unified.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$metadata$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/metadata/metadata.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-client@0.4.1/node_modules/@polkadot-api/substrate-client/dist/esm/chainhead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$get$2d$raw$2d$metadta$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/get-raw-metadta.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$create$2d$metadata$2d$ctx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/create-metadata-ctx.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
const withRecovery = (getHash)=>(fn)=>{
        const result = (...args)=>{
            const hash = getHash();
            return hash ? fn(hash, ...args).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((e)=>{
                if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"]) return result(...args);
                if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OperationInaccessibleError"]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timer"])(750).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(()=>result(...args)));
                throw e;
            })) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY"];
        };
        return result;
    };
const getRuntimeCreator = (call$, getCodeHash$, getCachedMetadata, setCachedMetadata)=>{
    const getMetadata$ = (codeHash$, rawMetadata$)=>codeHash$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((codeHash)=>getCachedMetadata(codeHash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(null)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((metadataRaw)=>metadataRaw ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(metadataRaw) : rawMetadata$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tap"])((raw)=>{
                    setCachedMetadata(codeHash, raw);
                }))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((metadataRaw)=>({
                    codeHash,
                    metadataRaw,
                    metadata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$unified$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unifyMetadata"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$metadata$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["metadata"].dec(metadataRaw))
                })))));
    return (getHash)=>{
        const enhancer = withRecovery(getHash);
        const initialHash = getHash();
        const usages = /* @__PURE__ */ new Set([
            initialHash
        ]);
        const codeHash$ = enhancer(getCodeHash$)().pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareReplay"])(1));
        const runtimeContext$ = getMetadata$(codeHash$, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$get$2d$raw$2d$metadta$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRawMetadata$"])(enhancer(call$))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(({ metadata, metadataRaw, codeHash })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$create$2d$metadata$2d$ctx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRuntimeCtx"])(metadata, metadataRaw, codeHash)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareReplay"])(1));
        const result = {
            at: initialHash,
            runtime: runtimeContext$,
            codeHash$,
            addBlock: (block)=>{
                usages.add(block);
                return result;
            },
            deleteBlocks: (blocks)=>{
                blocks.forEach((block)=>{
                    usages.delete(block);
                });
                return usages.size;
            },
            usages
        };
        runtimeContext$.subscribe({
            error () {}
        });
        return result;
    };
};
;
 //# sourceMappingURL=get-runtime-creator.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/shareLatest.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/pinned-blocks.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getPinnedBlocks$": (()=>getPinnedBlocks$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$withStopRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/withStopRecovery.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$get$2d$runtime$2d$creator$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/get-runtime-creator.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/shareLatest.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
const createRuntimeGetter = (pinned, startAt)=>{
    return ()=>{
        const runtime = pinned.runtimes[startAt];
        if (!runtime) return pinned.blocks.has(startAt) ? startAt : null;
        const winner = [
            ...runtime.usages
        ].at(-1);
        return winner ?? null;
    };
};
const deleteBlock = (blocks, blockHash)=>{
    blocks.get(blocks.get(blockHash).parent)?.children.delete(blockHash);
    blocks.delete(blockHash);
};
const deleteBlocks = (blocks, toDelete)=>{
    toDelete.forEach((hash)=>{
        deleteBlock(blocks.blocks, hash);
    });
    Object.entries(blocks.runtimes).map(([key, value])=>({
            key,
            usages: value.deleteBlocks(toDelete)
        })).filter((x)=>x.usages === 0).map((x)=>x.key).forEach((unusedRuntime)=>{
        delete blocks.runtimes[unusedRuntime];
    });
};
const getPinnedBlocks$ = (follow$, call$, getCodeHash$, getCachedMetadata$, setCachedMetadata, blockUsage$, onUnpin, deleteFromCache)=>{
    const cleanup$ = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subject"]();
    const cleanupEvt$ = cleanup$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exhaustMap"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timer"])(0)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(()=>({
            type: "cleanup"
        })));
    const pinnedBlocks$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])(blockUsage$, cleanupEvt$, follow$).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scan"])((acc, event)=>{
        const unpinAndDelete = (toUnpin)=>{
            deleteBlocks(acc, toUnpin);
            onUnpin(toUnpin);
        };
        switch(event.type){
            case "initialized":
                if (acc.recovering) {
                    const isConnected = event.finalizedBlockHashes.some((hash)=>acc.blocks.has(hash));
                    if (!isConnected) {
                        acc = getInitialPinnedBlocks();
                    }
                }
                const [finalizedHash] = event.finalizedBlockHashes.slice(-1);
                acc.finalized = acc.best = finalizedHash;
                const lastIdx = event.finalizedBlockHashes.length - 1;
                event.finalizedBlockHashes.forEach((hash, i)=>{
                    const preexistingBlock = acc.blocks.get(hash);
                    if (preexistingBlock) {
                        preexistingBlock.recovering = false;
                        preexistingBlock.unpinnable = i !== lastIdx;
                    } else {
                        acc.blocks.set(hash, {
                            hash,
                            parent: i === 0 ? event.parentHash : event.finalizedBlockHashes[i - 1],
                            children: new Set(i === lastIdx ? [] : [
                                event.finalizedBlockHashes[i + 1]
                            ]),
                            unpinnable: i !== lastIdx,
                            runtime: hash,
                            refCount: 0,
                            number: event.number + i,
                            recovering: false
                        });
                    }
                });
                const finalizedRuntime = Object.values(acc.runtimes).find((runtime)=>runtime.usages.has(finalizedHash));
                acc.finalizedRuntime = finalizedRuntime ?? (acc.runtimes[finalizedHash] = getRuntime(createRuntimeGetter(acc, finalizedHash)));
                return acc;
            case "stop-error":
                for (const block of acc.blocks.values()){
                    block.recovering = true;
                }
                acc.recovering = true;
                return acc;
            case "newBlock":
                {
                    const { parentBlockHash: parent, blockHash: hash } = event;
                    if (acc.blocks.has(hash)) {
                        acc.blocks.get(hash).recovering = false;
                    } else {
                        const parentNode = acc.blocks.get(parent);
                        parentNode.children.add(hash);
                        const block = {
                            hash,
                            number: parentNode.number + 1,
                            parent,
                            children: /* @__PURE__ */ new Set(),
                            runtime: event.newRuntime ? hash : parentNode.runtime,
                            unpinnable: false,
                            refCount: 0,
                            recovering: false
                        };
                        acc.blocks.set(hash, block);
                        if (event.newRuntime) {
                            acc.runtimes[hash] = getRuntime(createRuntimeGetter(acc, hash));
                        }
                        acc.runtimes[block.runtime].addBlock(hash);
                    }
                    return acc;
                }
            case "bestBlockChanged":
                {
                    if (acc.recovering) {
                        for (const [hash, block] of acc.blocks){
                            if (block.recovering) {
                                deleteBlock(acc.blocks, hash);
                                deleteFromCache(hash);
                            }
                        }
                        acc.recovering = false;
                    }
                    acc.best = event.bestBlockHash;
                    return acc;
                }
            case "finalized":
                {
                    acc.finalized = event.finalizedBlockHashes.slice(-1)[0];
                    const { blocks } = acc;
                    if (blocks.get(acc.best).number < blocks.get(acc.finalized).number) acc.best = acc.finalized;
                    acc.finalizedRuntime = acc.runtimes[blocks.get(acc.finalized).runtime];
                    event.prunedBlockHashes.forEach((hash)=>{
                        const block = acc.blocks.get(hash);
                        if (block) {
                            block.unpinnable = true;
                        }
                    });
                    let current = blocks.get(blocks.get(acc.finalized).parent);
                    while(current && !current.unpinnable){
                        current.unpinnable = true;
                        current = blocks.get(current.parent);
                    }
                    cleanup$.next();
                    return acc;
                }
            case "cleanup":
                {
                    const toUnpin = [
                        ...acc.blocks.values()
                    ].filter(({ unpinnable, refCount })=>unpinnable && !refCount).map(({ hash })=>hash);
                    unpinAndDelete(toUnpin);
                    return acc;
                }
            case "blockUsage":
                {
                    if (!acc.blocks.has(event.value.hash)) return acc;
                    const block = acc.blocks.get(event.value.hash);
                    block.refCount += event.value.type === "hold" ? 1 : -1;
                    if (block.refCount === 0 && !block.recovering && block.unpinnable) {
                        const toUnpin = [
                            block.hash
                        ];
                        unpinAndDelete(toUnpin);
                    }
                    return acc;
                }
        }
    }, getInitialPinnedBlocks()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])((x)=>!!x.finalizedRuntime.runtime), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>({
            ...x
        })), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareLatest"]);
    const getRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$get$2d$runtime$2d$creator$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRuntimeCreator"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$withStopRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withStopRecovery"])(pinnedBlocks$, call$, "pinned-blocks"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$withStopRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withStopRecovery"])(pinnedBlocks$, getCodeHash$, "pinned-blocks"), getCachedMetadata$, setCachedMetadata);
    return pinnedBlocks$;
};
const getInitialPinnedBlocks = ()=>({
        best: "",
        finalized: "",
        runtimes: {},
        blocks: /* @__PURE__ */ new Map(),
        finalizedRuntime: {},
        recovering: false
    });
;
 //# sourceMappingURL=pinned-blocks.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/track-tx.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getTrackTx": (()=>getTrackTx)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const getTrackTx = (blocks$, getBody, getIsValid, getEvents)=>{
    const whileBlockPresent = (hash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["takeUntil"])(blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])(({ blocks })=>!blocks.has(hash))));
    const analyzeBlock = (hash, tx, alreadyPresent)=>{
        if (alreadyPresent) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])({
            hash,
            found: {
                type: false,
                validity: null
            }
        });
        const whilePresent = whileBlockPresent(hash);
        return getBody(hash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((txs)=>{
            const index = txs.indexOf(tx);
            return index > -1 ? whilePresent(getEvents(hash)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((events)=>({
                    hash,
                    found: {
                        type: true,
                        index,
                        events
                    }
                }))) : getIsValid(hash, tx).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((validity)=>({
                    hash,
                    found: {
                        type: false,
                        validity
                    }
                })));
        }), whilePresent);
    };
    const findInBranch = (hash, tx, alreadyPresent)=>analyzeBlock(hash, tx, alreadyPresent.has(hash)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((analyzed)=>{
            const { found } = analyzed;
            return found.type || found.validity?.success === false ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(analyzed) : blocks$.pipe(whileBlockPresent(hash), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((x)=>x.blocks.get(hash).children), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinct"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((hash2)=>findInBranch(hash2, tx, alreadyPresent)));
        }));
    return (tx)=>blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((x)=>findInBranch(x.finalized, tx, new Set(x.blocks.keys()))));
};
;
 //# sourceMappingURL=track-tx.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/validate-tx.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getValidateTx": (()=>getValidateTx)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/hex.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mergeUint8$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+utils@0.2.0/node_modules/@polkadot-api/utils/dist/esm/mergeUint8.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Variant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/scale/Variant.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/scale-ts@1.6.1/node_modules/scale-ts/dist/scale-ts.js [app-ssr] (ecmascript)");
;
;
;
const external = new Uint8Array([
    2
]);
const getValidateTxArgs = (tx, hash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toHex"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$mergeUint8$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeUint8"])([
        external,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(tx),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$utils$40$0$2e$2$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$utils$2f$dist$2f$esm$2f$hex$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromHex"])(hash)
    ]));
const TaggedTransactionQueue = "TaggedTransactionQueue";
const validateTransaction = "validate_transaction";
const [, defaultInvalidTxDecoder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Variant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Variant"])({
    InvalidTransaction: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Variant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Variant"])({
        Call: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        Payment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        Future: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        Stale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        BadProof: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        AncientBirthBlock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        ExhaustsResources: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        Custom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"],
        BadMandatory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        MandatoryValidation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        BadSigner: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"]
    }),
    UnknownTransaction: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$scale$2f$Variant$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Variant"])({
        CannotLookup: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        NoUnsignedValidator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_void"],
        Custom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"]
    })
});
const defaultValidateTxDecoder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDecoder"])((input)=>{
    const firstByte = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$scale$2d$ts$40$1$2e$6$2e$1$2f$node_modules$2f$scale$2d$ts$2f$dist$2f$scale$2d$ts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u8"].dec(input);
    if (firstByte > 1) throw new Error("Unable to decode validateTransaction result");
    if (!firstByte) return {
        success: true,
        value: void 0
    };
    let value;
    try {
        value = defaultInvalidTxDecoder(input);
    } catch (_) {
        value = {
            type: "UnknownInvalidTx"
        };
    }
    return {
        success: false,
        value
    };
});
const getValidateTx = (call$, getRuntimeContext)=>(blockHash, tx)=>{
        const decoder$ = getRuntimeContext(blockHash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((ctx)=>{
            try {
                return ctx.dynamicBuilder.buildRuntimeCall(TaggedTransactionQueue, validateTransaction).value[1];
            } catch (_) {
                return defaultValidateTxDecoder;
            }
        }));
        return call$(blockHash, `${TaggedTransactionQueue}_${validateTransaction}`, getValidateTxArgs(tx, blockHash)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withLatestFrom"])(decoder$), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(([result, decoder])=>decoder(result)));
    };
;
 //# sourceMappingURL=validate-tx.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/with-default-value.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "withDefaultValue": (()=>withDefaultValue)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const withDefaultValue = (defaultValue)=>(source$)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            let hasEmited = false;
            const subscription = source$.subscribe({
                next (v) {
                    hasEmited = true;
                    observer.next(v);
                },
                error (e) {
                    observer.error(e);
                },
                complete () {
                    observer.complete();
                }
            });
            if (!hasEmited) observer.next(defaultValue);
            return subscription;
        });
;
 //# sourceMappingURL=with-default-value.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/delay-unsubscription.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "delayUnsubscription": (()=>delayUnsubscription)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const delayUnsubscription = (ms)=>(source)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            const subscription = source.subscribe({
                next (v) {
                    observer.next(v);
                },
                error (e) {
                    observer.error(e);
                },
                complete () {
                    observer.complete();
                }
            });
            const unsubscribe = ()=>subscription.unsubscribe();
            return ()=>{
                Promise.resolve().then(unsubscribe);
            };
        });
;
 //# sourceMappingURL=delay-unsubscription.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/concatMapEager.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "concatMapEager": (()=>concatMapEager)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const concatMapEager = (mapper, concurrent = Infinity)=>(source$)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
            let topSubscription;
            const queues = /* @__PURE__ */ new Map();
            const innerSubscriptions = /* @__PURE__ */ new Map();
            const results = /* @__PURE__ */ new Map();
            let mapperIdx = 0;
            let subscriptionIdx = 0;
            let observerIdx = 0;
            const nextSubscription = ()=>{
                const inner$ = queues.get(subscriptionIdx);
                if (!inner$) {
                    if (innerSubscriptions.size === 0 && (typeof topSubscription === "undefined" || topSubscription.closed)) {
                        observer.complete();
                    }
                    return;
                }
                const idx = subscriptionIdx++;
                queues.delete(idx);
                if (observerIdx !== idx) {
                    results.set(idx, []);
                }
                let isCompleted = false;
                let subscription = inner$.subscribe({
                    next (x) {
                        if (observerIdx === idx) {
                            observer.next(x);
                        } else {
                            results.get(idx).push(x);
                        }
                    },
                    complete () {
                        isCompleted = true;
                        innerSubscriptions.delete(idx);
                        if (idx === observerIdx) {
                            observerIdx++;
                            while(results.has(observerIdx)){
                                results.get(observerIdx).forEach((x)=>observer.next(x));
                                results.delete(observerIdx);
                                if (innerSubscriptions.has(observerIdx)) {
                                    break;
                                }
                                observerIdx++;
                            }
                        }
                        nextSubscription();
                    },
                    error (e) {
                        observer.error(e);
                    }
                });
                if (!isCompleted) innerSubscriptions.set(idx, subscription);
            };
            topSubscription = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subscription"]();
            topSubscription.add(source$.subscribe({
                next (outterValue) {
                    const idx = mapperIdx++;
                    queues.set(idx, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(()=>mapper(outterValue, idx)));
                    if (innerSubscriptions.size < concurrent) {
                        nextSubscription();
                    }
                },
                error (e) {
                    observer.error(e);
                },
                complete () {
                    if (innerSubscriptions.size === 0) {
                        observer.complete();
                    }
                }
            }));
            return ()=>{
                innerSubscriptions.forEach((subscription)=>subscription.unsubscribe());
                topSubscription.unsubscribe();
                queues.clear();
                results.clear();
            };
        });
;
 //# sourceMappingURL=concatMapEager.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/chainHead.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getChainHead$": (()=>getChainHead$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-client@0.4.1/node_modules/@polkadot-api/substrate-client/dist/esm/chainhead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$operationLimitRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/operationLimitRecovery.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$optionalHash$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/optionalHash.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/fromAbortControllerFn.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$lazyFollower$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/lazyFollower.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$withStopRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/withStopRecovery.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$new$2d$blocks$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/new-blocks.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$storage$2d$queries$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/storage-queries.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$follow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/follow.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$pinned$2d$blocks$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/pinned-blocks.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$track$2d$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/track-tx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$validate$2d$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/validate-tx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$default$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/with-default-value.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$delay$2d$unsubscription$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/delay-unsubscription.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$concatMapEager$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/concatMapEager.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/shareLatest.mjs [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
const toBlockInfo = ({ hash, number, parent })=>({
        hash,
        number,
        parent
    });
const getChainHead$ = (chainHead, getCachedMetadata, setCachedMetadata)=>{
    const { getFollower, startFollow, follow$, getHeader } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$follow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFollow$"])(chainHead);
    const lazyFollower = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$lazyFollower$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withLazyFollower"])(getFollower);
    const { withRecovery, withRecoveryFn } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$operationLimitRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWithRecovery"])();
    const blockUsage$ = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subject"]();
    const holdBlock = (hash)=>{
        blockUsage$.next({
            type: "blockUsage",
            value: {
                type: "hold",
                hash
            }
        });
        return ()=>{
            setTimeout(()=>{
                blockUsage$.next({
                    type: "blockUsage",
                    value: {
                        type: "release",
                        hash
                    }
                });
            }, 0);
        };
    };
    const usingBlock = (blockHash)=>(base)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
                const release = holdBlock(blockHash);
                const subscription = base.subscribe(observer);
                subscription.add(release);
                return subscription;
            });
    const withRefcount = (fn)=>(hash, ...args)=>fn(hash, ...args).pipe(usingBlock(hash));
    const withInMemory = (fn, label)=>(hash, ...args)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>{
                let isPresent = false;
                pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1)).subscribe((blocks)=>{
                    isPresent = blocks.blocks.has(hash);
                });
                return isPresent ? fn(hash, ...args).subscribe(observer) : observer.error(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"](hash, label));
            });
    const unpin = (hashes)=>getFollower().unpin(hashes).catch((e)=>{
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$client$2f$dist$2f$esm$2f$chainhead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DisjointError"]) return;
            throw e;
        });
    const commonEnhancer = (fn, label)=>withInMemory(withRefcount((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$withStopRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withStopRecovery"])(pinnedBlocks$, withRecoveryFn((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromAbortControllerFn"])(fn)), `stop-${label}`)), label);
    const cache = /* @__PURE__ */ new Map();
    const stg = withRefcount(withRecoveryFn((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromAbortControllerFn"])(lazyFollower("storage"))));
    const getCodeHash = (blockHash)=>// ":code" => "0x3a636f6465"
        stg(blockHash, "hash", "0x3a636f6465", null).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>x));
    const pinnedBlocks$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$streams$2f$pinned$2d$blocks$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPinnedBlocks$"])(follow$, withRefcount(withRecoveryFn((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromAbortControllerFn"])(lazyFollower("call")))), getCodeHash, getCachedMetadata, setCachedMetadata, blockUsage$, (blocks)=>{
        unpin(blocks);
        blocks.forEach((hash)=>{
            cache.delete(hash);
        });
    }, (block)=>{
        cache.delete(block);
    });
    const getRuntimeContext$ = withInMemory(withRefcount((hash)=>pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((pinned)=>pinned.runtimes[pinned.blocks.get(hash).runtime].runtime))), "getRuntimeCtx");
    const withRuntime = (mapper)=>(source$)=>source$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$concatMapEager$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["concatMapEager"])((x)=>getRuntimeContext$(mapper(x)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((runtime)=>[
                        x,
                        runtime
                    ]))));
    const upsertCachedStream = (hash, key, stream)=>{
        const hashCache = cache.get(hash) ?? /* @__PURE__ */ new Map();
        const cached = hashCache.get(key);
        if (cached) return cached;
        cache.set(hash, hashCache);
        let connector;
        const result = stream.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["share"])({
            connector: ()=>connector = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReplaySubject"]()
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tap"])({
            complete () {
                hashCache.set(key, connector);
            }
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$delay$2d$unsubscription$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["delayUnsubscription"])());
        hashCache.set(key, result);
        return result;
    };
    const finalized$ = pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])((x)=>!x.recovering), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.finalized === b.finalized), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scan"])((acc, value)=>{
        let current = value.blocks.get(value.finalized);
        const result = [
            current
        ];
        const latest = acc.at(-1);
        if (!latest) return result;
        while(current.number > latest.number + 1){
            current = value.blocks.get(current.parent);
            if (!current) break;
            result.unshift(current);
        }
        return result;
    }, []), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeAll"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(toBlockInfo), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareLatest"]);
    const best$ = pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.best === b.best), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((pinned)=>toBlockInfo(pinned.blocks.get(pinned.best))), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareLatest"]);
    const bestBlocks$ = pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])((x)=>!x.recovering), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((prev, current)=>prev.finalized === current.finalized && prev.best === current.best), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scan"])((acc, pinned)=>{
        const getBlockInfo = (hash)=>acc.get(hash) || toBlockInfo(pinned.blocks.get(hash));
        const best = getBlockInfo(pinned.best);
        const finalized = getBlockInfo(pinned.finalized);
        const len = best.number - finalized.number + 1;
        const result = new Array(len);
        for(let i = 0, hash = best.hash; i < len; i++){
            result[i] = getBlockInfo(hash);
            hash = result[i].parent;
        }
        return new Map(result.map((b)=>[
                b.hash,
                b
            ]));
    }, /* @__PURE__ */ new Map()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>[
            ...x.values()
        ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareLatest"]);
    const runtime$ = pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.finalizedRuntime === b.finalizedRuntime), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["switchMap"])(({ finalizedRuntime: { runtime } })=>runtime.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$with$2d$default$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withDefaultValue"])(null))), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$shareLatest$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareLatest"]);
    const metadata$ = runtime$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>x?.lookup.metadata ?? null));
    const withOptionalHash$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$optionalHash$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWithOptionalhash$"])(finalized$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((b)=>b.hash)), best$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((b)=>b.hash)), usingBlock);
    const _body$ = commonEnhancer(lazyFollower("body"), "body");
    const body$ = (hash)=>upsertCachedStream(hash, "body", _body$(hash));
    const _storage$ = commonEnhancer(lazyFollower("storage"), "storage");
    const storage$ = withOptionalHash$(withInMemory((hash, type, keyMapper, childTrie = null, mapper)=>pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((pinned)=>pinned.runtimes[pinned.blocks.get(hash).runtime].runtime), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((ctx)=>{
            const key = keyMapper(ctx);
            return upsertCachedStream(hash, `storage-${type}-${key}-${childTrie ?? ""}`, _storage$(hash, type, key, childTrie)).pipe(mapper ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((raw)=>mapper(raw, ctx)) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["identity"]);
        })), "storage"));
    const recoveralStorage$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$storage$2d$queries$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRecoveralStorage$"])(getFollower, withRecovery);
    const storageQueries$ = withOptionalHash$(withInMemory((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$withStopRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withStopRecovery"])(pinnedBlocks$, (hash, queries, childTrie)=>recoveralStorage$(hash, queries, childTrie ?? null, false), `storageQueries`), "storageQueries"));
    const header$ = withOptionalHash$(withInMemory((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$withStopRecovery$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withStopRecovery"])(pinnedBlocks$, (hash)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(()=>getHeader(hash)), "header"), "header"));
    const eventsAt$ = (hash)=>storage$(hash, "value", (ctx)=>ctx.events.key, null, (x, ctx)=>ctx.events.dec(x));
    const __call$ = commonEnhancer(lazyFollower("call"), "call");
    const call$ = withOptionalHash$((hash, fn, args)=>upsertCachedStream(hash, `call-${fn}-${args}`, __call$(hash, fn, args)));
    const validateTx$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$validate$2d$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getValidateTx"])(call$, getRuntimeContext$);
    const innerBody$ = (hash)=>upsertCachedStream(hash, "body", _body$(hash));
    const trackTx$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$track$2d$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTrackTx"])(pinnedBlocks$, innerBody$, validateTx$, eventsAt$);
    const trackTxWithoutEvents$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$track$2d$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTrackTx"])(pinnedBlocks$, innerBody$, validateTx$, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])());
    const genesis$ = runtime$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])(Boolean), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((runtime)=>{
        const { enc } = runtime.dynamicBuilder.buildStorage("System", "BlockHash").keys;
        let key;
        try {
            key = enc(0);
        } catch  {
            key = enc(0n);
        }
        return storage$(null, "value", ()=>key, null);
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shareReplay"])(1));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])(runtime$, bestBlocks$).subscribe({
        error () {}
    });
    let unfollow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    let started = false;
    let nSubscribers = 0;
    const start = (_nSubscribers)=>{
        nSubscribers += _nSubscribers;
        started = true;
        unfollow = startFollow();
    };
    const getRuntime$ = (codeHash)=>pinnedBlocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])(({ runtimes })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])(...Object.values(runtimes).map((runtime)=>runtime.codeHash$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((_codehash)=>codeHash === _codehash ? runtime.runtime : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY"])))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["endWith"])(null), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["take"])(1))));
    return [
        {
            follow$,
            finalized$,
            best$,
            bestBlocks$,
            newBlocks$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$new$2d$blocks$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNewBlocks$"])(pinnedBlocks$),
            runtime$,
            metadata$,
            genesis$,
            getRuntime$,
            header$,
            body$,
            call$,
            storage$,
            storageQueries$,
            eventsAt$,
            holdBlock,
            trackTx$,
            trackTxWithoutEvents$,
            validateTx$,
            pinnedBlocks$,
            withRuntime,
            getRuntimeContext$: withOptionalHash$(getRuntimeContext$),
            unfollow: ()=>{
                if (started == null) return;
                nSubscribers--;
                if (started && !nSubscribers) {
                    started = null;
                    unfollow();
                    unfollow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
                }
            }
        },
        start
    ];
};
;
 //# sourceMappingURL=chainHead.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/tx.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>getBroadcastTx$)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
var getBroadcastTx$ = (baseTransaction)=>(transaction)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>baseTransaction(transaction, (e)=>{
                observer.error(e);
            }));
;
 //# sourceMappingURL=tx.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/archive/archive.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getArchive": (()=>getArchive)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/enhancers/fromAbortControllerFn.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$blockHeader$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/blockHeader.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$unified$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/metadata/unified.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$metadata$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+substrate-bindings@0.14.0/node_modules/@polkadot-api/substrate-bindings/dist/esm/codecs/metadata/metadata.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$get$2d$raw$2d$metadta$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/get-raw-metadta.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$create$2d$metadata$2d$ctx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/create-metadata-ctx.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
const getArchive = ({ storageSubscription, ...archive })=>(getRuntime)=>{
        const runtimes = {};
        const rawStorage$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromAbortControllerFn"])(archive.storage);
        const call$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromAbortControllerFn"])(archive.call);
        const rawHeader$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromAbortControllerFn"])(archive.header);
        const body$ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$enhancers$2f$fromAbortControllerFn$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromAbortControllerFn"])(archive.body);
        const header$ = (blockHash)=>rawHeader$(blockHash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$blockHeader$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blockHeader"][1]));
        const getCodeHash = (blockHash)=>// ":code" => "0x3a636f6465"
            rawStorage$(blockHash, "hash", "0x3a636f6465", null).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>x));
        const getRuntime$ = (codeHash, blockHash)=>getRuntime(codeHash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(null)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((result)=>result ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(result) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$get$2d$raw$2d$metadta$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRawMetadata$"])((...args)=>call$(blockHash, ...args)).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((rawMetadata)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$utils$2f$create$2d$metadata$2d$ctx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRuntimeCtx"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$unified$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unifyMetadata"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$substrate$2d$bindings$40$0$2e$14$2e$0$2f$node_modules$2f40$polkadot$2d$api$2f$substrate$2d$bindings$2f$dist$2f$esm$2f$codecs$2f$metadata$2f$metadata$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["metadata"].dec(rawMetadata)), rawMetadata, codeHash)))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tap"])((runtime)=>{
                runtimes[codeHash] = runtime;
            }));
        const getRuntimeContext$ = (blockHash)=>getCodeHash(blockHash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((codeHash)=>{
                const runtime = runtimes[codeHash];
                return runtime ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(runtime) : getRuntime$(codeHash, blockHash);
            }));
        const storage$ = (hash, type, keyMapper, childTrie = null, mapper)=>getRuntimeContext$(hash).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeMap"])((ctx)=>rawStorage$(hash, type, keyMapper(ctx), childTrie).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((x)=>mapper ? mapper(x, ctx) : x))));
        const storageQueries$ = (hash, queries, childTrie)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Observable"]((observer)=>storageSubscription(hash, queries, childTrie || null, (item)=>observer.next(item), (error)=>observer.error(error), ()=>{
                    observer.complete();
                }));
        const eventsAt$ = (hash)=>storage$(hash, "value", (ctx)=>ctx.events.key, null, (x, ctx)=>ctx.events.dec(x));
        return {
            body$,
            header$,
            storage$,
            storageQueries$,
            call$,
            eventsAt$,
            getRuntimeContext$
        };
    };
;
 //# sourceMappingURL=archive.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/getObservableClient.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getObservableClient": (()=>getObservableClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$chainHead$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/chainHead.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/tx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$archive$2f$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/archive/archive.mjs [app-ssr] (ecmascript)");
;
;
;
;
const ofNullFn = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["of"])(null);
const clientCache = /* @__PURE__ */ new Map();
const getObservableClient = (substrateClient, cache = {})=>{
    const { getMetadata, setMetadata } = cache;
    const cached = clientCache.get(substrateClient);
    if (cached) {
        cached.refCount++;
        return cached.client;
    }
    const destroy = ()=>{
        const cached2 = clientCache.get(substrateClient);
        if (!cached2 || cached2.refCount <= 1) {
            clientCache.delete(substrateClient);
            substrateClient.destroy();
        } else {
            cached2.refCount--;
        }
    };
    let cachedChainhead = null;
    let currentSubscribers = 0;
    let expectedSubscribers = null;
    const client = {
        chainHead$: (_expectedSubscribers)=>{
            currentSubscribers++;
            expectedSubscribers || (expectedSubscribers = _expectedSubscribers || 1);
            cachedChainhead || (cachedChainhead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$chainHead$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getChainHead$"])(substrateClient.chainHead, getMetadata || ofNullFn, setMetadata || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]));
            const [result, start] = cachedChainhead;
            if (expectedSubscribers === currentSubscribers) {
                const copiedCurrentSubscribers = currentSubscribers;
                currentSubscribers = 0;
                expectedSubscribers = null;
                cachedChainhead = null;
                start(copiedCurrentSubscribers);
            }
            return result;
        },
        archive: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$archive$2f$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getArchive"])(substrateClient.archive),
        broadcastTx$: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$tx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(substrateClient.transaction),
        destroy
    };
    clientCache.set(substrateClient, {
        client,
        refCount: 1
    });
    return client;
};
;
 //# sourceMappingURL=getObservableClient.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/utils/with-archive.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "withArchive": (()=>withArchive)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/errors.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
const withArchive = (chainHeadFn, archiveFn)=>(blokHash, ...args)=>chainHeadFn(blokHash, ...args).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((e)=>{
            if (!(e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$polkadot$2d$api$2b$observable$2d$client$40$0$2e$13$2e$0_$40$polkadot$2d$api$2b$substrate$2d$client$40$0$2e$4$2e$1_rxjs$40$7$2e$8$2e$2$2f$node_modules$2f40$polkadot$2d$api$2f$observable$2d$client$2f$dist$2f$esm$2f$chainHead$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockNotPinnedError"])) throw e;
            return archiveFn(blokHash, ...args).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["catchError"])((actualErr)=>{
                console.warn(actualErr);
                throw e;
            }));
        }));
;
 //# sourceMappingURL=with-archive.mjs.map
}}),
"[project]/node_modules/.pnpm/@polkadot-api+observable-client@0.13.0_@polkadot-api+substrate-client@0.4.1_rxjs@7.8.2/node_modules/@polkadot-api/observable-client/dist/esm/chainHead/streams/block-operations.mjs [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "isBestOrFinalizedBlock": (()=>isBestOrFinalizedBlock)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rxjs@7.8.2/node_modules/rxjs/dist/cjs/index.js [app-ssr] (ecmascript)");
;
const isBestOrFinalizedBlock = (blocks$, blockHash)=>blocks$.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["takeWhile"])((b)=>b.blocks.has(blockHash)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])((a, b)=>a.finalized === b.finalized && a.best === b.best), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((pinned)=>{
        if (pinned.blocks.get(blockHash).number > pinned.blocks.get(pinned.best).number) return null;
        const { number } = pinned.blocks.get(blockHash);
        let current = pinned.blocks.get(pinned.best);
        let isFinalized = pinned.finalized === current.hash;
        while(current.number > number){
            current = pinned.blocks.get(current.parent);
            isFinalized = isFinalized || pinned.finalized === current.hash;
        }
        if (isFinalized) return "finalized";
        return current.hash === blockHash ? "best" : null;
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["distinctUntilChanged"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rxjs$40$7$2e$8$2e$2$2f$node_modules$2f$rxjs$2f$dist$2f$cjs$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["takeWhile"])((x)=>x !== "finalized", true));
;
 //# sourceMappingURL=block-operations.mjs.map
}}),

};

//# sourceMappingURL=cb846_%40polkadot-api_observable-client_dist_esm_74a1f598._.js.map