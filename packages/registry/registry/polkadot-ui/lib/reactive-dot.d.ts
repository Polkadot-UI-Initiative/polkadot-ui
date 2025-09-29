import { config } from "./reactive-dot.config";

declare module "@reactive-dot/core" {
  export interface Register {
    config: typeof config;
  }
}
