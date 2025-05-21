import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users.service.js';
import { LessThan } from 'typeorm';

@Injectable()
export class AnonymizeTask {
  private readonly logger = new Logger(AnonymizeTask.name);

  constructor(private usersService: UsersService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    this.logger.log('Running GDPR anonymization task');
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const usersToAnon = await this.usersService['repo'].find({
      where: { deletedAt: LessThan(threshold) },
    });
    for (const user of usersToAnon) {
      user.email = `anon+${user.id}@example.com`;
      user.fullName = 'Anonymized User';
      await this.usersService['repo'].save(user);
    }
    if (usersToAnon.length) this.logger.log(`Anonymized ${usersToAnon.length} users.`);
  }
}
