# Tree Shaking Mantine RedwoodSDK

This project tests tree shaking behavior with Mantine UI library using the RedwoodSDK bundling strategy.

## What This Tests

This project imports only specific components from `@mantine/core`:

```jsx
import { MantineProvider, Button, Container, Title, Text } from '@mantine/core'
```

Mantine has hundreds of components - this test shows whether unused components get tree-shaken from the final bundle when using RedwoodSDK's bundling strategy.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Analyzing Tree Shaking

After building, check the `dist/assets` folder to analyze:
1. Bundle size comparison with selective imports vs full library
2. Whether unused Mantine components are excluded from the bundle
3. How RedwoodSDK's bundling compares to vanilla Vite

Compare with:
- Vanilla Vite + Mantine version
- Vanilla Vite + custom test dependency 
- RedwoodSDK + custom test dependency

This helps understand how RedwoodSDK's bundling strategy handles tree shaking of real-world component libraries.