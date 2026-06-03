import { NextResponse } from "next/server";
import { ApiError } from "@/server/errors/api-error";

type ErrorPayload = {
  success: false;
  message: string;
  details?: unknown;
};

const isNodeError = (value: unknown): value is NodeJS.ErrnoException =>
  value instanceof Error && "code" in value;

export function toErrorResponse(error: unknown): NextResponse<ErrorPayload> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  if (isNodeError(error) && error.code === "ECONNREFUSED") {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to upstream service.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Internal server error.",
    },
    { status: 500 }
  );
}
