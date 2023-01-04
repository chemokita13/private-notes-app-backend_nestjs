import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { serialize } from 'Cookie';
import { NoteDTO } from './noteDTO';
import { verify } from 'crypto';

@Controller('/notes')
export class NotesController {
  private readonly jwt_Secret = process.env.SECRET || 'hard_secret'; // for be more secure must add secret string in an env var

  // Verify a token by decoding it and returning the user stored in it
  verifyToken(token: string): string {
    const { user } = jwt.verify(token, this.jwt_Secret);
    return user;
  }
  constructor(private readonly notesService: NotesService) {}
  @Get()
  async getNotes(@Req() request: Request, @Res() response: Response) {
    try {
      const user = this.verifyToken(request.cookies.token);
      const notes: NoteDTO[] = await this.notesService.getNotes(user);
      return response.json(notes);
    } catch (error) {
      return response.status(400).send('Invalid token');
    }
  }
  @Get('/:id')
  async getOneNote(@Req() request: Request, @Res() response: Response) {
    try {
      const user = this.verifyToken(request.cookies.token);
      const note = await this.notesService.getOneNote(user, request.params.id);
      return response.json(note);
    } catch (error) {
      return response.status(500).json({ message: 'internal server error' });
    }
  }
  @Post()
  async newNote(@Req() request: Request, @Res() response: Response) {
    let noteSaved;
    try {
      const user = this.verifyToken(request.cookies.token);
      // req.body have to be the note to save
      noteSaved = await this.notesService.newNote(user, request.body);
    } catch (error) {
      return response.status(500).json({ message: 'Internal Server Error' });
    }
    return response.json(noteSaved);
  }
  @Delete('/:id')
  async noteDelete(@Req() request: Request, @Res() response: Response) {
    try {
      const user = this.verifyToken(request.cookies.token);
      const noteDeleted = await this.notesService.deleteNote(
        user,
        request.params.id,
      );
      return response.json(noteDeleted); // return note deleted
    } catch (error) {
      return response.status(500).json({ message: 'Error deleting note' });
    }
  }
  @Put(':id')
  async noteUpdate(@Req() request: Request, @Res() response: Response) {
    try {
      const user = this.verifyToken(request.cookies.token);
      const noteUpdated = await this.notesService.updateNote(
        user,
        request.params.id,
        request.body,
      );
      return response.json(noteUpdated);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  }
}
