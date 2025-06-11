import {
  Kysely,
  Driver,
  DatabaseConnection,
  SqliteDialect,
  CompiledQuery,
  QueryResult,
} from "kysely";
import { DODialect } from "kysely-do";
import { createMigrator } from "./index.js";
import debug from "./logger.js";

const log = debug("sdk:do-db");

// Setup function for Durable Object side
export function setupDurableObjectDb<T>(
  ctx: DurableObjectState,
  migrations: Record<string, any>,
  migrationTableName = "__migrations"
): DurableObjectDbWrapper<T> {
  const db = new Kysely<T>({
    dialect: new DODialect({ ctx }),
  });

  return new DurableObjectDbWrapper(db, migrations, migrationTableName);
}

export class DurableObjectDbWrapper<T> {
  private initialized = false;

  constructor(
    public kysely: Kysely<T>,
    private migrations: Record<string, any>,
    private migrationTableName: string
  ) {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      log("Database already initialized, skipping");
      return;
    }

    log("Initializing Durable Object database");
    const migrator = createMigrator(
      this.kysely,
      this.migrations,
      this.migrationTableName
    );
    await migrator.migrateToLatest();
    this.initialized = true;
    log("Database initialization complete");
  }

  // RPC method for executing queries
  async executeQuery<R>(compiledQuery: {
    sql: string;
    parameters: readonly unknown[];
  }): Promise<QueryResult<R>> {
    await this.initialize();

    log(
      "Executing SQL: %s with params: %o",
      compiledQuery.sql,
      compiledQuery.parameters
    );

    // Forward to the internal Kysely database - cast to match Kysely's interface
    const result = await this.kysely.executeQuery({
      sql: compiledQuery.sql,
      parameters: compiledQuery.parameters,
      query: {} as any,
      queryId: {} as any,
    } as CompiledQuery<unknown>);
    return result as QueryResult<R>;
  }
}

// Custom driver for worker side that forwards to Durable Object
class DurableObjectProxyDriver implements Driver {
  constructor(private stub: { db: DurableObjectDbWrapper<any> }) {}

  async acquireConnection(): Promise<DatabaseConnection> {
    return new DurableObjectProxyConnection(this.stub);
  }

  async init(): Promise<void> {
    // Nothing to initialize on worker side
  }

  async beginTransaction(): Promise<void> {
    // Transactions are handled by the DO
  }

  async commitTransaction(): Promise<void> {
    // Transactions are handled by the DO
  }

  async rollbackTransaction(): Promise<void> {
    // Transactions are handled by the DO
  }

  async releaseConnection(): Promise<void> {
    // Nothing to release
  }

  async destroy(): Promise<void> {
    // Nothing to destroy
  }
}

// Custom connection that forwards executeQuery to the DO
class DurableObjectProxyConnection implements DatabaseConnection {
  constructor(private stub: { db: DurableObjectDbWrapper<any> }) {}

  async executeQuery<R>(
    compiledQuery: CompiledQuery<unknown>
  ): Promise<QueryResult<R>> {
    log("Forwarding query to Durable Object: %s", compiledQuery.sql);
    return await this.stub.db.executeQuery<R>({
      sql: compiledQuery.sql,
      parameters: compiledQuery.parameters,
    });
  }

  async *streamQuery(): AsyncIterableIterator<any> {
    throw new Error("Streaming not supported");
  }
}

export function createDurableObjectDb<T>(
  durableObjectBinding: any,
  name = "main"
): Kysely<T> {
  const durableObjectId = durableObjectBinding.idFromName(name);
  const stub = durableObjectBinding.get(durableObjectId);

  return new Kysely<T>({
    dialect: new SqliteDialect({
      database: new DurableObjectProxyDriver(stub) as any,
    }),
  });
}
