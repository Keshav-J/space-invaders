import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-save-score',
  templateUrl: './save-score.component.html',
  styleUrls: ['./save-score.component.scss'],
})
export class SaveScoreComponent implements OnInit {
  name = '';

  @Input() score = 0;

  @Output() saveEvent = new EventEmitter<string>();

  ngOnInit() {}

  submit() {
    if (this.name) {
      this.saveEvent.emit(this.name);
    }
  }
}
