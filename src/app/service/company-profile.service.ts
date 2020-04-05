import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CompanyProfile } from '../interfaces/profile';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyProfileService {
  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  getCompanyUser(companyUserId: string): Observable<CompanyProfile> {
    return this.db
      .doc<CompanyProfile>(`companyProfile/${companyUserId}`)
      .valueChanges();
  }

  getCompanyUsers(companyUserId: string): Observable<CompanyProfile[]> {
    return this.db.collection<CompanyProfile>(`companyProfile`).valueChanges();
  }

  createCompanyUser(
    profile: Omit<CompanyProfile, 'companyUserId'>
  ): Promise<void> {
    const companyUserId = this.authService.uid;
    return this.db
      .doc(`companyProfile/${companyUserId}`)
      .set({ companyUserId, ...profile })
      .then(() => {
        this.snackBar.open('企業側にプロフィールを登録しました。', null, {
          duration: 3000
        });
        this.router.navigateByUrl('/companyProfile');
      });
  }

  deleteCompanyUser(companyUserId: string): Promise<void> {
    return this.db
      .doc(`companyProfile/${companyUserId}`)
      .delete()
      .then(() => {
        this.snackBar.open('プロフィールを削除しました。', null, {
          duration: 3000
        });
      });
  }
}
