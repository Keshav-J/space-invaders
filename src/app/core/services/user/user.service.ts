import { Injectable } from '@angular/core';
import { User } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User = {
    name: '',
    score: 0,
  };

  constructor() {}

  getUser(): User {
    return this.user;
  }

  setUserName(name: string): void {
    this.user.name = name;
    localStorage.setItem('user_name', this.user.name);
  }

  setUserScore(score: number): void {
    this.user.score = score;
  }

  setUserFromLocalStorage(): void {
    const userName = localStorage.getItem('user_name');
    if (!!userName) {
      this.user.name = userName;
    }
  }
}
