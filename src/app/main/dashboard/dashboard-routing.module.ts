import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaveScoreGuard } from 'src/app/core/guards/save-score/save-score.guard';
import { HighscoresComponent } from './highscores/highscores.component';
import { SaveScoresComponent } from './save-scores/save-scores.component';

const routes: Routes = [
  {
    path: '',
    component: HighscoresComponent,
  },
  {
    path: 'highscores',
    component: HighscoresComponent,
  },
  {
    path: 'save',
    canActivate: [SaveScoreGuard],
    component: SaveScoresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
