import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock";

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

console.log("Success with adapter config");

async function test() {
  try {
     await prisma.$connect();
     console.log("Connected")
     await prisma.$disconnect()
  } catch(e) {
     console.error(e)
  }
}
test()
