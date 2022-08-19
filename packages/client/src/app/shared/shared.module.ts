import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';

import { PostComponent } from './components/post/post.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { DialogComponent } from './components/dialog/dialog.component';

const matModules = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDialogModule,
  MatProgressBarModule,
  MatBadgeModule
]

@NgModule({
  declarations: [
    CreatePostComponent,
    PostComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...matModules
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ...matModules
  ]
})
export class SharedModule { }
