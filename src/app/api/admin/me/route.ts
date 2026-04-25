import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/admin";

export async function GET() {
  return NextResponse.json(
    { isAdmin: await isAdminRequest() },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
