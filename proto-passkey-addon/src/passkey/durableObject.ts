import { Kysely } from "kysely";
import { createDb, initializeDb, Database } from "./database.js";
import { DurableObject } from "cloudflare:workers";
import debug from "debug";

const log = debug("passkey:do");

export class PasskeyDurableObject extends DurableObject {
  private db: Kysely<Database>;
  private initialized = false;

  constructor(state: any, env: any) {
    log(
      "PasskeyDurableObject constructor called with state id: %s",
      state.id.toString()
    );
    super(state, env);
    this.db = createDb(state);
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

  async getDb(): Promise<Kysely<Database>> {
    log("getDb() called - returning database instance");
    await this.ensureInitialized();
    return this.db;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}
