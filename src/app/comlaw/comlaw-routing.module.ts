import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComlawComponent } from './comlaw/comlaw.component';


const routes: Routes = [
  {
    path: '',
    component: ComlawComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComlawRoutingModule { }
