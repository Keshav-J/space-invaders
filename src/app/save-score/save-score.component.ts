import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: 'app-save-score',
  templateUrl: './save-score.component.html',
  styleUrls: ['./save-score.component.css']
})
export class SaveScoreComponent implements OnInit {
  name:string = '';

  @Input() score:number = 0;

  @Output() onSave = new EventEmitter;

  ngOnInit() {

  }

  submit() {
    if(this.name)
      this.onSave.emit(this.name);
  }
}
