import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  doc;
  collection;
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) { }

  deepGetCollection(collection, filter?) {
    return this.afs.collection(collection).valueChanges().pipe(map(d => {
      d = traverse(d, (value) => {
        return this.resolve(value);
      });
      return d;
    }));
  }

  deepGetDoc(collection, doc) {
    if (!doc) {
      return this.deepGetCollection(collection);
    }
    return this.afs.collection(collection).doc(doc).valueChanges().pipe(map(d => {
      d = traverse(d, (value) => {
        return this.resolve(value);
      });
      return d;
    }));
  }

  get(collection?, doc?) {
    this.doc = (doc) ? doc : this.doc;
    this.collection = (collection) ? collection : this.collection;
    return this.afs
      .collection<any>(this.collection)
      .stateChanges()
      .pipe(
        map(c =>
          c.map(d => {
            return {
              doc: d.payload.doc.id,
              payload: d.payload.doc.data().content
            };
          })
        )
      );
  }

  update(uid, data) {
    this.afs.collection(this.collection).doc(uid)
      .update(this.updateData(data));
    // .finally( () => this.items = this.get() );
  }
  add(data) {
    this.afs.collection(this.collection)
      .add(this.updateData(data));
  }
  updateData(value) {
    return {
      content: JSON.parse(value),
      createdAt: Date.now()
    };
  }
  resolve(str) {
    if ((typeof str !== 'string') || ( str.charAt( 0 ) !== '_' )) { return str; }
    const collection = str.substring(1, str.indexOf('$'));
    const document = str.substring(str.indexOf('$') + 1);
    return this.deepGetDoc(collection, document).pipe(map(o => {
      return o;
    }));
  }
}

function traverse(obj, func) {
  if (Array.isArray(obj)) {
    return obj.map( o => traverse(o, func));
  } else if ((typeof obj === 'object') && (obj !== null)) {
    Object.keys(obj).forEach(key => obj[key] = traverse(obj[key], func));
    return obj;
  } else {
    return func(obj);
  }
}
