import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserserviceService } from '../userservice.service';
declare var $: any; // Keep jQuery declaration if needed

@Component({
  selector: 'app-orgtable',
  templateUrl: './orgtable.component.html',
  styleUrls: ['./orgtable.component.css']
})
export class OrgtableComponent implements OnInit, AfterViewInit {

  selectedDate: string = '';
  dataTable: any;

  constructor(private service: UserserviceService) { }

  ngOnInit(): void {
    const savedDate = localStorage.getItem('orgTableDate');
    if (savedDate) {
      this.selectedDate = savedDate;
    }
  }

  ngAfterViewInit(): void {
    this.loadtable();
  }

  loadtable(): void {
    const that = this;

    this.dataTable = $('#table2').DataTable({
      processing: true,
      serverSide: true,
      stateSave: true,
      // pageLength: 5,
      lengthMenu: [5, 10, 25, 50],
      info: false,
      dom: 'Blfrtip.',
      buttons: [
        {
          extend: 'csvHtml5',
          // text: 'Export All',
          exportOptions: {
            modifier: {
              page: 'all'
            },
            columns: ':visible'
          }
        },
        {
          extend: 'pdfHtml5',
          orientation: 'landscape',
          // pageSize: 'A4',
          exportOptions: {
            modifier: {
              page: 'all'
            },
            columns: ':visible'
          }
        }
      ],
      ajax: {
        url: 'http://localhost/HRMSGLOBALANG/angular/datatable2',
        type: 'POST',
        // Add the data option to send the organization_id
        data: (d: any) => {

          d.date = that.selectedDate;
          // d contains the default DataTables parameters (start, length, search, order, etc.)
          // Add your custom parameter here:
          // d.organization_id = 3;
          // You can add other parameters like this:
          // d.another_param = some_value;
        }
      },
      columns: [
        { data: 'Id', title: 'ID' },
        { data: 'Name', title: 'Name' },
        { data: 'Code', title: 'Code', orderable: false },
        { data: 'OrganizationId', title: 'Organization ID', orderable: false },
        { data: 'gender', title: 'Gender', orderable: false },
      ]
    });
  }
  onDateChange(): void {
    localStorage.setItem('orgTableDate', this.selectedDate);
    if (this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }
  logout() {
    this.service.logout();
      localStorage.removeItem('orgTableDate');
      $('#table2').DataTable().state.clear();
      location.reload();

  }
}
