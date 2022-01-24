import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AlertController, Platform } from '@ionic/angular';

export interface Season { id: string;  games?: any}

@Component({
  selector: 'app-season',
  templateUrl: './season.page.html',
  styleUrls: ['./season.page.scss'],
})
export class SeasonPage implements OnInit {
  selectedData: any;
  usersArray=[];
  users$: Observable<unknown[]>;
  users: AngularFirestoreCollection<any>;
  currentSeasonID: string;
  currentSeason: any;
  currentUser: any;
  games: any;
  season: any;
  seasonO: any;
  usersO: Observable<any[]>;
  isAdmin: boolean;
  devWidth: number;

  constructor(private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public alertController: AlertController,
    public db: AngularFirestore,
    public platform: Platform) {

    this.devWidth = this.platform.width();

    this.users = db.collection<Season>('users');
    this.usersO = this.users.valueChanges();
    //get all users from usersO
    this.usersO.pipe(tap((u:any)=>this.usersArray=u)).subscribe()

    // .pipe( tap(data=>console.log(data)) );
    this.users$ = authService.users$;
    
    authService.getUser().subscribe(user => {
      this.isAdmin = (user.displayName =='Mauricio Lopez');
    })

  }

  getPictureFromID(id) {
    return this.usersArray.filter(u=>u.id==id)[0].photoURL
  }
  ngOnInit() {
    this.currentSeasonID = this.activatedRoute.snapshot.paramMap.get('id');
    this.seasonO = this.db.collection<Season>('seasons').doc(this.currentSeasonID)
    this.seasonO.valueChanges().subscribe(
      data => {
        this.season = data;
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
    game[seat] = (game[seat]) ? null : {id: this.currentUser.id, name: this.currentUser.displayName};
    this.seasonO.set(this.season);
            
  }
  edit() {
    location.href = '/folder/seasons'
  }
  shuffle() {

  }
  save() {

  }
  refresh() {

  }
}
