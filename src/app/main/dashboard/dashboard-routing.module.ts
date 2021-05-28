import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    component: SaveScoresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
