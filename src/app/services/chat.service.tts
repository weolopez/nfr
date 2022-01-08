import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatId;
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {}

  get(chatId) {
    this.chatId = chatId;
    return this.joinUsers(this.afs
        .collection<any>('chats')
        .doc(chatId)
        .snapshotChanges()
        .pipe(
          map(doc => {
           return { id: doc.payload.id, ...doc.payload.data() as {} }
          })
        ));
  }

  getUserChats() {
    return this.auth.user$.pipe(
      switchMap(user => {
        return this.afs
          .collection('chats', ref => ref.where('uid', '==', user.uid))
          .snapshotChanges()
          .pipe(
            map(actions => {
              return actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data as {} };
              });
            })
          );
      })
    );
  }

  create(id) {
    const data = {
      id: id,
      uid: 'system',
      createdAt: Date.now(),
      count: 0,
      messages: []
    };
    return this.afs.collection('chats').doc(id).set(data);
  }

  async sendMessage(content, chatId?) {
    chatId = (chatId) ?  chatId : this.chatId;

    const { uid } = await this.auth.getUser().toPromise();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  async deleteMessage(chat, msg) {
    const { uid } = await this.auth.getUser().toPromise();

    const ref = this.afs.collection('chats').doc(chat.id);
    console.log(msg);
    if (chat.uid === uid || msg.uid === uid) {
      // Allowed to delete
      delete msg.user;
      return ref.update({
        messages: firestore.FieldValue.arrayRemove(msg)
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        if (!c.uid) return of([]);
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges().pipe(
            tap(d=> {
              return d;
            })
          )
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        if (!chat) return of([]); 
        arr.forEach(v => {
          if (!v) return;
          return (joinKeys[(v as any).uid] = v)
        });
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });
        // scrollList.scrollTo({bottom: 0});
        return chat;
      })
    );
  }
}
