#!/bin/bash
echo "🧪 Testing with inlineDynamicImports enabled..."
echo "Building..."
npm run build:all > /dev/null 2>&1
echo "Testing SSR..."
npm run test:ssr
