const NodeEnvironment = require("jest-environment-node");
const { randomUUID } = require("node:crypto");
const { execSync } = require("node:child_process");

require('dotenv').config()

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.schema = randomUUID();
    const DATABASE_URL_SPLITTER = "schema="
    const [baseDatabaseURL,] = process.env.DATABASE_URL?.split(DATABASE_URL_SPLITTER)
    this.connectionString = baseDatabaseURL + DATABASE_URL_SPLITTER + this.schema
  }

  setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    // RUN MIGRATIONS
    execSync("npx prisma migrate dev");
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomEnvironment;
