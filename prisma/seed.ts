import { prisma } from "./prisma-client";
import { hashSync } from "bcrypt";

async function up() {
    await prisma.user.createMany({
        data: [
            {
                "name": "User",
                "email": "user@test.ru",
                "password": hashSync("111111", 10),
                "role_id": 2 // студент
            },
            {
                "name": "Teacher",
                "email": "teacher@test.ru",
                "password": hashSync("111111", 10),
                "role_id": 1 // преподаватель
            }
        ]
    })
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down();
        await up();
    } catch (e) {
        console.log(e);
    }
}

main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
});