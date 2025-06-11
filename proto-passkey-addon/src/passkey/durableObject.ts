import { DurableObject } from "cloudflare:workers";
import debug from "@/sdk/logger.js";
import { Database } from "./db/db";
import { migrations } from "./db/migrations";
import { setupDurableObjectDb } from "@/sdk/durableObjectDb";

const log = debug("passkey:do");

export class PasskeyDurableObject extends DurableObject {
  public db: ReturnType<typeof setupDurableObjectDb<Database>>;
  public ctx: DurableObjectState;

  constructor(ctx: DurableObjectState, env: any) {
    super(ctx, env);
    this.db = setupDurableObjectDb<Database>(ctx, migrations);
    this.ctx = ctx;
  }
}
