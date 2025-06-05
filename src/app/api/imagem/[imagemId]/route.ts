import { Imagem } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ imagemId: string }> }
) {
  const imagemId = parseInt((await params).imagemId);
  const imagem: Imagem | null = await prisma.imagem.findUnique({
    where: { id: imagemId },
  });

  if (!imagem) {
    return NextResponse.json({ error: "Medida not found" }, { status: 404 });
  }

  return NextResponse.json(imagem);
}
