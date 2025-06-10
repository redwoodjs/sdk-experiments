import { Kysely } from "kysely";
import { DODialect } from "kysely-do";
import { DurableObject } from "cloudflare:workers";
import debug from "@/sdk/logger.js";
import { Database } from "./db/db";
import { createMigrator } from "@/sdk";
import { migrations } from "./db/migrations";

const log = debug("passkey:do");

export class PasskeyDurableObject extends DurableObject {
  private db: Kysely<Database>;
  private initialized = false;
  public ctx: DurableObjectState;

  constructor(ctx: DurableObjectState, env: any) {
    log(
      "PasskeyDurableObject constructor called with state id: %s",
      ctx.id.toString()
    );
    super(ctx, env);
    this.db = createDb(ctx);
    this.ctx = ctx;
    log("Database instance created");
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      log("Database already initialized, skipping");
      return;
    }

    log("Initializing PasskeyDurableObject database");
    await initializeDb(this.db);
    this.initialized = true;
    log("Database initialization complete");
  }
}

export async function initializeDb(db: Kysely<Database>): Promise<void> {
  const migrator = createMigrator(db, migrations, "__passkey_migrations");
  await migrator.migrateToLatest();
}

export const createDb = (ctx: DurableObjectState): Kysely<Database> => {
  return new Kysely<Database>({
    dialect: new DODialect({
      ctx,
    }),
  });
};
