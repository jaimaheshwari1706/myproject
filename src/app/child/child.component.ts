import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
box: any;

  constructor() { }

  ngOnInit(): void {
  }
// @Input() item = 0;
@Output() updateEvent= new EventEmitter<string>();

}
