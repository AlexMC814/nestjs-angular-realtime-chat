import { Component, Input } from '@angular/core';
import { IMessage } from '../../../model/message.interface';
import { IUser } from '../../../model/user.interface';
import { AuthService } from '../../../public/services/auth-service/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message: IMessage;
  user: IUser;
  isOwnMessage: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();
    this.isOwnMessage = this.message.user.id === this.user.id;
  }
}
