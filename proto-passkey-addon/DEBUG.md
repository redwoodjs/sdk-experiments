# Debug Configuration for Cloudflare Workers

This project uses the [debug](https://github.com/debug-js/debug) package for comprehensive logging, properly configured to work with Cloudflare Workers.

## How it Works

The debug package is configured in `src/sdk/logger.ts` to use `console.log` instead of the default `stderr`, making it compatible with Cloudflare Workers.

## Available Debug Namespaces

- `passkey:do` - Durable Object operations
- `passkey:database` - Database operations and migrations
- `passkey:functions` - Server function calls
- `passkey:worker` - Worker middleware and initialization
- `passkey:routes` - Route handling
- `passkey:login-component` - Frontend login component

## Enabling Debug Output

### Development (Local)

To enable debug output during local development:

```bash
# Enable all passkey debug output
DEBUG=passkey:* npm run dev

# Enable specific namespaces
DEBUG=passkey:database,passkey:functions npm run dev

# Enable everything
DEBUG=* npm run dev
```

### Production Debugging

For Cloudflare Workers in production, you can dynamically enable debug output by calling `debug.enable()` in your code:

```javascript
import debug from 'debug';

// Enable all passkey logs
debug.enable('passkey:*');

// Enable specific logs
debug.enable('passkey:database,passkey:functions');

// Check if debugging is enabled
console.log('Debug enabled for database:', debug.enabled('passkey:database'));
```

### Browser Debugging

For client-side debugging in the browser, use localStorage:

```javascript
// In browser console
localStorage.debug = 'passkey:*';
// Then refresh the page
```

## Example Usage

```javascript
import debug from '../sdk/logger.js';

const log = debug('passkey:database');

export function someFunction() {
  log('Starting database operation');
  log('Query result: %o', result);
  log('Operation completed in %dms', duration);
}
```

## Features

- ✅ **Printf-style formatting**: Use `%s`, `%d`, `%o`, `%j` formatters
- ✅ **Namespace filtering**: Enable/disable specific components
- ✅ **Timestamp diffs**: Shows time between debug calls
- ✅ **Color coding**: Each namespace gets a unique color (in environments that support it)
- ✅ **Cloudflare Workers compatible**: Uses console.log instead of stderr
- ✅ **Browser compatible**: Works in both server and client environments

## Troubleshooting

If debug output isn't showing:

1. Make sure the DEBUG environment variable is set
2. Check that the namespace matches exactly (case-sensitive)
3. Verify console output in your development tools
4. Use `debug.enabled('namespace')` to check if a namespace is enabled 