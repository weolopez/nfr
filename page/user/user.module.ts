import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import {WebcamModule} from 'ngx-webcam';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AvatarModule } from '../../ui/avatar.module';
@NgModule({
  declarations: [UserComponent],
  imports: [
  CommonModule,
    UserRoutingModule,
    AngularFireStorageModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule,
    WebcamModule,AvatarModule
  ]
})
export class UserModule { }
