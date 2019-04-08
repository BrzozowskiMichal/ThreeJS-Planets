import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EngineComponent } from './engine/engine.component';
import { EngineService } from './engine/engine.service';

@NgModule({
  declarations: [
    AppComponent,
    EngineComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    EngineService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
