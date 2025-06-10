'use client';

import { useMqtt } from '@/hooks/useMqtt';
import { Medida } from '@/model/medida';
import { CreateMedidaReq } from '@/requests/APIMedida';
import { useMutation } from '@tanstack/react-query';
import mqtt from 'mqtt';
import { createContext, ReactNode, useContext, useState } from 'react';

interface MqttMessage {
    topic: string;
    message: string;
    timestamp: Date;
}

interface MqttContextType {
    isConnected: boolean;
    error: string | null;
    messages: MqttMessage[];
    publish: (topic: string, message: string) => void;
    subscribe: (topic: string) => void;
    unsubscribe: (topic: string) => void;
    topicMedidas: string;
    topicImagens: string;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

interface MqttProviderProps {
    children: ReactNode;
    brokerUrl: string;
    options?: mqtt.IClientOptions;
}

export const MqttProvider = ({ children, brokerUrl, options }: MqttProviderProps) => {
    const [messages, setMessages] = useState<MqttMessage[]>([]);
    const mutationCreateMedidas = useMutation({
        mutationFn: CreateMedidaReq,
        onSuccess: (data) => {
            console.log('Medida registrada com sucesso:', data);
        }
    })

    const handleMessage = (topic: string, message: string) => {
        const newMessage: MqttMessage = {
            topic,
            message,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);

        // Se for o tópico de medidas, serializa e grava no banco
        if (topic.endsWith('/medidas')) {
            try {
                const medidaData: Omit<Medida, 'id'> = JSON.parse(message);
                // Estrutura esperada da mensagem (ajuste conforme necessário)
                const medidaToSave: Omit<Medida, 'id'> = {
                    temperatura: medidaData.temperatura,
                    umidade: medidaData.umidade,
                    luminosidade: medidaData.luminosidade,
                    gas: medidaData.gas,
                    chanceVida: medidaData.chanceVida,
                    dataHora: new Date(),
                };

                mutationCreateMedidas.mutate(medidaToSave);
            } catch (error) {
                console.error('Erro ao processar mensagem de medida:', error);
            }
        }
    };

    const mqtt = useMqtt({
        brokerUrl,
        options,
        onMessage: handleMessage
    });

    return (
        <MqttContext.Provider value={{
            ...mqtt,
            messages,
        }}>
            {children}
        </MqttContext.Provider>
    );
};

export const useMqttContext = () => {
    const context = useContext(MqttContext);
    if (context === undefined) {
        throw new Error('useMqttContext deve ser usado dentro de um MqttProvider');
    }
    return context;
};