import { Controller, Get } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Get('/notes')
  getNotes(): Promise<string> {
    return this.notesService.getNotes();
  }
}
