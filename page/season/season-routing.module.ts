import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeasonComponent } from './season.component';

const routes: Routes = [
  { path: '', component: SeasonComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeasonRoutingModule { }
