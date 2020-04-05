import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DetailJob, Favorite, JobWidhFavorite, Slide, SlideShow } from '../interfaces/article';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  

  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
    private storage: AngularFireStorage,
    private auth : AuthService
  ) {}
  
  getAllJob(urn : null): Observable<Slide[] > {

    return this.db.collection<Slide>('JobPosts', ref => {
                        return ref.where("userId",'==',urn ==null? this.auth.uid : urn)
                                .orderBy("createdAt", "desc")
                                .limit(30)
                      })
                  .valueChanges();
  }


  async generateUrl(uid : string) {
    throw new Error("Method not implemented.");
  }

  
  async createJobPost(userId: string, article: Slide, images?: File[]) {
    
    const id = this.db.createId();

    await this.db
                  .collection<Slide>('JobPosts')
                  .doc(`${id}`)
                  .set({ id, userId, ...article, createdAt: new Date() });
      
    this.snackBar.open('Successfully created slide', null, {
      duration: 2000
    });
    if (images) {
      this.uploadImages(images, id);
    }

    return id;
  }

  
  async deleteJob(id: string): Promise<void> {
    await this.db
      .collection<Slide>('JobPosts')
      .doc(`${id}`)
      .delete();
    this.snackBar.open('Deleted a slide', null, {
      duration: 3000
    });
  }

  updateJob(article: Slide, id: string, images?: File[]): Promise<void> {
    return this.db
      .collection<Slide>('JobPosts')
      .doc(`${id}`)
      .update({ id, ...article, updatedAt: new Date() })
      .then(() => {
        this.snackBar.open('Successfully updated slide', null, {
          duration: 2000
        });
        if (images) {
          this.uploadImages(images, id);
        }
      });
  }

  uploadImages(files: File[], id: string): Promise<void> {
    return Promise.all(
      files.map((file, index) => {
        const ref = this.storage.ref(`JobPosts/${id}-${index}`);
        return ref.put(file);
      })
    ).then(async tasks => {
      const jobImageUrls = [];
      for (const task of tasks) {
        jobImageUrls.push(await task.ref.getDownloadURL());
      }
      return this.db.doc(`JobPosts/${id}`).update({
        jobImageUrls
      });
    });
  }


  getJobPost(id: string): Observable<DetailJob> {
    return this.db.doc<DetailJob>(`JobPosts/${id}`).valueChanges();
  }
  getNewJobs(): Observable<DetailJob[]> {
    return this.db
      .collection<DetailJob>('JobPosts', ref => {
        return ref.orderBy('createdAt').limit(10);
      })
      .valueChanges();
  }

  getAttentionJobs(): Observable<DetailJob[]> {
    return this.db
      .collection<DetailJob>('JobPosts', ref => {
        return ref.orderBy('createdAt').limit(12);
      })
      .valueChanges();
  }



  getMyCompanyJobList(companyUserId: string): Observable<DetailJob[]> {
    return this.db
      .collection<DetailJob>(`JobPosts`, ref => {
        return ref.where('jobId', '==', companyUserId);
      })
      .valueChanges();
  }
}
