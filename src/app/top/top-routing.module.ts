import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopComponent } from './top/top.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TopComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopRoutingModule { }
