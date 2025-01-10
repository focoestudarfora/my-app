const dotenv = require("dotenv");
const nextJest = require("next/jest");

// Load environment variables from the specified file
dotenv.config({
    path: ".env.development", // Adjust the path as needed
});

// Create Jest configuration with Next.js settings
const createJestConfig = nextJest({
    dir: ".", // Base directory of your Next.js application
});

const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>"], // Resolve modules from these directories
    testTimeout: 60000, // Set the test timeout (in milliseconds)
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Add a global setup file
};

// Export the final Jest configuration
module.exports = createJestConfig(customJestConfig);
