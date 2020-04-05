import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment.prod';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {AngularFireFunctionsModule} from '@angular/fire/functions'
import { MatDialogModule } from '@angular/material/dialog';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgxStripeModule } from 'ngx-stripe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotFoundModule } from './not-found/not-found.module';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTooltipModule,
    // NgxStripeModule.forRoot('pk_live_X6f6ISGK8c1OM3IYRSSJ48Rq00Exg7WSGp'),
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NotFoundModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {}
