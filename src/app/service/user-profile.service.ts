import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfile } from '../interfaces/profile';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) {}

  createUser(
    profile: Omit<UserProfile, 'userId'>,
    avatarImage?: File
  ): Promise<void> {
    const userId = this.authService.uid;
    return this.db
      .doc(`userProfile/${userId}`)
      .set({ userId, ...profile })
      .then(() => {
        this.snackBar.open('userCreate', null, {
          duration: 3000
        });
        if (avatarImage) {
          this.updateAvatar(userId, avatarImage);
        }
        this.router.navigateByUrl('/mypage');
      });
  }

  getProfile(userId: string): Observable<UserProfile> {
    return this.db.doc<UserProfile>(`userProfile/${userId}`).valueChanges();
  }

  getProfiles(userId: string): Observable<UserProfile[]> {
    return this.db.collection<UserProfile>(`userProfile`).valueChanges();
  }

  private async updateAvatar(userId: string, file: File) {
    const result = await this.storage.ref(`userProfile/${userId}`).put(file);
    const photoURL = await result.ref.getDownloadURL();
    this.db.doc(`userProfile/${userId}`).update({
      photoURL
    });
  }

  deleteProfile(userId: string): Promise<void> {
    return this.db
      .doc(`userProfile/${userId}`)
      .delete()
      .then(() => {
        this.snackBar.open('userDelete', null, {
          duration: 3000
        });
      });
  }
}
