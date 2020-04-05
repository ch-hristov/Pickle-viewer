import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  afUser$: Observable<User> = this.afAuth.user;

  uid: string;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.afUser$.subscribe(user => {
      this.uid = user && user.uid;
    });
  }

  signAnnon() {
     this.afAuth.auth.signInAnonymously().then(() =>{});
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
                    .catch((reason) =>{
                      this.snackBar.open(reason, null , {
                        duration: 3000
                      })
                    })
                    .then(() => {
      this.snackBar.open('You are now logged in!', null, {
        duration: 2000
      });
    });
    this.router.navigateByUrl('/');
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.snackBar.open('You are now logged out', null, {
        duration: 2000
      });
    });
    this.router.navigateByUrl('/');
  }

  companyLogin() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(() => {
      this.snackBar.open('Login as company', null, {
        duration: 2000
      });
    });
  }
}
