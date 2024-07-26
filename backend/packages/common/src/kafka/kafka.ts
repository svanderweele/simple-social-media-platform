import { Consumer, Kafka, Producer } from 'kafkajs';
import { getEnvironmentVariable } from '../utils/env-helper';

let kafka: Kafka | undefined = undefined;
let producer: Producer | undefined = undefined;

export async function setupKafka(): Promise<Kafka> {
  kafka = new Kafka({
    clientId: getEnvironmentVariable('SERVICE_NAME'),
    brokers: [
      `${getEnvironmentVariable('KAFKA_HOST')}:${getEnvironmentVariable('KAFKA_PORT')}`,
    ],
  });
  return kafka;
}

export function getKafkaProducer(): Producer {
  if (!producer) {
    producer = getKafka().producer();
  }

  return producer;
}

export function getKafkaConsumer(id: string): Consumer {
  return getKafka().consumer({
    groupId: getEnvironmentVariable('SERVICE_NAME') + ': ' + id,
    allowAutoTopicCreation: true,
  });
}

export function getKafka(): Kafka {
  if (!kafka) {
    throw new Error('Kafka not setup');
  }

  return kafka;
}
