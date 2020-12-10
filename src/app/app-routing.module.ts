import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GitHubComponent} from './gitHub/gitHub.component';
import {HomeComponent} from './home/home.component';
import {PaginatorComponent} from './paginator/paginator.component';


const routes: Routes = [
  {path: 'github', component: GitHubComponent },
  {path: 'paginator', component: PaginatorComponent},
  {path:  '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
