import {Component, OnInit} from '@angular/core';
import { LoadingService } from "./loading/loading.service";
import { MessageService } from "./messages/message.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
  ]
})
export class AppComponent implements  OnInit {

    constructor() {

    }

    ngOnInit() {


    }

  logout() {

  }

}
