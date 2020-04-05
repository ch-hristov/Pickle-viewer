import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComlawRoutingModule } from './comlaw-routing.module';
import { ComlawComponent } from './comlaw/comlaw.component';


@NgModule({
  declarations: [ComlawComponent],
  imports: [
    CommonModule,
    ComlawRoutingModule
  ]
})
export class ComlawModule { }
