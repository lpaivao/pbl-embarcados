import AppDataSource from "@/lib/typeorm/config";
import { Medida as TypeormMedida } from "@/lib/typeorm/entities/medida";
import { Medida } from "@/model/medida";
import { NextResponse } from "next/server";

const medidasRepository = AppDataSource.getRepository(TypeormMedida);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ medidaId: string }> }
) {
  try {
    const medidaId = parseInt((await params).medidaId);
    const medida: Medida | null = await medidasRepository.findOne({
      where: { id: medidaId },
    });

    if (!medida) {
      return NextResponse.json({ error: "Medida not found" }, { status: 404 });
    }

    return NextResponse.json(medida);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
