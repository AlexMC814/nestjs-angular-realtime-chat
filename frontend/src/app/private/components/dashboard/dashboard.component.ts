import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { IRoom } from '../../../model/room.interface';
import { Observable } from 'rxjs';
import { IUser } from '../../../model/user.interface';
import { AuthService } from '../../../public/services/auth-service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  rooms$: Observable<IRoom[]>;
  selectedRoom = null;
  icon: string = 'pi pi-arrow-left'
  isDialogVisible: boolean = false;
  user: IUser;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.rooms$ = this.chatService.getMyRooms();
    this.user = this.authService.getLoggedInUser();
    this.chatService.emitGetRooms();
    this.rooms$.subscribe(res => this.selectedRoom = res[0]);
  }

  ngAfterViewInit(): void {
    this.chatService.emitGetRooms();
  }

  onSelectRooms(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }
}
