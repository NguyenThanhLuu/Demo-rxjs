import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private SEARCH_URL: string =
    'https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video';
  private API_KEY: string = 'AIzaSyCU6CTFhlbgnmDnSx7uWwVNPgbdLc0yJMQ';
  private maxResult: number = 50;

  constructor(private http: HttpClient) {
    if (!window.localStorage.getItem('API_KEY')) {
      window.localStorage.setItem('API_KEY', this.API_KEY);
    }
  }

  search(q: string, order: string, dateFrom: string, dateTo: string) {
    const API_KEY = window.localStorage.getItem('API_KEY');
    let url = `${this.SEARCH_URL}&key=${API_KEY}&q=${q}&maxResults=${this.maxResult}`;

    if (order) url += `&order=${order}`;
    if (dateFrom) url += `&publishedAfter=${dateFrom}`;
    if (dateTo) url += `&publishedBefore=${dateTo}`;

    return this.http.get(url);
  }

  saveSetting(apiKey: string, debounce: string) {
    window.localStorage.setItem('API_KEY', apiKey);
    if (debounce !== null) {
      window.localStorage.setItem('Debounce', debounce);
    }
  }
}
