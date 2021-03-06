import { Controller, Get } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client:{
        brokers:['localhost:9093'],
      },
      consumer:{
        groupId: 'ec-consumer'
      }
    }
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('storage-ec')
    await this.client.connect();
  }

  @Get()
  sendToStorage() {
    return this.client.send('storage-ec',{
      message: 'Remove pizza from storage'
    });
  }
}
