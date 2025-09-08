# Work Log: 2025-09-08 - Sandpack SSR `window` Reference Investigation

## 1. Problem Definition & Goal

The initial problem was a `ReferenceError: window is not defined` error occurring during the server-side rendering (SSR) build of a RedwoodSDK project. This error was triggered by the inclusion of the Sandpack component when using the `template="node"` option, which leverages the Nodebox client.

The error did not occur in the Vite development server, only in the production SSR build. This suggested a fundamental difference in how dependencies were being bundled and executed between the two environments.

The goal was to understand why this browser-specific code was being included and executed in the SSR bundle, and to replicate the issue in an isolated, vanilla Vite project to confirm the root cause.

## 2. Investigation: Isolating the Issue

The first step was to create a minimal reproduction case outside of the RedwoodSDK framework to determine if the issue was with Sandpack itself or with our framework's specific build configuration.

### Attempt #1: Vanilla Vite SSR Project

A new project was created using `create-vite` with the `react-ts` template. A basic SSR setup was configured with a simple Express server to render the application.

-   An `<App>` component was created to render a `<Sandpack>` instance with `template="node"`.
-   A build script (`build:ssr`) and a test script (`test:ssr`) were added to build and execute the SSR output in a Node.js environment.

**Outcome:** The vanilla Vite project's SSR build completed and ran successfully. The `test:ssr` script rendered the HTML without any `window` reference errors. A `grep` of the output bundle confirmed that the problematic `window.localStorage` code was present, but it was not being executed. This proved the issue was not with Sandpack alone, but with the interaction between Sandpack and the build environment.

## 3. The Hypothesis: `inlineDynamicImports`

The key difference between the vanilla Vite build and the RedwoodSDK build was hypothesized to be the `inlineDynamicImports` Rollup option, which RedwoodSDK uses.

**The Theory:**
1.  Sandpack's `sandpack-client` uses dynamic `import()` to lazy-load the appropriate client (`runtime`, `static`, or `node`) based on the `template` prop.
2.  In a standard Vite build (`inlineDynamicImports: false`), these dynamic imports remain as separate chunks. During SSR, the `import("./node")` for the Nodebox client is not executed, so the code containing the `window` reference is never loaded.
3.  In a RedwoodSDK build (`inlineDynamicImports: true`), Vite's bundler inlines the content of these dynamic imports directly into the main SSR bundle. This means the browser-specific Nodebox client code is present and executed immediately when the bundle is loaded by Node.js.

## 4. Proving the Hypothesis

To test this theory, the vanilla Vite project's configuration was modified to match the RedwoodSDK environment.

### Attempt #2: Simulating the RedwoodSDK Build Configuration

The `vite.config.ts` in the `sandpack-ssr-debug` project was modified:
1.  **`build.rollupOptions.output.inlineDynamicImports: true`** was added. This immediately caused the SSR bundle size to increase significantly, confirming that previously separate chunks were now being inlined.
2.  **`ssr.noExternal: true`** was added to ensure all dependencies, including Sandpack, were bundled rather than being treated as external. This fully replicated the target environment.

**Outcome:** The build now failed with a `self is not defined` error. This was a different error, but it was still a browser-global reference error, which confirmed that inlining was pulling browser-specific code into the SSR bundle.

### Attempt #3: Reaching the Exact Error with Polyfills

To get past the initial `self is not defined` error and prove the `window` reference was the ultimate problem, minimal polyfills for browser globals (`self`, `navigator`, `document`) were added to the top of the `entry-server.tsx` file.

**Outcome:**
**Success!** With the preliminary errors bypassed, the `test:ssr` script failed with the exact, original error:

```
❌ SSR Error: window is not defined
...
ReferenceError: window is not defined
    at file:///.../dist/entry-server.js:55065:12
```

A `grep` of the final bundle confirmed the presence of `var FLAG = window.localStorage["CSB_EMULATOR_DEBUG"];` at the corresponding line.

## 5. Conclusion

The investigation successfully identified and reproduced the issue. The root cause is a direct result of Vite's `inlineDynamicImports` build option interacting with Sandpack's client-side code.

-   **Root Cause:** The combination of `inlineDynamicImports: true` and `noExternal: true` forces Sandpack's browser-only Nodebox client, with its unconditional `window` and `localStorage` references, into the main SSR bundle.
-   **Execution:** This inlined code executes immediately upon module load in the Node.js environment, causing the `window is not defined` crash.
-   **Why Vanilla Vite Works:** By default, Vite preserves the dynamic `import()`, meaning the browser-specific code is never loaded or executed during the server-side rendering process.

The solution for the RedwoodSDK framework is to adjust its Vite build configuration to prevent this inlining for specific dependencies like Sandpack, likely by marking them as external to the SSR bundle or finding a way to conditionally exclude them from the inlining process.
