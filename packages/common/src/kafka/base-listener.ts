import { Consumer, KafkaMessage } from 'kafkajs';
import { KafkaTopic } from './kafka.topics';
import { getKafkaConsumer } from './kafka';

export interface Event {
  subject: KafkaTopic;
  data: unknown;
}

export abstract class BaseListener<T extends Event> {
  abstract topic: KafkaTopic;
  abstract onMessage(data: T['data'], msg: KafkaMessage): void;
  protected consumer?: Consumer;

  listen(): void {
    this.consumer = getKafkaConsumer(this.topic);

    this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

    console.log('Subscribed to ', this.topic);

    this.consumer.run({
      eachMessage: async ({ message }: { message: KafkaMessage }) => {
        if (!message?.value) return;
        const data = JSON.parse(message.value.toString()) as T['data'];
        this.onMessage(data, message);
      },
    });
  }
}
