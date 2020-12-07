import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MsTableModule} from '../components/table';
import {HomeComponent} from './home/home.component';
import {GitHubComponent} from './gitHub/gitHub.component';

@NgModule({
  declarations: [
    AppComponent, HomeComponent, GitHubComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
