  import { Component, OnInit } from '@angular/core';
  import { UserserviceService } from '../userservice.service';
  import { Router } from '@angular/router';
  import { Subject } from 'rxjs';
  import { OnDestroy } from '@angular/core';

  declare var $: any;

  @Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
  })
  export class TableComponent implements OnInit {

    // dtOptions: DataTables.Settings = {};
    // dtTrigger: Subject<any> = new Subject();

    constructor(private service: UserserviceService
      , private route: Router
    ) { }

    ngOnInit(): void {
      // this.dtOptions = {
      //   pagingType: 'full_numbers',
      //   pageLength: 5,
      //   processing: true
      // };

    }
    ngAfterViewInit(): void {
      // Initialize DataTable after view initialization
      this.initializeDataTable();
    }

    // Initialize DataTable with the server-side configuration
    initializeDataTable() {
      // Expose global functions for button clicks
      (window as any).editUser = (id: number) => {
        this.route.navigate(['/update'], { queryParams: { id } });
      };

      (window as any).deleteUser = (id: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
          this.service.delete(id).subscribe(res => {
            console.log('Deleted:', res);
            $('#table').DataTable().ajax.reload(); // Reload table after deletion
          });
        }
      };

      // Initialize the DataTable
      $('#table').DataTable({
        processing: true,
        serverSide: true,
        pageLength: 5,
        lengthMenu: [ 5, 10, 25, 50 ],
        info: false,
        ajax: {
          url: 'http://localhost/HRMSGLOBALANG/angular/datatable',
          type: 'GET'
        },
        columns: [
          { data: 'id', title: 'ID' },
          { data: 'name', title: 'Name' },
          { data: 'email', title: 'Email' },
          { data: 'phone', title: 'Phone' },
          { data: 'address', title: 'Address' },
          {
            data: null,
            title: 'Action',
            orderable: false,
            searchable: false,
            render: function (data: any, type: any, row: any) {
              return `
                <button class="btn btn-sm btn-primary" onclick="editUser(${row.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${row.id})">Delete</button>
              `;
            }
          }
        ]
      });
    }


    tables: any = [];

    logout() {
      this.service.logout();
    }


    getdata() {
      this.service.gettable().subscribe(res => {
        this.tables = res;
        console.log('Fetched Data:', this.tables);
      //   setTimeout(() => {
      //     this.dtTrigger.next(null); // Wait for DOM to update
      //   }, 100); // slight delay to ensure table is rendered
      });
    }


    deleteBtn(id: any) {
      this.service.delete(id).subscribe(res => {
        console.log('Deleted Data:', res);
        this.getdata();
      });
    }

    // ngOnDestroy(): void {
    //   this.dtTrigger.unsubscribe(); // 👈 clean up
    // }
  }
