import { prisma } from "~/db.server";

export async function setLastCheckedItem(listId: string, itemName: string) {
  return prisma.list.update({
    where: { id: listId },
    data: { lastCheckedItem: itemName },
  });
}

export async function createList(name: string, userId: string) {
  return prisma.list.create({
    data: {
      name,
      user: {
        connect: { id: userId },
      },
    },
  });
}
