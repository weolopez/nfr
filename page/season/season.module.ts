import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeasonRoutingModule } from './season-routing.module';
import { SeasonComponent } from './season.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceModule } from '../../services/service.module';
import { AvatarModule } from '../../ui/avatar.module';

@NgModule({
  declarations: [SeasonComponent],
  imports: [
    CommonModule,
    SeasonRoutingModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSnackBarModule,
    ServiceModule,AvatarModule
  ]
})
export class SeasonModule { }
