import { Database } from "./db/db";
import { migrations as passkeyMigrations } from "./db/migrations";
import { KyselyDurableObject } from "@/sdk/durableObjectDb";

export class PasskeyDurableObject extends KyselyDurableObject<Database> {
  migrations = passkeyMigrations;
}
