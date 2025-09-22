// src/server/next-types.ts
import type { NextRequest } from 'next/server';

/**
 * Context object passed to Route Handlers.
 */
export type RouteCtx<P extends Record<string, string>> = {
  params: Promise<P>;
};

/**
 * A handler function for a Node.js runtime route.
 *
 * @param req The request object.
 * @param ctx The context object, containing route parameters.
 */
export type NodeHandler<P extends Record<string, string> = Record<string, never>> = (
  req: NextRequest,
  ctx: RouteCtx<P>,
) => Promise<Response> | Response;