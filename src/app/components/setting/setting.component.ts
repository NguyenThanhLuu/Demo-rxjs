import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { YoutubeService } from 'src/app/services/youtube.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  numberPerPageOpts: number[] = [5, 10, 15, 20];
  numPP: number = 0;
  apiKey: string = '';
  debounce: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<SettingComponent>,
    private youtube: YoutubeService
  ) {}

  ngOnInit(): void {
    this.numPP = parseInt(this.data);
    this.apiKey = window.localStorage.getItem('API_KEY') || '';
    this.debounce = window.localStorage.getItem('Debounce') || '0';
  }

  saveSetting(f: any) {
    if (f.valid) {
      this.youtube.saveSetting(f.value.apiKey, f.value.debounce);
      this.dialogRef.close({ data: this.numPP });
    }
  }
}
