import database from "infra/database";

// Handles GET requests to fetch database information
export async function GET() {
    const updatedAt = new Date().toISOString(); // Current timestamp

    // Get PostgreSQL version
    const databaseVersion = (await database.query("SHOW server_version"))
        .rows[0].server_version;

    // Get maximum allowed connections
    const maxConnections = parseInt(
        (await database.query({ text: "SHOW max_connections;" })).rows[0]
            .max_connections,
    );

    // Count active connections to the database
    const dbName = process.env.POSTGRES_DB;
    const openedConnections = (
        await database.query({
            text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
            values: [dbName], // Prevent SQL injection
        })
    ).rows[0].count;

    // Return database details as a JSON response
    return new Response(
        JSON.stringify({
            updated_at: updatedAt,
            dependencies: {
                database: {
                    version: databaseVersion,
                    max_connections: maxConnections,
                    opened_connections: openedConnections,
                },
            },
        }),
        { headers: { "Content-Type": "application/json" }, status: 200 },
    );
}
