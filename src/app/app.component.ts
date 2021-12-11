import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { YoutubeService } from 'src/app/services/youtube.service';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  videos: any[] = [];
  videosSlice: any[] = [];
  dateFrom: string = '';
  dateTo: string = '';
  query: string = '';
  orderOpts: string[] = [
    'date',
    'rating',
    'relevance',
    'title',
    'videoCount',
    'viewCount',
  ];
  order: string = '';

  // Pagination
  pageIndex: number = 1;
  pageSize: number = 5;
  pageNumbers: number = 0;
  pageIndexs: number[] = [];

  // Debounce
  private searchSubject: Subject<any> = new Subject<any>();

  constructor(private youtube: YoutubeService, public dialog: MatDialog) {}

  ngOnInit() {
    // Debounce
    this.searchSubject.subscribe((q: string) => {
      this.query = q;
      this.search(q);
    });
    console.log('value bellow!');

    this.search('angular');
  }

  onSearchType(e: any) {
    const value = e.target.value.trim();
    if (value) this.searchSubject.next(value);
  }

  search(query: string) {
    this.youtube
      .search(query, this.order, this.dateFrom, this.dateTo)
      .pipe(delay(500))
      .subscribe((result: any) => {
        this.videos = result.items;
        this.pagination();
      });
  }
  orderChage(option: string) {
    this.order = option;
    if (this.query) {
      this.search(this.query);
    } else {
      this.search('angular');
    }
  }

  // Pagination
  pagination() {
    this.createPageIndexs();
    this.handlePageChange(1);
  }

  handlePageChange(pageClick: number) {
    this.pageIndex = pageClick;

    let startIndex = (this.pageIndex - 1) * this.pageSize;
    let endIndex = startIndex + this.pageSize;
    if (endIndex > this.videos.length) {
      endIndex = this.videos.length;
    }
    this.videosSlice = this.videos.slice(startIndex, endIndex);
  }

  createPageIndexs() {
    if (this.videos.length % this.pageSize === 0) {
      this.pageNumbers = this.videos.length / this.pageSize;
    } else {
      this.pageNumbers = this.videos.length / this.pageSize + 1;
    }

    this.pageIndexs = [];
    for (let i = 1; i <= this.pageNumbers; i++) {
      this.pageIndexs.push(i);
    }
  }
}
