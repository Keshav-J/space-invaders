import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ROUTES } from './core/constants/urlconstants';

const routes: Routes = [
  {
    path: ROUTES.GAME,
    loadChildren: () =>
      import('src/app/main/game/game.module').then((m) => m.GameModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('src/app/main/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
