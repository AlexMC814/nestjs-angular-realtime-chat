import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test, TestService } from './services/test-service/test.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private testService: TestService) {}
  testValue$!: Observable<Test>;
  
  ngOnInit() {
    this.testValue$ = this.testService.getTest();
  }

}
