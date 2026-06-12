const { Pool, neonConfig } = require('@neondatabase/serverless')
const { PrismaNeon } = require('@prisma/adapter-neon')
const { PrismaClient } = require('@prisma/client')
const ws = require('ws')

neonConfig.webSocketConstructor = ws
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const existingUser = await prisma.user.findFirst()
    console.log("Success:", existingUser?.email)
  } catch (error) {
    console.error("Prisma error:", error)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
