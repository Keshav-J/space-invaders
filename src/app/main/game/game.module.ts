import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, GameRoutingModule, MatDividerModule],
})
export class GameModule {}
