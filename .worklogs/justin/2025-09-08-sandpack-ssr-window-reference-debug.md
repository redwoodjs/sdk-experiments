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

## 6. Deeper Investigation: First Principles of `inlineDynamicImports`

While the root cause was identified, a deeper, first-principles investigation was necessary to understand *exactly* how `inlineDynamicImports: true` behaves, as its observed behavior (hoisting browser code to the top-level) was counter-intuitive to the idea of deferred execution.

A new, minimal Vite project was created (`inline-imports-test`) with zero dependencies other than Vite itself. The experiment was designed to test the bundler's output under two conditions: standard build vs. inlined build.

**The Test Subjects:**
1.  **`dangerous-module.js`**: A module with a `window.localStorage` access at its top level. Importing this in a server environment should crash immediately.
2.  **`safe-module.js`**: A module with no top-level browser access.
3.  **`index.js`**: An entry point that uses dynamic `import()` to load both modules under different conditions (at the top-level, inside a function, etc.).

### Experiment 1: Standard Build (`inlineDynamicImports: false`)

The project was first built with the standard Vite/Rollup configuration.

**Observation:**
-   The `dist` directory contained multiple files: `index.js`, `dangerous-module-....js`, and `safe-module-....js`.
-   Running `node dist/index.js` executed successfully until the point where `loadDangerousModule()` was explicitly called, at which point it crashed as expected.

**Conclusion:** The bundler correctly preserved the dynamic imports as separate chunks, and the browser-specific code was only loaded and executed when explicitly imported at runtime.

### Experiment 2: Inlined Build (`inlineDynamicImports: true`)

The project was then rebuilt with `inlineDynamicImports: true`.

**Observation:**
-   The `dist` directory contained only a single `index.js` file.
-   An inspection of this bundled file revealed that the contents of `dangerous-module.js`, including the `window.localStorage` access, had been **hoisted to the top level of the module scope.** It was not wrapped in any function or promise.
-   Running `node dist/index.js` crashed **immediately** upon loading the file, before any of the application logic in `index.js` could even run.

### Experiment 3: Testing `treeshake.moduleSideEffects`

As a final test, we hypothesized that Rollup's `treeshake.moduleSideEffects` option could be used to prune the top-level code from `dangerous-module.js` when it was being inlined.

We tried several configurations:
1.  `moduleSideEffects: 'no-external'`
2.  `moduleSideEffects: (id) => id.includes('dangerous-module.js')` (Marking it as having side-effects)
3.  `moduleSideEffects: (id) => !id.includes('dangerous-module.js')` (Marking it as pure)

**Observation:**
-   All three configurations produced a bundle of the **exact same size**.
-   Inspecting the bundle confirmed the top-level code from `dangerous-module.js` was still present in all cases.
-   Running the bundle resulted in the same immediate `ReferenceError: window is not defined`.

**Conclusion:**
The `treeshake.moduleSideEffects` option has **no effect** in this context. The `inlineDynamicImports: true` directive is a higher-order instruction that overrides the tree-shaking logic. By telling the bundler to inline the module, we are implicitly marking its top-level code as essential and not a "side effect" to be pruned.

## 7. Final, Definitive Conclusion & Key Takeaway

This investigation provided a definitive answer:

**Vite's `inlineDynamicImports: true` option does not preserve the lazy-execution semantics of dynamic imports. It is a code-hoisting mechanism.**

It finds all dynamically imported modules, lifts their top-level code into the global scope of the single output bundle, and replaces the `import()` call with a simple reference to the already-initialized module exports.

This highlights the critical difference between development and production builds:
-   **In Development / Standard Builds:** A dynamic `import()` creates a separate chunk. The code inside that chunk is never evaluated until the `import()` function is called at runtime. For SSR, the server simply never calls the client-side import, so the dangerous code is never touched.
-   **With `inlineDynamicImports`:** The concept of separate chunks is eliminated. All code is hoisted into a single file. This forces the top-level code from the "dynamically" imported module to be evaluated as soon as the main server bundle is loaded, causing a crash before any conditional logic can prevent it. The "dynamic" nature of the import is lost at runtime.

This behavior is the root cause of the entire issue. For a framework that requires a single-file server bundle, this Vite option cannot be safely used with any third-party dependency that contains top-level, browser-specific API calls. The only architectural solution is to prevent that browser-specific code from ever being included in the server bundle in the first place, for which a custom Vite plugin that provides server-safe virtual modules is the most robust approach.

## 8. Final Workaround and Recommendation

Based on the investigation, the immediate workaround for users encountering this issue is to disable the `inlineDynamicImports` feature in their project's Vite configuration.

### Test: Disabling `inlineDynamicImports` in the RedwoodSDK project

The `vite.config.mts` in the `sandpack` experiment project was modified to set `inlineDynamicImports: false` for the `worker` and `ssr` builds.

**Observation:**
- The build process now created multiple chunks for the worker, including a `vendor.js` chunk containing the dependencies.
- A `grep` of the final `worker.js` confirmed that the direct reference to `window.localStorage` was no longer present in the main bundle. It was successfully isolated to the vendor chunk.
- The application built and deployed successfully without the `window is not defined` error.

**Conclusion:**
Disabling `inlineDynamicImports` serves as an effective, immediate workaround. It prevents the bundler from hoisting the browser-only code from `@codesandbox/nodebox` into the main server bundle. By keeping the vendor code in a separate chunk, it is not eagerly evaluated when the worker starts, thus avoiding the crash.

While this solves the problem, it is a trade-off against the framework's goal of producing a single, optimized worker file. The long-term and most robust solution remains for Sandpack to offer an SSR-friendly build that allows for proper tree-shaking of its browser-specific components.
