import { Kysely, CompiledQuery, QueryResult } from "kysely";
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

  return new DurableObjectDbWrapper(db, migrations, migrationTableName, ctx);
}

export class DurableObjectDbWrapper<T> {
  private initialized = false;

  constructor(
    public kysely: Kysely<T>,
    private migrations: Record<string, any>,
    private migrationTableName: string,
    private ctx: DurableObjectState
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

  // RPC method that exposes the raw sql.exec
  async sqlExec(sql: string, ...parameters: unknown[]) {
    await this.initialize();

    log("Executing SQL: %s with params: %o", sql, parameters);

    // Call the raw ctx.storage.sql.exec directly
    return await (this.ctx.storage as any).sql.exec(sql, ...parameters);
  }
}

// Create a fake ctx object that forwards to the DO
function createProxyCtx(stub: { db: DurableObjectDbWrapper<any> }) {
  return {
    storage: {
      sql: {
        exec: async (sql: string, ...parameters: unknown[]) => {
          log("Forwarding SQL to Durable Object: %s", sql);
          // Call the raw sql.exec directly on the DO
          return await stub.db.sqlExec(sql, ...parameters);
        },
      },
    },
  };
}

export function createDurableObjectDb<T>(
  durableObjectBinding: any,
  name = "main"
): Kysely<T> {
  const durableObjectId = durableObjectBinding.idFromName(name);
  const stub = durableObjectBinding.get(durableObjectId);

  // Create a fake ctx that forwards to the DO
  const proxyCtx = createProxyCtx(stub);

  return new Kysely<T>({
    dialect: new DODialect({ ctx: proxyCtx as any }),
  });
}
