import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';
//require('dotenv').config();

@Module({
  imports: [
    UsersModule,
    NotesModule,
    MongooseModule.forRoot(
      process.env.BD_URI || 'mongodb://localhost/private-notes-app',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
