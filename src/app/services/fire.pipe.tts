import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'fire' })
export class FirePipe implements PipeTransform {

    constructor(
        private afs: AngularFirestore
    ) { }

    transform(collection: string, filter?: string): object {
        if (collection.indexOf('/') > 1)
            return this.afs.doc(collection).valueChanges()
            .pipe(tap(data=>{
                data;
            }));
        else
            return this.afs.collection(collection).valueChanges();
    }
}