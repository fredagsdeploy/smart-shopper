import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "andresamuelsson94@gmail.com" },
    update: {},
    create: {
      id: "tejp",
      name: "Tejp",
      email: "andresamuelsson94@gmail.com",
      lists: {
        create: [
          {
            name: "Tejp's List",
            items: {
              create: [
                {
                  id: "tejp-my_list-milk",
                  text: "Milk",
                  checked: false,
                },
                {
                  id: "tejp-my_list-eggs",
                  text: "Eggs",
                  checked: false,
                },
                {
                  id: "tejp-my_list-bread",
                  text: "Bread",
                  checked: false,
                },
                {
                  id: "tejp-my_list-apples",
                  text: "Apples",
                  checked: false,
                },
              ],
            },
          },
        ],
      },
    },
  });
  await prisma.user.upsert({
    where: { email: "johan.lindskogen@gmail.com" },
    update: {},
    create: {
      name: "Ndushi",
      email: "johan.lindskogen@gmail.com",
      lists: {
        create: [
          {
            name: "Ndushi's list",
            items: {
              create: [
                {
                  id: "ndushi-my_list-cola",
                  text: "Cola",
                  checked: false,
                },
                {
                  id: "ndushi-my_list-bananas",
                  text: "Bananas",
                  checked: false,
                },
                {
                  id: "ndushi-my_list-cereal",
                  text: "Cereal",
                  checked: false,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
