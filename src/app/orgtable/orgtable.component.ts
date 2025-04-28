import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserserviceService } from '../userservice.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-orgtable',
  templateUrl: './orgtable.component.html',
  styleUrls: ['./orgtable.component.css'],
})
export class OrgtableComponent implements OnInit, AfterViewInit {
  dataTable: any;
  selectedDate: string = '';
  filterType: string = 'month';
  dateSelected: boolean = false;
  weekStartDate: string = '';
  weekEndDate: string = '';

  constructor(
    private service: UserserviceService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSavedFilters();

    if (!this.selectedDate) {
      const today = new Date();
      this.selectedDate = today.toISOString().substring(0, 10);
      localStorage.setItem('orgTableDate', this.selectedDate);
    }

    if (!this.filterType) {
      this.filterType = 'month';
      localStorage.setItem('orgTableFilterType', 'month');
    }
  }

  ngAfterViewInit(): void {
    this.loadtable();
  }

  loadSavedFilters(): void {
    const savedDate = localStorage.getItem('orgTableDate');
    const savedFilterType = localStorage.getItem('orgTableFilterType');
    const savedWeekStart = localStorage.getItem('orgTableWeekStart');
    const savedWeekEnd = localStorage.getItem('orgTableWeekEnd');

    if (savedDate) {
      this.selectedDate = savedDate;
      this.dateSelected = true;
    }
    if (savedFilterType) {
      this.filterType = savedFilterType;
    }
    if (savedWeekStart && savedWeekEnd) {
      this.weekStartDate = savedWeekStart;
      this.weekEndDate = savedWeekEnd;
    }
  }

  loadtable(): void {
    const that = this;

    this.dataTable = $('#table2').DataTable({
      processing: true,
      serverSide: false,
      stateSave: true,
      paging: true,
      lengthMenu: [5, 10, 25, 50],
      info: false,
      dom: 'Blfrtip',
      buttons: [
        { extend: 'csvHtml5', exportOptions: { columns: ':visible' } },
        { extend: 'pdfHtml5', orientation: 'landscape', exportOptions: { columns: ':visible' } },
      ],
      ajax: {
        url: 'http://localhost/HRMSGLOBALANG/angular/index',
        type: 'POST',
        data: (d: any) => {
          if (that.filterType === 'week') {
            d.weekStartDate = that.weekStartDate;
            d.weekEndDate = that.weekEndDate;
            d.filterType = 'week';
          } else {
            d.date = that.selectedDate;
            d.filterType = that.filterType;
          }
        },
      },
      columns: [
        { data: 'id', title: 'ID' },
        { data: 'name', title: 'Name' },
        { data: 'code', title: 'Code', orderable: false },
        { data: 'organizationid', title: 'Organization ID', orderable: false },
      ],
      stateSaveCallback: (settings: any, data: any) => {
        localStorage.setItem('DataTables_table2', JSON.stringify(data));
      },
      stateLoadCallback: (settings: any) => {
        const saved = localStorage.getItem('DataTables_table2');
        return saved ? JSON.parse(saved) : null;
      }
    });
  }

  onDateChange(): void {
    this.dateSelected = true;
    this.filterType = 'day';
    localStorage.setItem('orgTableDate', this.selectedDate);

    if (this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }

  logout(): void {
    this.service.logout();
    localStorage.removeItem('orgTableDate');
    localStorage.removeItem('orgTableFilterType');
    localStorage.removeItem('orgTableWeekStart');
    localStorage.removeItem('orgTableWeekEnd');
    localStorage.removeItem('DataTables_table2');

    $('#table2').DataTable().state.clear();
    this.dataTable.destroy();
  }

  filterByDay(): void {
    this.filterType = 'day';
    localStorage.setItem('orgTableFilterType', 'day');

    if (this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }

  filterByWeek(): void {
    this.filterType = 'week';
    localStorage.setItem('orgTableFilterType', 'week');

    const date = this.selectedDate ? new Date(this.selectedDate) : new Date();
    this.selectedDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().substring(0, 10);

    this.calculateWeekDates(new Date(this.selectedDate));

    if (this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }

  filterByMonth(): void {
    this.filterType = 'month';
    localStorage.setItem('orgTableFilterType', 'month');

    if (this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }

  calculateWeekDates(baseDate?: Date): void {
    const date = baseDate
      ? new Date(baseDate)
      : new Date(this.selectedDate);

    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + diffToMonday);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    this.weekStartDate = weekStart.toISOString().substring(0, 10);
    this.weekEndDate = weekEnd.toISOString().substring(0, 10);

    localStorage.setItem('orgTableWeekStart', this.weekStartDate);
    localStorage.setItem('orgTableWeekEnd', this.weekEndDate);
  }

  previous(): void {
    if (this.filterType === 'day') {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() - 1);
      this.selectedDate = date.toISOString().substring(0, 10);
    } 
    else if (this.filterType === 'week') {
      const start = new Date(this.weekStartDate);
      start.setDate(start.getDate() - 7);
      this.selectedDate = start.toISOString().substring(0, 10);
      this.calculateWeekDates(start);
    }
     else if (this.filterType === 'month') {
      const date = new Date(this.selectedDate);
      date.setMonth(date.getMonth() - 1);
      this.selectedDate = date.toISOString().substring(0, 10);
    }

    localStorage.setItem('orgTableDate', this.selectedDate);

    if (this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }

  next(): void {
    if (this.filterType === 'day') {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);
      this.selectedDate = date.toISOString().substring(0, 10);
    } else if (this.filterType === 'week') {
      const start = new Date(this.weekStartDate);
      start.setDate(start.getDate() + 7);
      this.selectedDate = start.toISOString().substring(0, 10);
      this.calculateWeekDates(start);
    } else if (this.filterType === 'month') {
      const date = new Date(this.selectedDate);
      date.setMonth(date.getMonth() + 1);
      this.selectedDate = date.toISOString().substring(0, 10);
    }

    localStorage.setItem('orgTableDate', this.selectedDate);

    if (this.dataTable) {
      this.dataTable.ajax.reload();
    }
  }
}
