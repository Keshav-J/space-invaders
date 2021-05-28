import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user/user.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.setUserFromLocalStorage();
  }
}
