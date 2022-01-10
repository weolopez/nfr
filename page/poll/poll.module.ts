import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollRoutingModule } from './poll-routing.module';
import { PollComponent } from './poll.component';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [PollComponent],
  imports: [
    CommonModule,
    PollRoutingModule,
    MatListModule
  ]
})
export class PollModule { }
