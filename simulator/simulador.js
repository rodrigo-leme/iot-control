// Simulador do dispositivo IoT (sensores + lâmpada)
// Execução: npm run simulador

const mqtt = require('mqtt');

const BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const BASE_TOPIC = 'fiap/3ess/iotcontrol-rodrigo';

const TOPICO_TEMPERATURA = `${BASE_TOPIC}/sensor/temperatura`;
const TOPICO_UMIDADE = `${BASE_TOPIC}/sensor/umidade`;
const TOPICO_COMANDO = `${BASE_TOPIC}/lampada/comando`;
const TOPICO_ESTADO = `${BASE_TOPIC}/lampada/estado`;

const client = mqtt.connect(BROKER_URL);

client.on('connect', () => {
  console.log(`Simulador conectado em ${BROKER_URL}`);
  client.subscribe(TOPICO_COMANDO);
  console.log(`Aguardando comandos em ${TOPICO_COMANDO}`);
});

client.on('error', (error) => {
  console.log(`Erro: ${error.message}`);
});

// Recebe o comando da lâmpada e publica o novo estado
client.on('message', (topic, message) => {
  const payload = message.toString();
  console.log(`Comando recebido: ${payload}`);

  let comando;
  try {
    comando = JSON.parse(payload);
  } catch {
    console.log('Comando inválido, ignorado.');
    return;
  }

  if (comando.action === 'ON' || comando.action === 'OFF') {
    const estado = JSON.stringify({ state: comando.action });
    client.publish(TOPICO_ESTADO, estado);
    console.log(`Estado publicado: ${estado}`);
  } else {
    console.log('Ação desconhecida, ignorada.');
  }
});

// Publica temperatura e umidade a cada 5 segundos
setInterval(() => {
  if (!client.connected) {
    return;
  }

  const temperatura = JSON.stringify({ value: Number((20 + Math.random() * 10).toFixed(1)) });
  const umidade = JSON.stringify({ value: Math.round(40 + Math.random() * 30) });

  client.publish(TOPICO_TEMPERATURA, temperatura);
  client.publish(TOPICO_UMIDADE, umidade);
  console.log(`Leituras publicadas: temperatura ${temperatura} | umidade ${umidade}`);
}, 5000);
