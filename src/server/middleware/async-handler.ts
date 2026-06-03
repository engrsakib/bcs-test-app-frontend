import { NextResponse } from "next/server";
import { toErrorResponse } from "@/server/errors/error-response";

type RouteContext = Record<string, unknown>;
type AsyncRouteHandler<TContext = RouteContext> = (
  request: Request,
  context?: TContext
) => Promise<NextResponse>;

export function asyncHandler<TContext = RouteContext>(
  handler: AsyncRouteHandler<TContext>
) {
  return async (
    request: Request,
    context?: TContext
  ): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return toErrorResponse(error);
    }
  };
}
