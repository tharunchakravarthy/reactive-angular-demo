import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessageService } from "app/messages/message.service";
@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$ = this.coursesService
      .loadAllCourses()
      .pipe(
        map((courses) => courses.sort(sortCoursesBySeqNo)),
        catchError(err => {
          const msg = "Could not load the course";
          this.messageService.showErrors(msg);
          console.log(msg,err);
          return throwError(err);//return a new observable with err and terminate the observable chain
        })
      );

    const loadCourses$ = this.loadingService.showLoaderUntilComplete(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "BEGINNER")
      )
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "ADVANCED")
      )
    );
  }

  
}
