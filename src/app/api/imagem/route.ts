import AppDataSource from "@/lib/typeorm/config";
import { Imagem as TypeormImagem } from "@/lib/typeorm/entities/imagem";
import { Imagem } from "@/model/imagem";
import { NextResponse } from "next/server";

const imagensRepository = AppDataSource.getRepository(TypeormImagem);

export async function GET() {
  try {
    const imagens: Imagem[] = await imagensRepository.find({
      relations: ["medida"],
      order: {
        medida: { dataHora: "DESC" },
      },
    });
    return NextResponse.json(imagens);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Imagem = await request.json();
    const imagem = imagensRepository.create(body);
    const savedImagem = await imagensRepository.save(imagem);
    return NextResponse.json(savedImagem);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
