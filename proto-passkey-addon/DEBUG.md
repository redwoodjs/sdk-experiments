# Debug Logging

This project uses the `debug` package for comprehensive logging throughout the passkey authentication system.

## Enabling Debug Logging

To enable debug logging, set the `DEBUG` environment variable to include the namespaces you want to see:

### All Passkey Logs
```bash
DEBUG=passkey:* npm run dev
```

### Specific Components
```bash
# Only database operations
DEBUG=passkey:database npm run dev

# Only durable object operations
DEBUG=passkey:do npm run dev

# Only function calls
DEBUG=passkey:functions npm run dev

# Only worker middleware
DEBUG=passkey:worker npm run dev

# Only routes
DEBUG=passkey:routes npm run dev

# Only login component (client-side)
DEBUG=passkey:login-component npm run dev
```

### Multiple Namespaces
```bash
DEBUG=passkey:do,passkey:database,passkey:functions npm run dev
```

## Debug Namespaces

- `passkey:do` - Durable Object operations, getDb() calls, initialization
- `passkey:database` - Database operations, migrations, queries
- `passkey:functions` - Server functions, WebAuthn operations, session management, database access
- `passkey:worker` - Worker middleware, startup, environment setup
- `passkey:routes` - Route handling, request logging
- `passkey:login-component` - Client-side login component interactions

## What Gets Logged

### Registration Flow
1. **Client Component**: User interactions, browser API calls
2. **Routes**: Route access logging
3. **Functions**: WebAuthn option generation, session management, database operations
4. **Durable Object**: getDb() calls, database initialization
5. **Database**: User creation, credential storage (executed within DO)

### Login Flow
1. **Client Component**: User interactions, browser API calls
2. **Routes**: Route access logging  
3. **Functions**: WebAuthn verification, session management, database operations
4. **Durable Object**: getDb() calls for database access
5. **Database**: Credential retrieval, counter updates (executed within DO)

### Initialization
1. **Worker**: Startup, environment checks, direct `initialize()` call
2. **Durable Object**: Database initialization, migration execution
3. **Database**: Schema creation, index setup

## Database Proxy Architecture

The system uses a simple and elegant approach:

1. **Durable Object** exposes `getDb()` method that returns the Kysely database instance
2. **Cloudflare RPC** automatically proxies the database object to the worker
3. **Worker functions** use the standard database functions: `createUser(db, username)`, `getCredentialById(db, id)`, etc.
4. **All database calls** are automatically routed through the Durable Object

```typescript
// In the worker:
const db = await durableObjectStub.getDb(); // Returns proxied database
const user = await createUser(db, username); // Routes to DO automatically
```

## Example Output

With `DEBUG=passkey:*`, you'll see detailed logs like:

```
passkey:worker Worker middleware executing +0ms
passkey:worker Initializing Passkey Durable Object +1ms
passkey:do PasskeyDurableObject constructor called with state id: 0123456789abcdef +2ms
passkey:database Creating database instance with DODialect +0ms
passkey:do Database instance created +1ms
passkey:worker Calling initialize() on durable object +5ms
passkey:do Initializing PasskeyDurableObject database +0ms
passkey:database Initializing database with migrations +1ms
passkey:database Running migration: 001_initial_schema UP +2ms
passkey:database Creating users table +1ms
passkey:database Creating credentials table +5ms
passkey:database Database initialization completed successfully +15ms
passkey:do Database initialization complete +16ms
passkey:worker Passkey Durable Object initialized successfully +18ms

# During registration:
passkey:functions Getting database connection +0ms
passkey:functions Calling getDb() on durable object +0ms
passkey:do getDb() called - returning database instance +1ms
passkey:functions Received database instance from durable object +2ms
passkey:functions Creating user in database +0ms
passkey:database Creating user with username: testuser +1ms
passkey:database Inserting user into database: { id: "abc123", username: "testuser" } +2ms
passkey:database User created successfully: abc123 +3ms
```

## Troubleshooting

If you're not seeing logs:
1. Make sure the `DEBUG` environment variable is set correctly
2. Check that you're using the right namespace patterns
3. For client-side logs (`passkey:login-component`), open browser developer tools
4. Ensure the debug package is installed: `npm install debug @types/debug` 