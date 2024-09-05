import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../../../model/user.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../../public/services/user-service/user.service';

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrl: './select-users.component.scss'
})
export class SelectUsersComponent implements OnInit {
  constructor(private userService: UserService) {}

  @Input() users: IUser[] = [];
  @Output() addUser: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() removeUser: EventEmitter<IUser> = new EventEmitter<IUser>();
  selectedUser: IUser;

  searchUsername = new FormControl();
  filteredUsers: IUser[] = [];

  displayFn(user: IUser) {
    if(user) {
      return user.username;
    }

    return '';
  }

  setSelectedUser(user: IUser) {
    this.selectedUser = user;
  }

  addUserToForm() {
    this.addUser.emit(this.selectedUser);
    this.filteredUsers = [];
    this.selectedUser = null;
    this.searchUsername.setValue(null);
  }

  removeUserFromForm(user: IUser) {
    this.removeUser.emit(user);
  }

  ngOnInit(): void {
    this.searchUsername.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((username: string) => this.userService.findByUsername(username).pipe(
        tap((users: IUser[]) => this.filteredUsers = users)
      ))
    ).subscribe();
  }
}
