import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css']
})
export class HighscoresComponent implements OnInit {
  @Input() scores = [];

  @Output() onPlay = new EventEmitter();

  ngOnInit() {

  }

  play() {
    this.onPlay.emit();
  }
}
