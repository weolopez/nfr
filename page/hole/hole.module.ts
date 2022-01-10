import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './hole-routing.module';
import { HoleComponent } from './hole.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import {WebcamModule} from 'ngx-webcam';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { SliderComponent } from '../../ui/slider.component';
import { WebCamComponent } from '../../ui/webcam.component';
@NgModule({
  declarations: [
    HoleComponent, 
    SliderComponent,
    WebCamComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AngularFireStorageModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule,
    WebcamModule
  ]
})
export class HoleModule { }
