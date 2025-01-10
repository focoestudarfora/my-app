import retry from "async-retry";
import database from "infra/database.js";

const WEB_SERVER_URL = "http://localhost:3000/api/v1/status";
const MAX_RETRIES = 100;
const MAX_TIMEOUT = 1000;

/**
 * Waits for all required services to be ready.
 */
async function waitForAllServices() {
    await waitForWebServer(WEB_SERVER_URL);
}

/**
 * Waits for the web server to respond with a 200 status code.
 * @param {string} url - The status page URL to check.
 */
async function waitForWebServer(url) {
    await retry(
        async () => {
            const response = await fetch(url);
            if (response.status !== 200) {
                throw new Error("Web server is not ready yet.");
            }
        },
        { retries: MAX_RETRIES, maxTimeout: MAX_TIMEOUT },
    );
}

/**
 * Clears the database by dropping and recreating the public schema.
 */
async function clearDatabase() {
    const query = `
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `;
    await database.query(query);
}

/**
 * Orchestrator module for handling setup and teardown tasks.
 */
const orchestrator = {
    waitForAllServices,
    clearDatabase,
};

export default orchestrator;
