import Paho from 'paho-mqtt';
import { LampState } from '../types/mqtt';

export const DEFAULT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';

const BASE_TOPIC = 'fiap/3ess/iotcontrol-rodrigo';

export const TOPICS = {
  temperatura: `${BASE_TOPIC}/sensor/temperatura`,
  umidade: `${BASE_TOPIC}/sensor/umidade`,
  lampadaComando: `${BASE_TOPIC}/lampada/comando`,
  lampadaEstado: `${BASE_TOPIC}/lampada/estado`,
};

const SUBSCRIBE_TOPICS = [TOPICS.temperatura, TOPICS.umidade, TOPICS.lampadaEstado];

interface ConnectHandlers {
  onConnected: () => void;
  onError: (message: string) => void;
  onMessage: (topic: string, payload: string) => void;
}

let client: Paho.Client | null = null;

export function connect(url: string, handlers: ConnectHandlers): void {
  disconnect();

  let newClient: Paho.Client;
  try {
    newClient = new Paho.Client(url, `iot-control-${Date.now()}`);
  } catch {
    handlers.onError('URL do broker inválida.');
    return;
  }

  newClient.onMessageArrived = (message: Paho.Message) => {
    handlers.onMessage(message.destinationName, message.payloadString);
  };

  newClient.onConnectionLost = (response: Paho.MQTTError) => {
    client = null;
    handlers.onError(`Conexão perdida: ${response.errorMessage}`);
  };

  client = newClient;

  newClient.connect({
    timeout: 10,
    onSuccess: () => {
      SUBSCRIBE_TOPICS.forEach((topic) => newClient.subscribe(topic));
      handlers.onConnected();
    },
    onFailure: (error: Paho.MQTTError) => {
      client = null;
      handlers.onError(`Falha ao conectar: ${error.errorMessage}`);
    },
  });
}

export function disconnect(): void {
  if (!client) {
    return;
  }

  // Remove os listeners para não receber eventos depois de desconectar
  client.onMessageArrived = () => {};
  client.onConnectionLost = () => {};

  if (client.isConnected()) {
    SUBSCRIBE_TOPICS.forEach((topic) => client?.unsubscribe(topic));
    client.disconnect();
  }

  client = null;
}

export function publish(topic: string, payload: string): boolean {
  if (!client || !client.isConnected()) {
    return false;
  }

  client.send(topic, payload);
  return true;
}

export function parseSensorValue(payload: string): number | null {
  try {
    const data = JSON.parse(payload);
    if (typeof data.value === 'number') {
      return data.value;
    }
    return null;
  } catch {
    return null;
  }
}

export function parseLampState(payload: string): LampState | null {
  try {
    const data = JSON.parse(payload);
    if (data.state === 'ON' || data.state === 'OFF') {
      return data.state;
    }
    return null;
  } catch {
    return null;
  }
}
