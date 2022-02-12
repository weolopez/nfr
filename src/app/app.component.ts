import { Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public user: any
  public appPages = [
    { title: 'Cabal22', url: '/season/Cabal22', icon: 'football' },
    // { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    // { title: 'Seasons', url: '/folder/Seasons', icon: 'list' },
  ];
  public labels = []// ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  public loggedIn = false;
  public showProviders = false;
  showUser=false;

    private readonly userDisposable: Subscription|undefined;
    public readonly userO: Observable<User | null> = EMPTY;
    // user:any
    showLoginButton = false;
    showLogoutButton = false;
  
    constructor(@Optional() public auth: Auth
    , private router: Router
    , authService: AuthService) {
      if (auth) {
        this.userO = authState(this.auth);
        this.userDisposable = authState(this.auth).subscribe(u => {
          // this.user = u;
          this.loggedIn = !!u;
        });
      }
    }
  
    ngOnInit(): void { }
  
    ngOnDestroy(): void {
      if (this.userDisposable) {
        this.userDisposable.unsubscribe();
      }
    }
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      await this.router.navigate(['/']);
    } 
    async logout() {
      return await signOut(this.auth);
    }
}
