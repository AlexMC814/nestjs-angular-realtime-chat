import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IRoom } from '../../../model/room.interface';
import { map, Observable } from 'rxjs';
import { IMessagePaginate } from '../../../model/message.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
})
export class ChatRoomComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private chatService: ChatService) {}

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  @Input() chatRoom: IRoom;
  messages$: Observable<IMessagePaginate>;

  ngOnInit() {
    this.messages$ = this.chatService.getMessages().pipe(
      map((messagePaginate: IMessagePaginate) => {
        const items = messagePaginate.items.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        messagePaginate.items = items;
        return messagePaginate;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.info(changes['chatRoom'].previousValue);
    // this.chatService.leaveRoom(changes['chatRoom'].previousValue);

    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    this.chatService.sendMessage({
      text: this.chatMessage.value,
      room: this.chatRoom,
    });
    this.chatMessage.reset();
  }
}
