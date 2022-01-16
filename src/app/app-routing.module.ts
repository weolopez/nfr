import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'season/:id',
    loadChildren: () => import('./page/season/season.module').then( m => m.SeasonPageModule)
  },
  // { path: 'seasons/:id',
  //   loadChildren: () => import('./page/season/season.module').then(m => m.SeasonModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'poll',
  //   loadChildren: () => import('./page/poll/poll.module').then(m => m.PollModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'edit',
  //   loadChildren: () => import('./page/edit/edit.module').then(m => m.EditModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'hole',
  //   loadChildren: () => import('./page/hole/hole.module').then(m => m.HoleModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'golfcourse',
  //   loadChildren: () => import('./page/golfcourse/golfcourse.module').then(m => m.GolfCourseModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'user',
  //   loadChildren: () => import('./page/user/user.module').then(m => m.UserModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'game',
  //   loadChildren: () => import('./page/game/game.module').then(m => m.GameModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: 'games',
  //   loadChildren: () => import('./page/games/games.module').then(m => m.GamesModule),
  //   canActivate: [AuthGuard]
  // },
  // { path: '', component: HomeComponent },
  // { path: 'chats/:id', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
