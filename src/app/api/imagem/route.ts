import prisma from "@/lib/prisma";
import { Imagem } from "@/model/imagem";
import { NextResponse } from "next/server";

export async function GET() {
  const imagens: Imagem[] = await prisma.imagem.findMany();
  return NextResponse.json(imagens);
}

export async function POST(request: Request) {
  const body: Imagem = await request.json();
  const imagem = await prisma.imagem.create({
    data: { ...body },
  });
  return NextResponse.json(imagem);
}
