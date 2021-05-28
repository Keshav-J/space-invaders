import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HighscoresComponent } from './highscores/highscores.component';
import { SaveScoresComponent } from './save-scores/save-scores.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HighscoresComponent, SaveScoresComponent],
  imports: [CommonModule, DashboardRoutingModule, ReactiveFormsModule],
})
export class DashboardModule {}
