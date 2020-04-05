import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopRoutingModule } from './top-routing.module';
import { TopComponent } from './top/top.component';

import { MatButtonModule } from '@angular/material/button';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    TopComponent
  ],
  imports: [
    CommonModule,
    TopRoutingModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    NgxJsonViewerModule,
    MatIconModule
  ]
})
export class TopModule {}
