import { Medida } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ medidaId: string }> }
) {
  const medidaId = parseInt((await params).medidaId);
  const medida: Medida | null = await prisma.medida.findUnique({
    where: { id: medidaId },
  });

  if (!medida) {
    return NextResponse.json({ error: "Medida not found" }, { status: 404 });
  }

  return NextResponse.json(medida);
}
