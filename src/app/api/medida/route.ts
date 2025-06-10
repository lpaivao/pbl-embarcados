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
    const medida = medidasRepository.create(body);
    const savedMedida = await medidasRepository.save(medida);
    return NextResponse.json(savedMedida, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
