import { neon } from '@neondatabase/serverless';

async function update() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`UPDATE "User" SET balance = 500 WHERE role = 'RESELLER' OR role = 'ADMIN'`;
  console.log("Balance updated");
}

update();
