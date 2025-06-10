import AppDataSource from "@/lib/typeorm/config";
import { Imagem as TypeormImagem } from "@/lib/typeorm/entities/imagem";
import { Imagem } from "@/model/imagem";
import { NextResponse } from "next/server";

const imagensRepository = AppDataSource.getRepository(TypeormImagem);

export async function GET() {
  try {
    const imagem: Imagem | null = await imagensRepository
      .createQueryBuilder("imagem")
      .leftJoinAndSelect("imagem.medida", "medida")
      .orderBy("medida.dataHora", "DESC")
      .getOne();
    return NextResponse.json(imagem);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
