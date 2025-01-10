import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

const runMigrations = async (dryRun) => {
    const dbClient = await database.getNewClient();
    try {
        return await migrationRunner({
            dbClient,
            dryRun,
            dir: join("infra", "migrations"),
            direction: "up",
            migrationsTable: "pgmigrations",
        });
    } catch (error) {
        console.error("Migration error:", error);
        throw error;
    } finally {
        await dbClient.end();
    }
};

export async function GET() {
    const pendingMigrations = await runMigrations(true);
    console.log(pendingMigrations);
    return new Response(JSON.stringify(pendingMigrations), { status: 200 });
}

export async function POST() {
    const migratedMigrations = await runMigrations(false);
    const status = migratedMigrations.length > 0 ? 201 : 200;
    return new Response(JSON.stringify(migratedMigrations), { status });
}
