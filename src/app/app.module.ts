import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MsTableModule} from '../components/table';
import {HomeComponent} from './home/home.component';
import {GitHubComponent} from './gitHub/gitHub.component';
import {PaginatorComponent} from './paginator/paginator.component';
import {MsPaginatorModule} from '../components/paginator';

@NgModule({
  declarations: [
    AppComponent, HomeComponent, GitHubComponent, PaginatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsTableModule,
    MsPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
