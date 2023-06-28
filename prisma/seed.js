const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const prisma = new PrismaClient();
dotenv.config();

const SALT_ROUND = 12;

async function main() {
  const salt = bcrypt.genSaltSync(SALT_ROUND);
  const hash = bcrypt.hashSync("admin", salt);
  await prisma.user.create({
    data: {
      surname: "admin",
      othernames: "admin",
      password: hash,
      email: "admin@app.com",
      type: "admin",
      createdAt: new Date(),
      admin: {},
    },
  });

  await prisma.level.createMany({
    data: [
      { name: "ND1", createdAt: new Date() },
      { name: "ND2", createdAt: new Date() },
      { name: "HND1", createdAt: new Date() },
      { name: "HND2", createdAt: new Date() },
    ],
  });
}

main()
  .then(() => console.log("Seeded!"))
  .catch((error) => console.log(error));
