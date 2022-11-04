import { prisma } from "../backend/utils/prisma";
import { UserDetails } from "../types/user";

export const getUsersData = async (take: number = 20, skip: number = 0) => {
  return await prisma.user.findMany({
    take,
    skip,
    include: {
      connections: {
        include: {
          connector: true,
          connection: true,
        },
      },
    },
  });
};

export const getUserData = async (id: number) => {
  return await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      connections: {
        include: {
          connector: true,
          connection: true,
        },
      },
    },
  });
};

export const updateUserData = async (
  id: number,
  data: Partial<UserDetails>
) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};
