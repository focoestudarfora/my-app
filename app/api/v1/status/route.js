import database from "infra/database";

export async function GET() {
    const updatedAt = new Date().toISOString();
    const databaseVersionResult = await database.query("SHOW server_version");
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    return new Response(
        JSON.stringify({
            updated_at: updatedAt,
            dependencies: {
                database: {
                    version: databaseVersionValue,
                },
            },
        }),
        {
            headers: { "Content-Type": "application/json" },
            status: 200,
        },
    );
}
