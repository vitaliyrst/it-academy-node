import {Component} from '@angular/core';

interface Lesson {
    title: string,
    date: Date,
    homework: Array<{
        id: number,
        link: string
    }>
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    lessons: Lesson[] = [
        {
            title: 'Lesson 1',
            date: new Date(23, 6, 17),
            homework: [
                {
                    id: 1,
                    link: 'https://github.com/vitaliyrst/it-academy-node#less1-1'
                },
                {
                    id: 2,
                    link: 'https://github.com/vitaliyrst/it-academy-node#less1-2'
                }
            ]
        }
    ];
}
