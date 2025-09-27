// src/types.d.ts

// This file can be used for shared DTOs (Data Transfer Objects)
// between the server and client.

// Example:
// export type UserProfileDto = {
//   id: string;
//   handle: string;
//   displayName: string;
//   avatarUrl?: string;
//   bio?: string;
// };

// For now, we will leave this empty as the repositories are returning Prisma types.
// As the app grows, we can define specific DTOs here to decouple the client
// from the database schema.

export type GeoPoint = {
  type: "Point";
  coordinates: [number, number];
};