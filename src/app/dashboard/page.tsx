'use client';

import useChart from "@/hooks/useChart";
import { GetAllMedidasReq } from "@/requests/APIMedida";
import { useQuery } from "@tanstack/react-query";
import { CategoryScale, Chart as ChartJs, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function DashboardPage() {
    const queryGetAllMedidas = useQuery({
        queryKey: ['getAllMedidas'],
        queryFn: GetAllMedidasReq,
        refetchInterval: 30 * 1000, // Atualiza a cada 30 segundos
    });

    const medidas = queryGetAllMedidas.data;

    console.log(medidas);

    const temperaturas: number[] = medidas?.map(medida => medida.temperatura) || [];
    const umidades: number[] = medidas?.map(medida => medida.umidade) || [];
    const luminosidades: number[] = medidas?.map(medida => medida.luminosidade) || [];
    const gases: number[] = medidas?.map(medida => medida.gas) || [];
    const datas: string[] = medidas?.map(medida => new Date(medida.dataHora).toLocaleTimeString()) || [];

    const { chartData: graficoTemperatura, options: optionsTemperatura } = useChart("Temperatura", datas, temperaturas);
    const { chartData: graficoUmidade, options: optionsUmidade } = useChart("Umidade", datas, umidades);
    const { chartData: graficoLuminosidade, options: optionsLuminosidade } = useChart("Luminosidade", datas, luminosidades);
    const { chartData: graficoGases, options: optionsGases } = useChart("Gás", datas, gases);

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div className="w-full h-96">
                    <Line data={graficoTemperatura} options={optionsTemperatura} />
                </div>
                <div className="w-full h-96">
                    <Line data={graficoUmidade} options={optionsUmidade} />
                </div>
            </div>
            <div className="grid grid-cols-2 justify-around">
                <div className="w-full h-96">
                    <Line data={graficoLuminosidade} options={optionsLuminosidade} />
                </div>
                <div className="w-full h-96">
                    <Line data={graficoGases} options={optionsGases} />
                </div>
            </div>
        </>
    )
}

export default DashboardPage