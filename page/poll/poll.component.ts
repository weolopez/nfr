import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { name: string; }
@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.items = db.collection('polls').valueChanges();
  }

  ngOnInit() {
  }

}
