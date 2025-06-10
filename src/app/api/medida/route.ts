import AppDataSource from "@/lib/typeorm/config";
import { Medida as TypeormMedida } from "@/lib/typeorm/entities/medida";
import { Medida } from "@/model/medida";
import { NextResponse } from "next/server";

const medidasRepository = AppDataSource.getRepository(TypeormMedida);

export async function GET() {
  const medidas: Medida[] = await medidasRepository.find({
    order: { dataHora: "DESC" },
  });
  return NextResponse.json(medidas);
}

export async function POST(request: Request) {
  try {
    const body: Medida = await request.json();
    const medida = await medidasRepository.create(body);
    return NextResponse.json(medida);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
