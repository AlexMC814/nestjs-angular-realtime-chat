import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../../model/user.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  findByUsername(username: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`api/users/find-by-username?username=${username}`);
  }

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('api/users', user).pipe(
      tap((createdUser: IUser) => this.snackbar.open(
        `User ${createdUser.username} created successfully`, 
        'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
      })),
      catchError(e => {
        this.snackbar.open(`User could not be created, due to: ${e?.error?.message}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
        console.error('ERROR', e);
        return throwError(() => new Error(e));
      })
    );
  }
}
