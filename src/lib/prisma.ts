import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from "pg"

const globalForPrisma = globalThis

// Set up the connection pool and adapter
const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL })
const adapter = new PrismaPg(pool)

// Pass the adapter to the PrismaClient constructor
export const prisma= new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;