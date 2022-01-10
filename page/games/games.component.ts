import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from '@firebase/util';
import { FireService } from '../../services/fire.service';
import { AuthService } from '../../services/auth.service';

export interface Item { name: string; }

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;

  public seatPick: any;
  public Obj = Object;
  public id;
  public user;
  public gamez = [
    {
      "id": "atlanta-united",
      "name": "Atlanta United FC",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/atl.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "chicago-fire",
      "name": "Chicago Fire",
      "images": [
        "https://league-mp7static.mlsdigital.net/1207_200x200-0.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "fc-cincinnati",
      "name": "FC Cincinnati",
      "images": [
        "https://league-mp7static.mlsdigital.net/CIN-Logo480px_2.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "colorado-rapids",
      "name": "Colorado Rapids",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/436_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "columbus-crew-sc",
      "name": "Columbus Crew SC",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/CCSC-200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "fc-dallas",
      "name": "FC Dallas",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/1903_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "dc-united",
      "name": "D.C. United",
      "images": [
        "https://league-mp7static.mlsdigital.net/1326_200x200b.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "houston-dynamo",
      "name": "Houston Dynamo",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/1897_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "inter_miami_cf",
      "name": "INTER MIAMI CF",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/1897_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "nashville_sc",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/1897_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ],
      "name": "Nashville SC"
    },
    {
      "id": "lafc",
      "name": "Los Angeles Football Club",
      "images": [
        "https://league-mp7static.mlsdigital.net/98765_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "la-galaxy",
      "name": "LA Galaxy",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/1230_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "minnesota-united",
      "name": "Minnesota United FC",
      "images": [
        "https://league-mp7static.mlsdigital.net/6977-200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "montreal-impact",
      "name": "Montreal Impact",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/1616_200x200_0.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "new-england-revolution",
      "name": "New England Revolution",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/928_200x200_0.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "new-york-city-fc",
      "name": "New York City FC",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/nycfc-200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "new-york-red-bulls",
      "name": "New York Red Bulls",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/399_200x200_0.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "orlando-city",
      "name": "Orlando City SC",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/6900.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "philadelphia-union",
      "name": "Philadelphia Union",
      "images": [
        "https://league-mp7static.mlsdigital.net/5513_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "portland-timbers",
      "name": "Portland Timbers",
      "images": [
        "https://league-mp7static.mlsdigital.net/1581_200x200-0.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "real-salt-lake",
      "name": "Real Salt Lake",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/1899_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "san-jose-earthquakes",
      "name": "San Jose Earthquakes",
      "images": [
        "https://league-mp7static.mlsdigital.net/1131_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "seattle-sounders",
      "name": "Seattle Sounders FC",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/3500_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "sporting-kansas-city",
      "name": "Sporting Kansas City",
      "images": [
        "https://league-mp7static.mlsdigital.net/421_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "toronto-fc",
      "name": "Toronto FC",
      "images": [
        "https://league-mp7static.mlsdigital.net/mp6/2077_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    },
    {
      "id": "vancouver-whitecaps",
      "name": "Vancouver Whitecaps FC",
      "images": [
        "https://league-mp7static.mlsdigital.net/1708_200x200.png",
        "https://league-mp7static.mlsdigital.net/styles/image_thumbnail/s3/images/mls-logo.png?null&itok=gOJ49TyJ&c=cb3748b521321e50a5653a3d134a10f1"
      ]
    }
  ];
  teams = [];
  seats = [];
  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    fs: FireService
  ) {
    db.collection('seats').get().subscribe(t => {
      t.forEach(data => this.seats.push(data.data()))
    });

    db.collection('teams').get().subscribe(t => {
      t.forEach(data => this.teams.push(data.data()))
    });
    this.items = fs.deepGetCollection('games');
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
  getGamez() {
    this.fetchSeason();
    // this.gamez.forEach(game => {
    //   this.db.collection('teams').add(game);
    // })
  }
  getImg(game) {

    this.gamez.map(async game => {
      return this.fetchGame(game)
    });

    console.log(JSON.stringify(this.gamez));
  }
  async fetchGame(g) {
    let game = await fetch("https://www.mlssoccer.com/" + g.href);
    let html = await game.text();
    let elem = document.createElement("div");
    elem.innerHTML = html;

    let images = elem.getElementsByTagName("img");
    g.images = [];
    for (var i = 0; i < images.length; i++) {
      if (images[i].src.startsWith('https://league-mp7static'))
        g.images.push(images[i].src);
    }
    return g;
  }

  async fetchSeason() {
    let game = await fetch("https://www.atlutd.com/schedule?month=all&year=2020&club_options=Home");
    let html = await game.text();
    let elem = document.createElement("div");
    elem.innerHTML = html;
    let outputString = '';

    let images = elem.getElementsByClassName("match_meta");
    for (var i = 0; i < images.length; i++) {
      outputString = outputString + images[i].innerHTML;
    }
    let dates = elem.getElementsByClassName("match_date");
    let dateArray = [];
    for (var i = 0; i < dates.length; i++) {
      dateArray.push(dates[i].textContent);
    }
    let matchup = elem.getElementsByClassName("match_matchup");
    let matchupArray = [];
    for (var i = 0; i < matchup.length; i++) {
      matchupArray.push(matchup[i].textContent);
    }
    console.dir(dateArray);
    console.dir(matchupArray);
    console.dir(this.teams);
    console.dir(this.seats);
    let season = [];
    matchupArray.forEach((element, index, array) => {
      let away = this.teams.filter(t => t.name.toUpperCase() == element);

      if (away.length > 0) {
        let item =
        {
          "id": '_' + Math.random().toString(36).substr(2, 9),
          "season": "Cabal20",
          "home": "teams/AUFC",
          "date": dateArray[index],
          "away": "teams/" + away[0]['id']
        };
        season.push(item);
      }
    })
    console.dir(season);
    season.forEach(g=> {
      this.db.collection('games').doc(g.id).set(g);
    })
  }

}
