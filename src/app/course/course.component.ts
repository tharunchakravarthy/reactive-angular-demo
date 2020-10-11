import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from "../services/courses.service";

interface courseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  data$: Observable<courseData>;

  constructor(private route: ActivatedRoute,
              private courseService: CoursesService) {


  }

  ngOnInit() {
    const courseid = parseInt(this.route.snapshot.paramMap.get("courseId"));
    const course$ = this.courseService.loadCourseById(courseid)
                    .pipe(
                      startWith(null)
                    );
    const lessons$ = this.courseService.loadAllCourseLessons(courseid)
                    .pipe(
                      startWith([])
                    );

    this.data$ = combineLatest([course$,lessons$])//emits if either of them are available
        .pipe(
          map(([course,lessons])=> {
            return {
              course,
              lessons
            }
          }
        ),
        tap(console.log))

  }


}











