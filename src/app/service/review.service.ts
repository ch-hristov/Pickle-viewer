import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Review } from '../interfaces/review';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  createReview(review: Review) {
    this.db
      .collection('reviews')
      .add(review)
      .then(() => {
        this.snackBar.open('レビュー投稿しました。', null, {
          duration: 2000
        });
        this.router.navigateByUrl('/detail');
      });
  }

  getReview(userId: string): Observable<Review> {
    return this.db
      .collection<Review>('reviews', ref => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe(
        map(reviews => {
          if (reviews.length) {
            return reviews[0];
          } else {
            return null;
          }
        })
      );
  }
}
