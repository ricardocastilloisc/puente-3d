import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PuenteComponent } from './puente/puente.component';
import { HttpClientModule } from '@angular/common/http';
import { CasaComponent } from './casa/casa.component';
@NgModule({
  declarations: [
    AppComponent,
    PuenteComponent,
    CasaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
