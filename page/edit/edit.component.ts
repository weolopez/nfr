import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

export interface Team {
  id: string;
  name: string;
  image: string;
}
export interface Item { name: string; }
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;
  public collection;
  public open = '';
  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore) {
  }

  ngOnInit() {
    this.collection = this.route.snapshot.paramMap.get('collection');
    this.items = this.get();
  }
  update(data) {
    const d = JSON.parse(data);
    if (d.id) {
      this.db.collection(this.collection).doc(d.id)
        .set(d);//.finally(() => location.reload());
    } else {
      this.db.collection(this.collection)
        .add(d).finally(() => location.reload());
    }
  }
  get() {
    return this.db
      .collection<any>(this.collection)
      .valueChanges()
      .pipe(
        map(collection =>
           collection.map( doc => {
            return {
               payload: doc.payload.doc.data()
            };
          })
        )
      );
  }
  delete(id) {
    return this.db
    .collection<any>(this.collection).doc(id)
      .delete().finally(() => location.reload());
  }
}
