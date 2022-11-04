import { prisma } from "../backend/utils/prisma";
import { faker } from "@faker-js/faker";
import { getRandomInt, shuffleArray } from "../util/general";

const MAX_CONNECTIONS_PER_USER = 50;

export default async function seed(amount: number = 100) {
  await prisma.userConnections.deleteMany({});
  await prisma.user.deleteMany({});

  for (let i = 0; i < amount; i++) {
    await prisma.user.create({
      data: {
        fullName: faker.name.fullName(),
        color: faker.color.rgb(),
      },
    });
  }

  let availableUserIds = (await prisma.user.findMany()).map(({ id }) => id);
  let userConnectionsCount: {
    [K in typeof availableUserIds[number]]: number;
  } = availableUserIds.reduce((accumulator, value) => {
    return { ...accumulator, [value]: 0 };
  }, {});
  const removeUserFromAvailable = (id: number) => {
    availableUserIds = availableUserIds.filter((item) => item !== id);
  };
  for (let i = 0; i < availableUserIds.length; i++) {
    const maxConnections =
      50 < availableUserIds.length ? 50 : availableUserIds.length;
    const connectorUserId = availableUserIds[0];
    const connectionsN = getRandomInt(0, maxConnections);
    // Selects the user connections.
    // Shuffles the UsersId array and slices the amount of connections.
    const selectedUserIds = shuffleArray(availableUserIds).slice(
      0,
      connectionsN
    );
    for (let j = 0; j < selectedUserIds.length; j++) {
      const connectionsUserId = selectedUserIds[j];
      // Stops the same user from connecting to itself.
      if (connectionsUserId === connectorUserId) continue;
      // Creates connection to (link many to many).
      // Creates relation between users and connection.
      await prisma.userConnections.create({
        data: {
          connectorId: connectorUserId,
          connectionId: connectionsUserId,
        },
      });
      // Updates connector & connectee connection counts
      userConnectionsCount[connectionsUserId]++;
      userConnectionsCount[connectorUserId]++;
      // Ensure that connector won't have more than 50 connections.
      // - Removes from available users.
      if (userConnectionsCount[connectionsUserId] > MAX_CONNECTIONS_PER_USER) {
        removeUserFromAvailable(connectionsUserId);
      }
      // Ensure that connector won't have more than 50 connections.
      // - Removes from available users.
      // - Breaks loop.
      if (userConnectionsCount[connectorUserId] > MAX_CONNECTIONS_PER_USER) {
        removeUserFromAvailable(connectorUserId);
        break;
      }
    }
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
