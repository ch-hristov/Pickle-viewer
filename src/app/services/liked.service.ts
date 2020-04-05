import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DetailJob, Favorite } from '../interfaces/article';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LikedService {
  constructor(private db: AngularFirestore) {}

  // いいね追加
  likedItem(id: string, userId: string): Promise<void> {
    return this.db.doc(`LikedUsers/${userId}/LikedItems/${id}`).set({ id });
  }

  // いいねした人のユーザーID
  likedUser(id: string, userId: string): Promise<void> {
    return this.db.doc(`likes/${id}/likedUsers/${userId}`).set({ userId });
  }

  // いいね一覧取得
  getLikedJobs(userId: string) {
    return this.db
      .collection<Favorite>(`LikedUsers/${userId}/LikedItems`)
      .valueChanges()
      .pipe(
        switchMap(docs => {
          return combineLatest(
            docs.map(doc =>
              this.db.doc<DetailJob>(`JobPosts/${doc.id}`).valueChanges()
            )
          );
        })
      );
  }

  // いいねを削除
  deleteLikedJobs(userId: string, id: string): Promise<void> {
    return this.db.doc(`LikedUsers/${userId}/LikedItems/${id}`).delete();
  }

  // いいねそたユーザー削除
  deleteLikesUser(id: string, userId: string): Promise<void> {
    return this.db.doc(`likes/${id}/likedUsers/${userId}`).delete();
  }

  // いいねしているかのチェック
  isLiked(id: string, userId: string): Observable<boolean> {
    return this.db
      .doc(`likes/${id}/likedUsers/${userId}`)
      .valueChanges()
      .pipe(map(doc => !!doc));
  }
}
