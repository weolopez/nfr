import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoleComponent } from './hole.component';

const routes: Routes = [
  { path: '', component: HoleComponent },
  { path: ':golfround', component: HoleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
