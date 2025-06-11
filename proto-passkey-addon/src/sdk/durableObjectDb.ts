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

// Create a fake ctx object that forwards to the DO
function createProxyCtx(stub: { db: DurableObjectDbWrapper<any> }) {
  return {
    storage: {
      sql: {
        exec: async (sql: string, ...parameters: unknown[]) => {
          log("Forwarding SQL to Durable Object: %s", sql);
          const result = await stub.db.executeQuery({
            sql,
            parameters,
          });

          // Convert QueryResult to the format expected by DODialect
          return {
            toArray: () => result.rows,
            rowsWritten: Number(result.numAffectedRows || 0),
          };
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
