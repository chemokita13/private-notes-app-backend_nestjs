import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Note } from './note.interface';
import { InjectModel } from '@nestjs/mongoose';
import { NoteDTO } from './noteDTO';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note') // notes collection
    private readonly noteModel: Model<Note>,
  ) {}
  async getNotes(userID: string): Promise<Note[]> {
    // get notes whose author is userID
    return await this.noteModel.find({ author: userID });
  }
  async getOneNote(userID: string, noteID: string): Promise<Note> {
    return await this.noteModel.findOne({ _id: noteID, author: userID });
  }
  async newNote(userID: string, newNote: NoteDTO): Promise<Note> {
    const noteToSave = await this.noteModel.create({
      ...newNote,
      author: userID,
    });
    return await noteToSave.save();
  }
  async deleteNote(userID: string, noteID: string): Promise<Note> {
    const noteToDelete = await this.noteModel.findOne({
      _id: noteID,
      author: userID,
    });
    return await noteToDelete.remove();
  }
  async updateNote(
    userID: string,
    noteID: string,
    note: NoteDTO,
  ): Promise<Note> {
    return await this.noteModel.findOneAndUpdate(
      {
        _id: noteID,
        author: userID,
      },
      note,
      { new: true },
    );
  }
}
