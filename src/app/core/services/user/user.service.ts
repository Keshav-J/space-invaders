import { Injectable } from '@angular/core';
import { DUser } from '../../constants/defaults';
import { IUser } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: IUser = DUser;

  constructor() {}

  /**
   * Get the current User details
   * @returns Current User details
   */
  getUser(): IUser {
    return this.user;
  }

  /**
   * Set name of the User
   * @param name Name of the user
   */
  setUserName(name: string): void {
    this.user.name = name;
    localStorage.setItem('user_name', this.user.name);
  }

  /**
   * Set score of the User
   * @param score Score of the user
   */
  setUserScore(score: number): void {
    this.user.score = score;
  }

  /**
   * Set User details fetched from localStorage
   */
  setUserFromLocalStorage(): void {
    const userName = localStorage.getItem('user_name');
    if (!!userName) {
      this.user.name = userName;
    }
  }

}
