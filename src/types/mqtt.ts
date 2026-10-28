export type ConnectionStatus = 'conectando' | 'conectado' | 'desconectado' | 'erro';

export type LampState = 'ON' | 'OFF';

export type MessageDirection = 'enviada' | 'recebida';

export interface SensorReading {
  value: number;
  time: string;
}

export interface LampReading {
  state: LampState;
  time: string;
}

export interface HistoryMessage {
  id: string;
  topic: string;
  payload: string;
  direction: MessageDirection;
  time: string;
}
