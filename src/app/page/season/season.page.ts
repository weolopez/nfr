import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

export interface Season { id: string;  games?: any}

@Component({
  selector: 'app-season',
  templateUrl: './season.page.html',
  styleUrls: ['./season.page.scss'],
})
export class SeasonPage implements OnInit {
  selectedData: any;
  usersArray: any;
  users$: Observable<unknown[]>;
  users: AngularFirestoreCollection<any>;
  usersO: any;
  currentSeasonID: string;
  currentSeason: any;
  currentUser: any;
  games: any;

  constructor(private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public alertController: AlertController,
    public db: AngularFirestore) {


    this.users = db.collection<Season>('users');
    this.usersO = this.users.valueChanges();

    // .pipe( tap(data=>console.log(data)) );
    this.users$ = authService.users$;
    
    authService.getUser().subscribe(user => {
      this.currentUser = user;
    })

  }

  ngOnInit() {
    this.currentSeasonID = this.activatedRoute.snapshot.paramMap.get('id');
    this.db.collection<Season>('seasons').doc(this.currentSeasonID).valueChanges().subscribe(
      data => {
        this.games = data.games;
      })
  }
  switchUser(user) {
    this.currentUser = user;
  }
  userIsInSeason(user) {
    const s = user.seasons?.find(s => s.id == this.currentSeasonID);
    return (s);
  }
  toggleSeason(user) {
    // console.log(user);
    const s = user.seasons?.find(s => s.id == this.currentSeasonID);
    if (s) {
      user.seasons = user.seasons.filter(s => s.id != this.currentSeasonID);
    } else {
      if (!user.seasons)
        user.seasons = [];
      user.seasons.push({ id: this.currentSeasonID, games: [], seats: [] });
    }
    this.users.doc(user.id).set(user);
  }
  selectSeat(game, seat) {
    this.currentUser.seasons.find(s => {
      if (s.id == this.currentSeasonID) {

        if (!s.games) s.games = []
        s.games.push( { id: game.id, seat: seat } )
        alert(JSON.stringify(s)+ JSON.stringify(game));

      } 
    })
  }
  edit() {
    location.href = '/folder/seasons'
  }

}
