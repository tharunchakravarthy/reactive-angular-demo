import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import { MessageService } from './message.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessages = false;

  errors$: Observable<string[]>;

  constructor(public messageService: MessageService) {
    console.log("created messages component");
  }

  ngOnInit() {
    this.errors$ = this.messageService.error$
                    .pipe(
                      tap(()=>this.showMessages= true)
                    );
  }

  onClose() {
    this.showMessages = false;
  }
}
