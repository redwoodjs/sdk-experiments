# Tree Shaking Vanilla Vite

A vanilla Vite React SPA project for testing tree shaking behavior with the `dummy-tree-shake-test` component library.

## What This Tests

This project imports only the `Button` component from `dummy-tree-shake-test`:

```jsx
import { Button } from 'dummy-tree-shake-test'
```

The component library contains 5 components:
- Button ✅ (imported - should be included)
- Card ❌ (not imported - should be tree-shaken)
- Input ❌ (not imported - should be tree-shaken)
- Modal ❌ (not imported - should be tree-shaken)
- Badge ❌ (not imported - should be tree-shaken)

## Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Analyzing Tree Shaking

After building, check the `dist/assets` folder to see:
1. What components actually made it into the bundle
2. Bundle size comparison with full import vs selective import

Compare with the RedwoodSDK version to see differences in tree shaking behavior between vanilla Vite and the SDK's bundling strategy.
