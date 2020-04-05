import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeeService } from '../services/fee.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$ = this.authService.afUser$;
  public title = 'Pickle viewer'
  public isAnnon: boolean = true;
  public isShow : boolean = false;
  public isSub: boolean = false;
  public customer$ : Observable<any>;

  constructor(private authService: AuthService,
                      activated : Router,
                      private snack : MatSnackBar,
                      private fee : FeeService) {

       activated.events.subscribe((val) =>{
        if(val instanceof NavigationEnd) {
          if(val.url.endsWith("show")){
            this.isShow=true;
          }
          else{
            this.isShow=false;
          }
        }
       });

  
     }

  ngOnInit() { 
    this.user$.subscribe((u) =>{
      if(u != null){
        this.isAnnon = u.isAnonymous;
        this.customer$ =  this.fee.getCustomer();
        this.customer$.subscribe((a) =>{
          this.isSub = a.subscriptionId !== null
        });
      }
    })
  }

  login(){
    this.authService.login()  
  }

  logout() {
    if(!this.isAnnon){
      this.authService.logout();
    }
  }
}
