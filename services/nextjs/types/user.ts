export type UserDetails = { id: number; fullName: string; color: string };

export type UserQuery = {
  id: number;
  fullName: string;
  color: string;
  connections: {
    connector: UserDetails;
    connection: UserDetails;
  }[];
};
