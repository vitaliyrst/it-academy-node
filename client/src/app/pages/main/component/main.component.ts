import {Component} from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    lessons: any = [
        {
            title: 'Lesson 1',
            date: new Date(23, 6, 17),
            homework : [
                {
                    id : 1,
                    description: `На бэкенде: \n\n
                            \n\nсервис /variants возвращает возможные варианты ответов (код ответа, текст ответа);
                            сервис /stat возвращает статистику ответов (код ответа, количество принятых голосов);
                            сервис /vote принимает ответ (код ответа).
                            На фронтенде:
                            получить с бэкенда статистику ответов и варианты ответов;
                            отобразить текущую статистику в любом виде;
                            отобразить варианты ответов в виде кнопок;
                            при нажатии на кнопку — отправить ответ, запросить и отобразить обновлённую статистику.`
                }
            ]
        }
    ];
}
