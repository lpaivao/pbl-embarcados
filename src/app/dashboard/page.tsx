'use client';

import useChart from "@/hooks/useChart";
import { getAllImagensReq, getUltimaImagemReq } from "@/requests/APIImagem";
import { GetAllMedidasReq } from "@/requests/APIMedida";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, Typography } from "antd";
import { CategoryScale, Chart as ChartJs, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useMqttContext } from "../providers/mqtt";

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { Text } = Typography;

function DashboardPage() {
    const { isConnected, messages, subscribe, topicMedidas, topicImagens } = useMqttContext();

    useEffect(() => {
        if (isConnected) {
            subscribe(topicMedidas);
            subscribe(topicImagens);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);
    // Filtrar mensagens por tópico
    const medidasMessages = useMemo(() =>
        messages.filter(msg => msg.topic === topicMedidas),
        [messages, topicMedidas]
    );

    const imagensMessages = useMemo(() =>
        messages.filter(msg => msg.topic === topicImagens),
        [messages, topicImagens]
    );

    const queryGetAllMedidas = useQuery({
        queryKey: ['getAllMedidas'],
        queryFn: GetAllMedidasReq,
        refetchInterval: 5 * 1000,
    });

    const queryGetAllImagens = useQuery({
        queryKey: ['getAllImagens'],
        queryFn: getAllImagensReq,
    });

    const queryGetUltimaImagem = useQuery({
        queryKey: ['getUltimaImagem'],
        queryFn: getUltimaImagemReq,
    });

    const medidas = queryGetAllMedidas.data;
    const imagens = queryGetAllImagens.data;

    const lastImage = queryGetUltimaImagem.data;

    console.log(imagens);

    const temperaturas: number[] = medidas?.map(medida => medida.temperatura) || [];
    const umidades: number[] = medidas?.map(medida => medida.umidade) || [];
    const luminosidades: number[] = medidas?.map(medida => medida.luminosidade) || [];
    const gases: number[] = medidas?.map(medida => medida.gas) || [];
    const datas: string[] = medidas?.map(medida => new Date(medida.dataHora).toLocaleTimeString()) || [];
    const chanceVida: number[] = medidas?.map(medida => medida.chanceVida) || [];

    const { chartData: graficoTemperatura, options: optionsTemperatura } = useChart("Temperatura", datas, temperaturas);
    const { chartData: graficoUmidade, options: optionsUmidade } = useChart("Umidade", datas, umidades);
    const { chartData: graficoLuminosidade, options: optionsLuminosidade } = useChart("Luminosidade", datas, luminosidades);
    const { chartData: graficoGases, options: optionsGases } = useChart("Gás", datas, gases);
    const { chartData: graficoChanceVida, options: optionsChanceVida } = useChart("Chance de Vida", datas, chanceVida);

    return (
        <>
            {isConnected ? (
                <Badge status="success" text="Conectado ao Broker!" />
            ) : (
                <Badge status="error" text="Sem conexão com o Broker!" />
            )}

            {/* Seção para mostrar mensagens MQTT recebidas */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Card title="Mensagens de Medidas" size="small">
                    <div className="max-h-32 overflow-y-auto">
                        {medidasMessages.slice(-5).map((msg, index) => (
                            <div key={index} className="text-xs mb-1">
                                <Text type="secondary">
                                    {msg.timestamp.toLocaleTimeString()}:
                                </Text>
                                <Text> {msg.message}</Text>
                            </div>
                        ))}
                        {medidasMessages.length === 0 && (
                            <Text type="secondary">Nenhuma mensagem recebida</Text>
                        )}
                    </div>
                </Card>

                <Card title="Mensagens de Imagens" size="small">
                    <div className="max-h-32 overflow-y-auto">
                        {imagensMessages.slice(-5).map((msg, index) => (
                            <div key={index} className="text-xs mb-1">
                                <Text type="secondary">
                                    {msg.timestamp.toLocaleTimeString()}:
                                </Text>
                                <Text> {msg.message}</Text>
                            </div>
                        ))}
                        {imagensMessages.length === 0 && (
                            <Text type="secondary">Nenhuma mensagem recebida</Text>
                        )}
                    </div>
                </Card>
            </div>

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
            <div className="grid grid-cols-2 justify-around mt-4">
                <div className="w-full h-96">
                    <Line data={graficoChanceVida} options={optionsChanceVida} />
                </div>
                {lastImage && (
                    <Card title="Última Imagem Recebida" className="mt-4">
                        <div className="flex flex-col items-center">
                            <Image width={200} height={200} src={lastImage?.url} alt="Ultima imagem gravada"></Image>
                            <Text type="secondary" className="mt-2">
                                {new Date(lastImage?.medida.dataHora).toLocaleString()}
                            </Text>
                        </div>
                    </Card>
                )}
            </div>

        </>
    )
}

export default DashboardPage;