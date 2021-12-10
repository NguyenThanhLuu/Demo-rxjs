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
    'date', // ngày phát hành gần nhất
    'rating', // xếp hạng
    'relevance', // liên quan
    'title', // title a -> z
    'videoCount',
    'viewCount', // số lượt view
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
    this.searchSubject // tìm data tương ứng với từ khóa user nhập vào
      .subscribe((q) => {
        this.query = q;
        this.search(q);
      });
    console.log('value bellow!');

    this.search('angular');
  }

  // sau khi nhập từ khóa tìm kiếm vào
  onSearchType(e: any) {
    const value = e.target.value.trim(); // cắt space
    if (value) this.searchSubject.next(value); // nếu có nhập value vào ô tìm kiếm thực hiện serchsubject
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
  // thay đổi option
  orderChage(option: string) {
    this.order = option;
    if (this.query) {
      this.search(this.query); // nếu có value input rồi thì chỉ cần thêm order phía sau để lọc theo cái đó
    } else {
      this.search('angular'); // nếu không có thì lọc theo 'angular'
    }
  }

  // Pagination
  pagination() {
    this.createPageIndexs(); //
    this.handlePageChange(1); // trang đang nằm là trang số 1 khi mới load web lần đầu tiên
  }

  handlePageChange(pageClick: number) {
    this.pageIndex = pageClick;

    let startIndex = (this.pageIndex - 1) * this.pageSize;
    let endIndex = startIndex + this.pageSize;
    if (endIndex > this.videos.length) {
      endIndex = this.videos.length;
    }
    this.videosSlice = this.videos.slice(startIndex, endIndex); // nếu nhấn chuyển đến số 2 thì sẽ có 20 video sau đó
    // nó cắt từ video 11 đến video 20 để thể hiện trong page 2
  }

  createPageIndexs() {
    //
    if (this.videos.length % this.pageSize === 0) {
      this.pageNumbers = this.videos.length / this.pageSize; // pageNumber chính là số trang bên dưới thành pagina
    } else {
      // nếu video.length là số lẻ ví dụ 99 mà mỗi trang chỉ được hiển thị 10 video thì số lượng
      // trang index là pageNumber = 99/11
      this.pageNumbers = this.videos.length / this.pageSize + 1;
    }

    this.pageIndexs = []; // dùng để thể hiện chỉ số chạy từ bao nhiêu đến bao nhiêu
    // nếu tính ra pageNumbers là 10 thì nó sẽ hiển thị 1 2 3..10
    for (let i = 1; i <= this.pageNumbers; i++) {
      this.pageIndexs.push(i);
    }
  }
}
