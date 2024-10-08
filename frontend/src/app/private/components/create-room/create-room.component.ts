import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../../model/user.interface';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss',
})
export class CreateRoomComponent {
  constructor(
    private router: Router,
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute
  ) {}
  @Input() visible: boolean;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    users: new FormArray([], [Validators.required]),
  });

  create() {
    if (this.form.valid) {
      this.chatService.createRoom(this.form.getRawValue());
      this.router.navigate(['../dashboard'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  hideDialog() {
    this.closeDialog.emit(false)
  }

  initUser(user: IUser) {
    return new FormControl({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }

  addUser(userFormControl: FormControl) {
    this.users.push(userFormControl);
  }

  removeUser(userId: number) {
    this.users.removeAt(
      this.users.value.findIndex((user: IUser) => user.id === userId)
    );
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }
}
