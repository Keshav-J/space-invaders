import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss'],
})
export class HighscoresComponent implements OnInit {
  @Input() scores = [];

  @Output() playEvent = new EventEmitter<void>();

  isInstructions = false;

  ngOnInit() {}

  play(): void {
    this.playEvent.emit();
  }

  toggle(): void {
    this.isInstructions = !this.isInstructions;
  }
}
