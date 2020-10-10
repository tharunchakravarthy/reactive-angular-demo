import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { Course, sortCoursesBySeqNo } from "../model/course";
import { LoadingService } from "app/loading/loading.service";
import { MessageService } from "app/messages/message.service";

@Injectable({
  providedIn: 'root'
})
export class CoursesStore{

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(private http: HttpClient,
              private loadingService: LoadingService,
              private messageService: MessageService
              ) {
            this.loadAllCourses();
  }

  filterByCategory(category: string) : Observable<Course[]>{
    return this.courses$
            .pipe(
              map(courses => 
                  courses.filter(course => course.category == category)
                          .sort(sortCoursesBySeqNo)
                  )
            )
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
    .pipe(
      map(res => res["payload"]),
      catchError(err => {
        const msg = "Could not load the course";
          this.messageService.showErrors(msg);
          console.log(msg,err);
          return throwError(err);
      }),
      tap(courses => {this.subject.next(courses);console.log("will be tapped only once")})
    );
    this.loadingService.showLoaderUntilComplete(loadCourses$)
      .subscribe();
  }

}