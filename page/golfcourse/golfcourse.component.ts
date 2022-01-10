import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';

export interface Item { name: string; }
@Component({
  selector: 'app-golfcourse',
  templateUrl: './golfcourse.component.html',
  styleUrls: ['./golfcourse.component.scss']
})
export class GolfCourseComponent {
  showHole = false;
  holes;
  golfcourses;
  golfround;
  rounds;  
  games: any;
  currentUser: any;
  user: Observable<any>;
  roundCollection: any;
  currentHole=1;
  golfCourseCollection: any;
  golfcourseObs: any;
  golfRoundObs: any;
  filteredUsersObs: Observable<any>;

  currentHoleMap: any;
  holeImage: any;
  golfcourse: any;
  showWebcam: boolean;

  longitude;// = '33.83022440672791%2C';
  latitude;// = '84.26114365958082';

  public z = '18';
  public map;// = `https://www.google.com/maps/d/u/0/embed?mid=1oN3xm32Sdhe3b7-5PDCZRBL5sGAWyjC-&ll=${this.longitude}-${this.latitude}&z=${this.z}`;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private auth: AuthService,
    public sanitizer:DomSanitizer
  ) {

      
    this.user =  this.auth.getUser();
    this.filteredUsersObs =  db.collection('users').valueChanges()
             .pipe(map((users: Array<any>) => {
               let u = users.filter(u=> { 
                   return (u.golfrounds) ? (u.golfrounds[this.golfround]) ? true : false : false;
               });
               return u;
             })); 

    this.golfround = this.route.snapshot.paramMap.get('golfround');

    this.golfCourseCollection = db.collection('golfcourse');
    this.golfcourses = db.collection('golfcourse').valueChanges();
    
    this.roundCollection = db.collection('golfround');
    this.rounds = this.roundCollection.valueChanges();

    if (this.golfround) {
      this.golfRoundObs = this.roundCollection.doc(this.golfround);
      this.roundCollection.doc(this.golfround).valueChanges()
        .pipe(map((round: any) => {
          this.golfcourse = round.name;
          this.golfcourse = this.golfCourseCollection.doc(this.golfcourse);
          this.golfcourseObs = this.golfcourse.valueChanges();
          return round;
        })).subscribe();

      
      window.document.title = this.golfround;

    } 
    this.getCurrentLocation();
  }

  //depricated... use observables
  getKey(seat) {
    let key = Object.keys(seat)[0];
    if (!this.games) return;
    let game = this.games.filter(game => game.id == key);
    game[0].seat = seat[key];
    return game;
  }

  switchUser(id) {
    if (this.auth.root != "yLWEBMNYfleyhc4mG7aDPhSHSYe2") return;
    this.auth.switchUser(id);
     this.user =  this.auth.getUser();
  }

  getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  }


  getPar(g) {
    return g.holes.reduce((sum, h) => sum + h.par, 0);
  }
  newRound(g, name) {
    let round = {
      id: name,
      name: g.id,
      date: this.getToday()
    };
    this.roundCollection.doc(name)
      .set(round);
  }
  join(g, currentUser) {
    g.members = (g.members) ? g.members : [];
    if (g.members.includes(currentUser.uid)) return;
    this.auth.getUser().subscribe(u => {
      g.members.push(u.uid);
      u.golfrounds = (u.golfrounds) ? u.golfrounds : {};
      this.roundCollection.doc(g.id).update(g);
      if (!u.golfrounds[g.id]) {
        let round = {
          golfcourse: g.name,
          score: { 0:0 }
        }
        u.golfrounds[g.id]=round;
        this.db.collection('users').doc(u.uid).update(u);
      }
    })
  }
  getScore(user, currentHole) {
    if (!user) return 0;
    if (!user.golfrounds) return 0;
    let score = user.golfrounds[this.golfround].score;

    if  (currentHole) {
      return (score[currentHole]) ? score[currentHole] : 0
    } else {
      let s = 0;
      Object.keys(score).forEach(k=> {
        s = s + score[k];
      })
      return s;
    } 
  }
  changeScore(h, change, currentUser) {
    this.currentHole = h.hole;
    if (!this.currentHole) alert("bam");
    if (!currentUser.golfrounds[this.golfround].score[this.currentHole])
    currentUser.golfrounds[this.golfround].score[this.currentHole]=1;
    currentUser.golfrounds[this.golfround].score[this.currentHole] += change;
    this.db.collection('users').doc(currentUser.uid).update(currentUser);
  }

  //TODO REMOVE SCROLL
  onScroll(event) {
    let t = event.currentTarget;
    let c = Array.from(t.children);
    let parentRec = t.getBoundingClientRect();
    let guessH = 1;

    c.forEach((element: any) => {
      let rect = element.getBoundingClientRect();
      let k={};
      for (var key in parentRec) {
        k[key]=Math.abs(parentRec[key]-rect[key]);
      }
      let h = element.getAttribute('value');
      // console.log(k['left']);
      if (k['left'] < 5) {
        this.currentHole = h;
      }
    });
  }
  
  viewHole(h) {
    this.holeImage = h.image;
    if (!this.holeImage) {
      this.holeImage = "http://via.placeholder.com/640x360"
    }

    if (!h.map && !this.holeImage) {
      this.showWebcam = true; 
    } else {
      this.currentHoleMap = this.sanitizer.bypassSecurityTrustResourceUrl(h.map);
    }
    this.showHole = !this.showHole;

  }
  getUrl(url) {
    url = (url) ? url : 'http://via.placeholder.com/640x360'
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  changeURL(i, course) {
    course.holes[this.currentHole].image = i;
    this.golfcourse.set(course)
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.map = `https://www.google.com/maps/d/u/0/embed?mid=1oN3xm32Sdhe3b7-5PDCZRBL5sGAWyjC-&ll=${this.latitude}-${this.longitude}&z=${this.z}`;
      });
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}
