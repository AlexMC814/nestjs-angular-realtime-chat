import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { IRoomPaginate } from '../../../model/room.interface';
import { Observable } from 'rxjs';
import { IUser } from '../../../model/user.interface';
import { AuthService } from '../../../public/services/auth-service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit{
  rooms$: Observable<IRoomPaginate>;
  selectedRoom = null;
  user: IUser;

  constructor(private chatService: ChatService, private authService: AuthService) {
    this.rooms$ = this.chatService.getMyRooms();
    this.user = this.authService.getLoggedInUser();
  }

  
  ngOnInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  ngAfterViewInit(): void {
    this.chatService.emitPaginateRooms(10, 0);
  }

  onSelectRooms(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }
  
  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

}
