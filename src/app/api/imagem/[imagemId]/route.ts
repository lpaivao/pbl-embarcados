import AppDataSource from "@/lib/typeorm/config";
import { Imagem as TypeormImagem } from "@/lib/typeorm/entities/imagem";
import { Imagem } from "@/model/imagem";
import { NextResponse } from "next/server";

const imagensRepository = AppDataSource.getRepository(TypeormImagem);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ imagemId: string }> }
) {
  try {
    const imagemId = parseInt((await params).imagemId);
    const imagem: Imagem | null = await imagensRepository.findOne({
      where: { id: imagemId },
    });

    if (!imagem) {
      return NextResponse.json({ error: "Medida not found" }, { status: 404 });
    }

    return NextResponse.json(imagem);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
