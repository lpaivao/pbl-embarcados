import { Medida } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const medidas: Medida[] = await prisma.medida.findMany();
  return NextResponse.json(medidas);
}

export async function POST(request: Request) {
  const body: Medida = await request.json();
  const medida = await prisma.medida.create({
    data: { ...body },
  });
  return NextResponse.json(medida);
}
