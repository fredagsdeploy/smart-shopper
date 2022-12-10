import { prisma } from "~/db.server";
import { setLastCheckedItem } from "~/models/list.server";

export async function setItemChecked(
  listId: string,
  itemId: string,
  itemName: string,
  check: boolean
) {
  if (check) {
    await setLastCheckedItem(listId, itemName);
  }

  return prisma.item.update({
    where: { id: itemId },
    data: { checked: check },
  });
}

export async function createItem(listId: string, text: string) {
  return prisma.item.create({
    data: {
      text: text,
      checked: false,
      list: {
        connect: {
          id: listId,
        },
      },
    },
  });
}

export async function findItem(itemId: string) {
  return prisma.item.findFirstOrThrow({
    where: { id: itemId },
  });
}
