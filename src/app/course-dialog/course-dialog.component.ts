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
import { CoursesStore } from 'app/services/courses.store';

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
        private courseStore:CoursesStore,
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
        const changes = this.form.value;
        this.courseStore.saveCourse(this.course.id,changes)
        //error handling here wont have effect as the dialog gets closed, insted do it in store
                            .subscribe();
        this.dialogRef.close(changes);
    }

    close() {
        this.dialogRef.close();
    }

}
