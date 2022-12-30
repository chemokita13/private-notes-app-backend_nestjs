import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Note } from './note.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note') // notes collection
    private readonly noteModel: Model<Note>,
  ) {}
  async getNotes(): Promise<string> {
    console.log(await this.noteModel.find({}));
    return 'getting notes';
  }
}
