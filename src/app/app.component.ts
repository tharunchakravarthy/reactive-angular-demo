import {Component, OnInit} from '@angular/core';
import { LoadingService } from "./loading/loading.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LoadingService //this will be available to appcomponent and its child
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
