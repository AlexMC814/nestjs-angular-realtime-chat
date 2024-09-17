import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import groupBy from 'lodash/groupBy';
import { IRoom } from '../../../model/room.interface';
import { combineLatest, Observable, startWith, map, tap } from 'rxjs';
import { IMessage, IMessagePaginate } from '../../../model/message.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../public/services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
})
export class ChatRoomComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) {}

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  @ViewChild('messages') private scroller: ElementRef;

  @Input() chatRoom: IRoom;
  messages$: Observable<IMessagePaginate>;

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
    const allMesasages$: Observable<IMessagePaginate> =
      this.chatService.getMessages();
    const addedMessage$: Observable<IMessage> =
      this.chatService.getAddedMessage();

    this.messages$ = combineLatest([
      allMesasages$,
      addedMessage$.pipe(startWith(null)),
    ]).pipe(
      map(([messagePaginate, message]) => {
        if (
          message &&
          message.room.id === this.chatRoom.id &&
          !messagePaginate.items.some((m) => m.id === message.id)
        ) {
          messagePaginate.items.push(message);
        }
        messagePaginate.items.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        return messagePaginate;
      }),
      tap(() => {
        if (this.chatRoom) this.scrollToBottom();
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.chatRoom) {
      this.scrollToBottom();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.leaveRoom(changes['chatRoom'].previousValue);

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

  scrollToBottom() {
    setTimeout(() => {
      this.scroller.nativeElement.scrollTop =
        this.scroller.nativeElement.scrollHeight;
    }, 1);
  }
}
