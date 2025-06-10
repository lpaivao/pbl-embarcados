import mqtt, { MqttClient } from "mqtt";
import { useEffect, useRef, useState } from "react";

interface UseMqttOptions {
  brokerUrl: string;
  options?: mqtt.IClientOptions;
  onMessage?: (topic: string, message: string) => void;
}

interface UseMqttReturn {
  client: MqttClient | null;
  isConnected: boolean;
  error: string | null;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  topicMedidas: string;
  topicImagens: string;
}

export const useMqtt = ({
  brokerUrl,
  options = {},
  onMessage,
}: UseMqttOptions): UseMqttReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<MqttClient | null>(null);
  const baseTopic = "UEFS_TEC_470";
  const [topicMedidas] = useState(`${baseTopic}/medidas`);
  const [topicImagens] = useState(`${baseTopic}/imagens`);

  useEffect(() => {
    const client = mqtt.connect(brokerUrl, {
      keepalive: 60,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30 * 1000,
      ...options,
    });

    client.on("connect", () => {
      console.log("Conectado ao broker MQTT");
      setIsConnected(true);
      setError(null);
    });

    client.on("error", (err) => {
      console.error("Erro na conexão MQTT:", err);
      setError(err.message);
      setIsConnected(false);
    });

    client.on("close", () => {
      console.log("Desconectado do broker MQTT");
      setIsConnected(false);
    });

    // Adicionar listener para mensagens recebidas
    client.on("message", (topic, payload) => {
      const message = payload.toString();
      console.log(`Mensagem recebida no tópico ${topic}:`, message);
      if (onMessage) {
        onMessage(topic, message);
      }
    });

    clientRef.current = client;

    return () => {
      if (client) {
        client.end();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publish = (topic: string, message: string) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish(topic, message);
    }
  };

  const subscribe = (topic: string) => {
    if (clientRef.current && isConnected) {
      console.log(`Inscrevendo no tópico: ${topic}`);
      clientRef.current.subscribe(topic);
    }
  };

  const unsubscribe = (topic: string) => {
    if (clientRef.current && isConnected) {
      clientRef.current.unsubscribe(topic);
    }
  };

  return {
    client: clientRef.current,
    isConnected,
    error,
    topicMedidas,
    topicImagens,
    publish,
    subscribe,
    unsubscribe,
  };
};
