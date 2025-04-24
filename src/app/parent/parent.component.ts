import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  data: string = " ";
  // updateBtn(){
  //   this.data = Math.floor(Math.random() * 100);
  //   console.log('Updated Data:', this.data);
  // }
  update(item: any) {
    this.data = item;
  }
}
