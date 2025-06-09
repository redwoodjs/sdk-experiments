import { Kysely } from "kysely";
import { createDb, initializeDb, Database } from "./database.js";

export class PasskeyDurableObject {
  private db: Kysely<Database>;

  constructor(private state: any, private env: any) {
    this.db = createDb(state);
  }

  async initialize(): Promise<void> {
    await initializeDb(this.db);
  }

  getDb(): Kysely<Database> {
    return this.db;
  }
}
