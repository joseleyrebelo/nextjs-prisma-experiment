import { prisma } from "../backend/utils/prisma";
import { faker } from "@faker-js/faker";
import { getRandomInt, shuffleArray } from "../util/general";
import { getUserData } from "./utils";

const MAX_CONNECTIONS_PER_USER = 50;

const excludeArrayMatches = (targetArray: any[], toRemove: any[] = []) =>
  targetArray.filter((item) => !toRemove.includes(item));
const excludeItemFromArray = (toRemove: any, targetArray: any[]) =>
  targetArray.filter((item) => item !== toRemove);

export default async function seed(amount: number = 100) {
  await prisma.userConnections.deleteMany({});
  await prisma.user.deleteMany({});

  for (let i = 0; i < amount; i++) {
    await prisma.user.create({
      data: {
        fullName: faker.name.firstName() + " " + faker.name.lastName(),
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
    const connectorId = availableUserIds[i];
    // Gets ids from alreadySetConnections
    const alreadySetConnections = (
      await getUserData(connectorId)
    )?.connections.map(({ connection }) => connection.id);
    // Removes those ids from availableUserIds;
    const availableToConnect = excludeArrayMatches(
      availableUserIds,
      alreadySetConnections
    );
    const maxConnections =
      50 < availableToConnect.length ? 50 : availableToConnect.length;
    const connectionsN = getRandomInt(0, maxConnections);
    // Selects the user connections.
    // Shuffles the UsersId array and slices the amount of connections.
    const selectedUserIds = shuffleArray(availableUserIds).slice(
      0,
      connectionsN
    );
    for (let j = 0; j < selectedUserIds.length; j++) {
      const connectionId = selectedUserIds[j];
      // Stops the same user from connecting to itself.
      // Or stops the same connection from being written twice.
      if (
        connectionId === connectorId ||
        !!(await prisma.userConnections.findFirst({
          where: {
            connectorId,
            connectionId,
          },
        }))
      )
        continue;
      // Creates connection to (link many to many).
      // Creates relation between users and connection.
      await prisma.userConnections.create({
        data: {
          connectorId,
          connectionId,
        },
      });
      // Updates connector & connection counts
      userConnectionsCount[connectionId]++;
      userConnectionsCount[connectorId]++;
      // Ensure that connector won't have more than 50 connections.
      // - Removes from available users.
      if (userConnectionsCount[connectionId] > MAX_CONNECTIONS_PER_USER) {
        excludeItemFromArray(connectionId, availableUserIds);
      }
      // Ensure that connector won't have more than 50 connections.
      // - Removes from available users.
      // - Breaks loop.
      if (userConnectionsCount[connectorId] > MAX_CONNECTIONS_PER_USER) {
        excludeItemFromArray(connectorId, availableUserIds);
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
