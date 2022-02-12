import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

import { AlertController } from '@ionic/angular';
import { query, where } from '@firebase/firestore';

export interface Season { id: string;  games?: any}@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  public user: any;
  
  [x: string]: any;
  public folder: string
  selectedData: any
   seasonsO: Observable<any[]>;
  usersArray: any;
  users$: Observable<unknown[]>;
  seasons: AngularFirestoreCollection<Season>;
  users: AngularFirestoreCollection<any>;
  usersO: any;

  constructor(private activatedRoute: ActivatedRoute
    , public authService: AuthService
    ,public alertController: AlertController
    ,public db: AngularFirestore) {

    this.seasons = db.collection<Season>('seasons');
    this.seasonsO = this.seasons.valueChanges()

    
    this.users = db.collection<Season>('users');
    this.usersO = this.users.valueChanges()

    // .pipe( tap(data=>console.log(data)) );
    this.users$ = authService.users$
    
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
  removeSeason(season) {
    this.seasons.doc(season).delete();
  }
  getMember(member) {
    // console.log('member: '+member);
    // console.log(this.users)
    // return this.users[member];
  }
  userIsInSeason(user, seasonId) {
    const s = user.seasons?.find(s=>s.id==seasonId);
    return (!s) ? 'add' : 'remove';
  }
  toggleSeason(user, seasonId) {
    // console.log(user);
    
    const s = user.seasons?.find(s=>s.id==seasonId)
    if (s) {
      user.seasons = user.seasons.filter(s=>s.id!=seasonId)
    } else {
      if (!user.seasons) user.seasons = [];
      user.seasons.push({id: seasonId, games: [], seats: []})
    }
    this.users.doc(user.id).set(user)
  }
  selectSeat(game, seat) {
    
      this.authService.user$.pipe(
        tap(user=>alert(JSON.stringify(user)))
      ).subscribe(user=>{
        // const s = user.seats.find(s=>s.id==seat.id)
        // if (s) {
        //   user.seats = user.seats.filter(s=>s.id!=seat.id)
        // } else {
        //   if (!user.seats) user.seats = [];
        //   user.seats.push({id: seat.id, game: game.id})
        // }
        // this.users.doc(user.id).set(user)
      }
      )
      
  }
  play(id) {location.href='/season/'+id}
  async addGames(season) {
    // console.log(this.users)
    this.currentSeason = season;
    if (!season.games) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Prompt!',
        inputs: [
          {
            name: 'games',
            type: 'textarea',
            placeholder: 'Games Json'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (games) => {
              let g = JSON.parse(games.games);              
              g.forEach((game, index)=>g[index].id=index)
              this.currentSeason.games = g;
              this.seasons.doc(this.currentSeason.id).set(this.currentSeason)
            }
          }
        ]
      });
  
      await alert.present();
    }
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Prompt!',
      inputs: [
        {
          name: 'seasonName',
          type: 'text',
          placeholder: 'Season Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (season) => {
            this.seasons.doc(season.seasonName).set({id: season.seasonName});
            console.log(season);
          }
        }
      ]
    });

    await alert.present();
  }

}
