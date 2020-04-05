export interface JobList {
  id: string;
  jobId: string;
  companyName: string;
  title: string;
  jobImageUrls: string[];
  workPlace: string;
  occupation: string;
  salary: string;
  workTime: string;
  likedCount: number;
}

export interface DetailJob extends JobList {
  label: string[];
  date: Date;
  companyContent: string;
  welfare: string;
  createAt: Date;
}


export class SampleShow implements Slide {
  updatedAt: Date;
  createdAt : Date;
  name: string;  duration: number;
  url: string;
  id: string;

}


export interface SlideShow {
  slideIds : string[]
}

export interface Slide{
   name : string;
   duration : number;
   url : string;
   id : string;
   updatedAt : Date;
   createdAt : Date;
}

export interface Favorite {
  userId: string;
  id: string;
  likedCount: number;
}

export interface JobWidhFavorite extends DetailJob {
  likeAuthor: Favorite;
}
