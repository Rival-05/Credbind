import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const domains = [
        "iitb.ac.in",
        "iitd.ac.in",
        "iitk.ac.in",
        "iitm.ac.in",
        "iitkgp.ac.in",
        "juetguna.in",
        "vit.ac.in",
        "bits-pilani.ac.in",
    ];

    for (const domain of domains) {
        await prisma.domainWhitelist.upsert({
            where: { domain },
            update: {},
            create: { domain },
        });
    }

    console.log("Whitelist domains registered successfully");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Register failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });