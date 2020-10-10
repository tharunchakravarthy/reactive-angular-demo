import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
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

  saveCourse(courseid: string, changes: Partial<Course>): Observable<any>{
    const courses = this.subject.getValue();//gets the last value 
    const index = courses.findIndex(course=> course.id == courseid);

    const newCourse = {
      ...courses[index],
      ...changes
    };

    const newCourses: Course[] = courses.slice(0);
    newCourses[index]=newCourse;

    this.subject.next(newCourses);
    return this.http.put(`/api/courses/${courseid}`,changes)
            .pipe(
              catchError(err=> {
                const msg = "could not save the course";
                console.log(msg,err);
                this.messageService.showErrors(msg);
                return throwError(err);
              }),
              shareReplay()
            );
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

}