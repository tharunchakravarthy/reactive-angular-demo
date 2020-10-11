import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {merge, fromEvent, Observable, concat, throwError} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from "../services/courses.service";

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute,
              private courseService: CoursesService) {


  }

  ngOnInit() {
    const courseid = parseInt(this.route.snapshot.paramMap.get("courseId"));
    this.course$ = this.courseService.loadCourseById(courseid);
    this.lessons$ = this.courseService.loadAllCourseLessons(courseid);
  }


}











