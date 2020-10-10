import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError, finalize} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CoursesService } from 'app/services/courses.service';
import { LoadingService } from 'app/loading/loading.service';
import { MessageService } from 'app/messages/message.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService, //this will be available to this component and its child
        MessageService
    ]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private courseService:CoursesService,
        private loadingService: LoadingService,
        private messageService: MessageService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {
        this.loadingService.loadingOn();
        const changes = this.form.value;
        const saveCourse$ = this.courseService.saveCourse(this.course.id,changes)
                            .pipe(
                                catchError(err => {
                                    const msg = "Could not save the course";
                                    console.log(msg,err);
                                    this.messageService.showErrors(msg);
                                    return throwError(err);
                                })
                            );
        this.loadingService.showLoaderUntilComplete(saveCourse$)
            .subscribe((val)=> {
                this.dialogRef.close(val);
            });
    }

    close() {
        this.dialogRef.close();
    }

}
