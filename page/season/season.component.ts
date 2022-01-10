import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, pipe, forkJoin, of, timer, interval } from 'rxjs';
import { FireService } from '../../services/fire.service';
import { tap, filter, map, mergeMap, ignoreElements, finalize, combineLatest, take, merge } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AuthService } from '../../services/auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../services/chat.service';

export interface Season {
  id: string;
  currentRound?: number;
  rounds?: number;
  gamesCount?: number;
  usersCount?: number;
  games?: any[];
  members?: any[];
  seats?: any[];
  nextPick?: any;
  messages?: Array<string>;
}

export interface User {
  id: string;
  photoURL: string;
  displayName: string;
  star: any;
  seats: any;
}
export interface Seat {
  id: string;
}
export interface Game {
  id: string;
  date: string;
  seats?: any;
  away?: any;
}

export interface Item { name: string; }
@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {
  public iseason = {
    id: '',
    currentRound: 0,
    rounds: '',
    members: [
    ]
  };
  private itemDoc: AngularFirestoreDocument<Item>;
  public currentSeason;
  season: Season;
  seasonRef: AngularFirestoreDocument<unknown>;
  seasonObs: Observable<unknown>
  usersRef: AngularFirestoreDocument<unknown>
  usersObs: Observable<unknown[]>;
  
  loggedInUser: User;
  seats: Observable<unknown[]>;
  games: Observable<unknown>;
  seatCount = 0;
  users: Array<User>;
  seasonDetails: boolean;
  readcount = 0;
  try = true;
  newSeason: any;
  gameVisibility=[];
  gameStar=[];
  constructor(

    public cs: ChatService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public db: AngularFirestore,
    fs: FireService,
    public auth: AuthService,
  ) {
    auth.getUser().subscribe(user => {
      this.changeUser(user);
    })
    this.currentSeason = this.route.snapshot.paramMap.get('id');
    
    this.seasonRef = db.collection('seasons').doc(this.currentSeason);
    this.seasonObs = this.seasonRef.valueChanges();
    this.seasonObs.subscribe( (s: Season) => this.season = s);
    this.cs.get(this.currentSeason).subscribe( s => {
      if (!s.messages) s.messages = [];
      if (s.messages.length>this.readcount) {
        this.snackBar.open(s.messages[s.messages.length-1].content, 'Close', {
          duration: 3000
        });
        this.readcount = s.messages.length;
      }
    });

    this.usersObs = this.db.collection('users', ref =>
      ref.where('season', '==', this.currentSeason)).valueChanges();
      this.usersObs.subscribe( (u: Array<User>)=>this.users=u);

    this.seats = this.db.collection('seats', ref =>
      ref.where('season', '==', this.currentSeason)).valueChanges();

    this.seats.subscribe(seats => {
      this.seatCount = seats.length;

      this.db.collection('teams').get().subscribe(t => {
        let teams = {};
        t.forEach(data => {
          let team = data.data();
          teams[team.id] = team;
        })


        this.games = this.db.collection('users', ref => ref.where('season', '==', this.currentSeason)).valueChanges()
          .pipe(mergeMap(users => this.db.collection('games', ref => ref.where('season', '==', this.currentSeason)).valueChanges()
            .pipe(map(games => {
              let usersObject = {};
              users.forEach(user => {
                if (!user['seats']) user['seats']=[];
                user['seats'].forEach(g => {
                  const GAMEID = Object.keys(g)[0];
                  const SEATID = g[GAMEID];
                  const USERID = user['id'];
                  usersObject[GAMEID] = (usersObject[GAMEID]) ? usersObject[GAMEID] : {};
                  usersObject[GAMEID][SEATID] = USERID;
                })
              });
              games.map((game: Game) => {
                game.seats = {};
                seats.forEach((seat: Seat) => {
                  game.seats[seat.id] = (usersObject[game.id] && usersObject[game.id][seat.id]) ?
                    usersObject[game.id][seat.id] : seat.id;
                });
                game.away = teams[game.away.split('/')[1]];
              });
              return games;
            }))
          ))

      })
    })
}

  ngOnInit() {
  }

  setNewSeason(users: Array<any>) {
    this.db.collection('seasons').doc(this.currentSeason).set({ id: this.currentSeason, currentRound: 1, members: [] });
    this.games.subscribe(games => this.update({ gamesCount: games['length'] }));
    this.update({ usersCount: users.length, members: users.map(u => u.id), nextPick: 0 });
    this.seats.subscribe(seats => this.update({ seatsCount: seats.length }));
    this.cs.create(this.currentSeason);
  }
  startRound(season) {
    const rounds = (season.gamesCount * season.seatsCount) / season.usersCount;
    if (season.currentRound < (season.gamesCount * season.seatsCount) / season.usersCount) {
      this.update({ currentRound: season.currentRound + 1 });
    } else {
      this.update({ currentRound: 0 });
    }
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  update(data) {
    this.seasonRef.update(data);
  }
  star(id) {
    const star=this.loggedInUser.star;
    star[id]=!star[id];
    this.db.doc('users/'+this.loggedInUser.id).set({star}, { merge: true } ); 
  }
  pick(game: Game, seat, season) {
    let message = (game.seats[seat].length>1) ? 'Seat '+seat+' Not Available' :
      (season.members[season.nextPick] !== this.loggedInUser.id) ?
        'It is ' + this.users.filter(u=>u.id===season.members[season.nextPick] )[0].displayName  +' turn' : null;
    if (message) {
      this.snackBar.open(message, 'Close', {
        duration: 3000
      });
      return;
    }
    this.db.doc('users/' + season.members[season.nextPick])
      .snapshotChanges().subscribe(user => {
        const data = user.payload.data();
        let s = {};
        s[game.id] = seat;
        const seats = data;
        if (!seats['seats']) seats['seats']=[];
        const result = seats['seats'].filter(aseat => {
          return JSON.stringify(aseat) === JSON.stringify(s);
        });
        if (result.length > 0) return;
        seats['seats'].push(s);
        user.payload.ref.update(seats);
        let nextpi = season.nextPick + 1;
        let nextRound = season.currentRound;
        if (nextpi >= season.usersCount) {
          nextpi = 0;
          nextRound = nextRound + 1;
        }
        message = this.loggedInUser.displayName + ' selected seat ' 
        + seat + ' on ' + game.date;
        this.submit( message );
        this.update({
          nextPick: nextpi,
          currentRound: nextRound
        })
      })
  }
  changeUser(user) {
    if (this.auth.userId != 'yLWEBMNYfleyhc4mG7aDPhSHSYe2') return;
    if (!user.star) user.star = {};
    this.loggedInUser = user;
  }

  addUser(user) {
    this.db.doc('users/' + user.uid).update({ id: user.uid, season: this.currentSeason, seats: [] });
  }
  removeUser(user) {
    this.db.doc('users/' + user.id).update({ season: '' });
  }
  getNextPick(season, users) {
    const np = season.members[season.nextPick];
    return users.filter(user => user.id === np)[0];
  }
  getLength(seats) { return Object.keys(seats); }

  submit(newMsg) {
    this.cs.sendMessage(newMsg, this.currentSeason);
  }
  order(users) {
    if (!users) return users;
    return users.sort((a,b) => {
      let adex = this.season.members.findIndex(e=>e==a.id);
      let bdex = this.season.members.findIndex(e=>e==b.id);
      return (adex>bdex)?1:-1;
    })
  }
}
