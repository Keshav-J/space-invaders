import { IGameControls, IMousePointer, IObject, IScore, IUser } from '../models/models';

// Default values for the playing User
export const DUser: IUser = {
  name: '',
  score: 0,
};

// Default list of Highscores
export const DScores: IScore[] = [];

// List of default values for Game Component
export const DGameDifficulty = 2;
export const DGameSprintSpeed = 2.5;
export const DGameControls: IGameControls = {
  left: false,
  up: false,
  right: false,
  down: false,
  shoot: false,
  sprint: 1,
};
export const DMousePointer: IMousePointer = {
  x: 0,
  y: 0,
};
export const DGameScore = 0;
export const DGameLife = 0;
export const DGameLevel = -1;

export const DPlayer: IObject = {
  height: 20,
  width: 30
};
export const DUfo: IObject = {
  height: 30,
  width: 40
};
export const DBullet: IObject = {
  height: 10,
  width: 2
};
