import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FireService } from '../../services/fire.service';
import { AuthService } from '../../services/auth.service';

export interface Item { name: string; }
@Component({
  selector: 'app-user',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: any;
  public seatPick: any;
  public Obj = Object;
  public id;
  public user;
  constructor(
      private route: ActivatedRoute,
      private db: AngularFirestore,
      private auth: AuthService,
      private fs: FireService
    ) {
      this.items = db.collection('games').valueChanges();
      this.getUser();
  }

  ngOnInit() {
  }
  select(seat) {
    const game = {};
    game[`seats.${seat}.owner`] = '_users$' + this.user.uid;
    this.db.collection('games').doc(this.id)
      .update(game);
  }
  async getUser() {
    this.user = await this.auth.getUser();
  }
}
