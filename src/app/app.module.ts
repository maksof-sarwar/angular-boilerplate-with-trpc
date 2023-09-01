import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { API_PROVIDER } from './module/api';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule],
  providers: [...API_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule {}
