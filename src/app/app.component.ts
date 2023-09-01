import { Component } from '@angular/core';
import { AppRouter } from 'server';
import { fromProcedure } from './module/api/utils';
import { injectClient, provideClient } from './module/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-boilerplate';
  private readonly client = injectClient();

  run() {
    // this.client.health.query({ i: '1' }).then(r=>{
    //   console.log(r.sta);
    // });
    fromProcedure(this.client.health.query)({ i: '1' }).subscribe((r) => {
      console.log(r.status);
    });
  }
}
