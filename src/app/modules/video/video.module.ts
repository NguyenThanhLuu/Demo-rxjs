import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video/video.component';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { VideoListComponent } from './video-list/video-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafePipe } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    VideoComponent,
    VideoDialogComponent,
    VideoListComponent,
    SafePipe,
  ],
  imports: [CommonModule, MatExpansionModule],
  exports: [VideoListComponent],
})
export class VideoModule {}
