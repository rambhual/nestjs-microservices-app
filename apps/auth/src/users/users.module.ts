import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserDocument, UserSchema } from './models/user.schema';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
