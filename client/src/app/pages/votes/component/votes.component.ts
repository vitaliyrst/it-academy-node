import {Component, OnInit} from '@angular/core';
import {IVote, VotesService} from "../service/votes.service";
import {take, zip} from "rxjs";

@Component({
    selector: 'app-votes',
    templateUrl: './votes.component.html',
    styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

    public votes!: IVote[];

    constructor(
        private votesService: VotesService
    ) {
    }

    ngOnInit(): void {
        zip(
            this.votesService.getVariants(),
            this.votesService.getStats()
        )
            .pipe(take(1))
            .subscribe({
                next: response => {
                    this.votes = response[0].map(item => {
                        return {
                            ...item,
                            ...response[1].find(item2 => item.id === item2.id)
                        }
                    });
                },
                error: error => {
                    console.log(error)
                }
            });
    }

    sendVote(id: number): void {
        this.votesService.sendVote(id)
            .pipe(take(1))
            .subscribe({
                next: response => {
                    this.votes = this.votes.map(item => {
                        if (item.id === response) {
                            item.count += 1;
                        }

                        return item;
                    });
                },
                error: error => {
                    console.log(error)
                }
            });
    }
}
