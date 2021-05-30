export interface IUser {
  name: string;
  score: number;
}

export interface IScore {
  _id: number;
  name: string;
  score: number;
}

export interface IGameControls {
  left: boolean;
  up: boolean;
  right: boolean;
  down: boolean;
  shoot: boolean;
  sprint: number;
}

export interface IObject {
  height: number;
  width: number;
}

export interface IMousePointer {
  x: number;
  y: number;
}
