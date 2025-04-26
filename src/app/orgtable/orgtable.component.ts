import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserserviceService } from '../userservice.service';
import { HttpClient } from '@angular/common/http';
declare var $: any; // Keep jQuery declaration if needed

@Component({
  selector: 'app-orgtable',
  templateUrl: './orgtable.component.html',
  styleUrls: ['./orgtable.component.css']
})
export class OrgtableComponent implements OnInit, AfterViewInit {
  startDate: string = '';
  endDate: string = '';
  selectedMonth: string = '';
  selectedYear: string = '';
  dataTable: any;
  selectedDate: string = new Date().toISOString().substring(0, 10); // default to today

  constructor(private service: UserserviceService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Load saved date from localStorage
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
      lengthMenu: [5, 10, 25, 50],
      info: false,
      dom: 'Blfrtip.',
      buttons: [
        {
          extend: 'csvHtml5',
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
        data: (d: any) => {
          d.date = that.selectedDate;
        }
      },
      columns: [
        { data: 'id', title: 'ID' },
        { data: 'name', title: 'Name' },
        { data: 'code', title: 'Code', orderable: false },
        { data: 'organizationid', title: 'Organization ID', orderable: false },
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

  // Angular Method to call PHP backend for Day filtering
  filterByDay(date: string) {
    this.http.post('http://localhost/HRMSGLOBALANG/angular/getalldata', { date: date }).subscribe(response => {
      console.log(response);
      // Update your table data with the response
    });
  }

  // Angular Method to call PHP backend for Week filtering
  filterByWeek() {
    const today = new Date(this.selectedDate);
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
    const end = new Date(today);
    end.setDate(today.getDate() + (6 - today.getDay())); // End of the week (Saturday)

    const startDate = start.toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'
    const endDate = end.toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'

    this.http.post('http://localhost/HRMSGLOBALANG/angular/filterByWeek', { startDate, endDate }).subscribe(response => {
      console.log(response);
      this.dataTable.ajax.reload(); // Reload the DataTable with filtered data
    });
  }

  // Angular Method to call PHP backend for Month filtering
  filterByMonth() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();
  
    const body = new URLSearchParams();
    body.set('month', month);
    body.set('year', year);
  
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  
    this.http.post<any>('http://localhost/HRMSGLOBALANG/angular/filterByMonth', body.toString(), { headers }).subscribe(response => {
      console.log(response);
  
      if (response.data && response.data.length > 0 && this.dataTable) {
        this.dataTable.clear(); // clear old data
        this.dataTable.rows.add(response.data); // add new rows
        this.dataTable.draw(); // redraw table
      } else {
        // If no data
        this.dataTable.clear();
        this.dataTable.draw();
  
        // Insert a fake row manually to show "No Data Available"
        $('#table2 tbody').html(
          '<tr><td colspan="5" class="text-center">No Data Available for this month</td></tr>'
        );
      }
    }, error => {
      console.error('Error fetching data for current month', error);
    });
  }
  
}
