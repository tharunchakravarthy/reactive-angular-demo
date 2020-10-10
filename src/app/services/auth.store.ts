import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { User } from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private subject = new BehaviorSubject<User>(null);

  user$: Observable<User> = this.subject.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http:HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map(user=> !!user));//double negation - true if user exists
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(isloggedin => !isloggedin));//negate the logged in observable
  }

  login(email: string, password: string): Observable<User>{
    return this.http.post<User>("/api/login",{email,password})
              .pipe(
                tap(user => this.subject.next(user)),
                shareReplay()
              );
  }

  logout() {
    this.subject.next(null);
  }

}