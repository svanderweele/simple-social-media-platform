import { Producer } from 'kafkajs';
import { KafkaTopic } from './kafka.topics';
import { getKafkaProducer } from './kafka';

import { Event } from './base-listener';
import { getLogger } from '../utils/logger';

export abstract class BaseProducer<T extends Event> {
  abstract topic: KafkaTopic;
  protected producer: Producer;

  /**
   *
   */
  constructor() {
    this.producer = getKafkaProducer();
  }

  async publish(data: T['data']): Promise<void> {
    try {
      await this.producer.connect();

      await this.producer.send({
        topic: this.topic,
        messages: [{ value: JSON.stringify(data) }],
      });

      await this.producer.disconnect();

      getLogger().info('Sent message ', { data: data, topic: this.topic });
    } catch (err) {
      getLogger().error(
        `Failed to publish message to topic ${this.topic}`,
        err,
      );
    }
  }
}
