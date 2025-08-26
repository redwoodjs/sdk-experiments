# Tree Shaking Mantine Vanilla Vite

A vanilla Vite React SPA project for testing tree shaking behavior with Mantine UI library.

## What This Tests

This project imports only specific components from `@mantine/core`:

```jsx
import { MantineProvider, Button, Container, Title, Text } from '@mantine/core'
```

Mantine has hundreds of components - this test shows whether unused components get tree-shaken from the final bundle.

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

After building, check the `dist/assets` folder to analyze:
1. Bundle size comparison with selective imports vs full library
2. Whether unused Mantine components are excluded from the bundle

Compare with:
- RedwoodSDK + Mantine version
- Vanilla Vite + custom test dependency 
- RedwoodSDK + custom test dependency

This helps understand how different bundling strategies handle tree shaking of real-world component libraries.
