import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string
  selectedData: any
   seasonsO: Observable<any[]>;

  constructor(private activatedRoute: ActivatedRoute
    , public authService: AuthService
    ,public db: AngularFirestore) {
    this.seasonsO = db.collection('seasons').valueChanges().pipe(
        tap(data=>console.log(data))
    );
    
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  getNonMember(member) {
    // Object.keys(this.users).filter(u=>u!=member);
    //   this.users.filter(u=>u.id!=member);
  }
  getMember(member) {
    // console.log('member: '+member);
    // console.log(this.users)
    // return this.users[member];
  }
  addMember(member) {
    // console.log(member);
  }
  addSeason(season) {
    // console.log(this.users)
  }

}
