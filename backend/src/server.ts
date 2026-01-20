import { createApp } from "./app";
import dotenv from "dotenv";
import { connToDB } from "./config/db";

dotenv.config();

async function main() {
  // db
  connToDB();

  const app = createApp();

  app.listen(process.env.PORT, () => {
    console.log(`server is running at PORT:${process.env.PORT}...`);
  });
}

main().catch((err) => {
  console.error("boot failed", err);
  process.exit(1);
});
