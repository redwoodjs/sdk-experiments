import { Kysely, Migration } from "kysely";

export interface MigrationRecord {
  name: string;
  executedAt: string;
}

export interface MigrationInfo {
  name: string;
  executed: boolean;
}

export interface MigrationResult {
  migrationName: string;
  direction: "Up" | "Down";
  status: "Success" | "Error";
  error?: any;
}

export interface MigrationResultSet {
  error: any;
  results: MigrationResult[];
}

export class TableMigrator {
  private db: Kysely<any>;
  private migrations: Record<string, Migration>;
  private migrationTableName: string;

  constructor(
    db: Kysely<any>,
    migrations: Record<string, Migration>,
    migrationTableName: string = "__rwsdk_migrations"
  ) {
    this.db = db;
    this.migrations = migrations;
    this.migrationTableName = migrationTableName;
  }

  async ensureMigrationTable(): Promise<void> {
    await this.db.schema
      .createTable(this.migrationTableName)
      .ifNotExists()
      .addColumn("name", "text", (col) => col.primaryKey())
      .addColumn("executedAt", "text", (col) => col.notNull())
      .execute();
  }

  async getExecutedMigrations(): Promise<string[]> {
    await this.ensureMigrationTable();

    const result = (await this.db
      .selectFrom(this.migrationTableName)
      .select("name")
      .orderBy("name")
      .execute()) as { name: string }[];

    return result.map((row) => row.name);
  }

  async getPendingMigrations(): Promise<string[]> {
    const executedMigrations = await this.getExecutedMigrations();
    const allMigrationNames = Object.keys(this.migrations).sort();

    return allMigrationNames.filter(
      (name) => !executedMigrations.includes(name)
    );
  }

  async migrateToLatest(): Promise<MigrationResultSet> {
    const results: MigrationResult[] = [];
    let error: any = null;

    try {
      const pendingMigrations = await this.getPendingMigrations();

      for (const migrationName of pendingMigrations) {
        const migration = this.migrations[migrationName];
        if (!migration) {
          throw new Error(`Migration ${migrationName} not found`);
        }

        try {
          await this.db.transaction().execute(async (trx) => {
            // Run the migration
            await migration.up(trx);

            // Record the migration
            await trx
              .insertInto(this.migrationTableName)
              .values({
                name: migrationName,
                executedAt: new Date().toISOString(),
              })
              .execute();
          });

          results.push({
            migrationName,
            direction: "Up",
            status: "Success",
          });
        } catch (migrationError) {
          results.push({
            migrationName,
            direction: "Up",
            status: "Error",
            error: migrationError,
          });
          error = migrationError;
          break;
        }
      }
    } catch (err) {
      error = err;
    }

    return {
      error,
      results,
    };
  }

  async migrateDown(): Promise<MigrationResultSet> {
    const results: MigrationResult[] = [];
    let error: any = null;

    try {
      const executedMigrations = await this.getExecutedMigrations();

      if (executedMigrations.length === 0) {
        return { error: null, results: [] };
      }

      // Get the last executed migration
      const lastMigration = executedMigrations[executedMigrations.length - 1];
      const migration = this.migrations[lastMigration];

      if (!migration || !migration.down) {
        throw new Error(
          `Migration ${lastMigration} not found or has no down method`
        );
      }

      try {
        await this.db.transaction().execute(async (trx) => {
          // Run the down migration
          await migration.down!(trx);

          // Remove the migration record
          await trx
            .deleteFrom(this.migrationTableName)
            .where("name", "=", lastMigration)
            .execute();
        });

        results.push({
          migrationName: lastMigration,
          direction: "Down",
          status: "Success",
        });
      } catch (migrationError) {
        results.push({
          migrationName: lastMigration,
          direction: "Down",
          status: "Error",
          error: migrationError,
        });
        error = migrationError;
      }
    } catch (err) {
      error = err;
    }

    return {
      error,
      results,
    };
  }

  async getMigrations(): Promise<MigrationInfo[]> {
    const executedMigrations = await this.getExecutedMigrations();

    return Object.keys(this.migrations)
      .sort()
      .map((name) => ({
        name,
        executed: executedMigrations.includes(name),
      }));
  }
}

// Helper function to create a migrator
export function createMigrator(
  db: Kysely<any>,
  migrations: Record<string, Migration>,
  migrationTableName?: string
): TableMigrator {
  return new TableMigrator(db, migrations, migrationTableName);
}
