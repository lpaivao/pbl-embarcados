'use client';

import { useMqtt } from '@/hooks/useMqtt';
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

    const handleMessage = (topic: string, message: string) => {
        const newMessage: MqttMessage = {
            topic,
            message,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
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