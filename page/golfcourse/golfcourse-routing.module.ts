import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GolfCourseComponent } from './golfcourse.component';

const routes: Routes = [
  { path: '', component: GolfCourseComponent },
  { path: ':golfround', component: GolfCourseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
