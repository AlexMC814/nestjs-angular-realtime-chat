import { Component } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private chatService: ChatService) {}
  title: any;
  
  ngOnInit() {
    this.title = this.chatService.getMessage();
  }


}
