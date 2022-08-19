import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, Subject } from 'rxjs';
import { User, SearchUsersResponse, UsersResponse } from 'src/app/shared';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css']
})
export class SearchDialogComponent implements OnInit, OnDestroy {
  users: User[] = [];
  fetchMore: (feed: User[]) => void = () => {};
  destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public response: SearchUsersResponse,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.response.data
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: UsersResponse | null | undefined) => {
          if (data?.searchUsers) {
            this.users = data.searchUsers;
          }
        }
      })
      this.fetchMore = this.response.fetchMore;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToProfile(profileId: string): void {
    this.router.navigateByUrl('/users/profile/${profileId}');
  }

  invokeFetchMore(): void {
    this.fetchMore(this.users);
  }

  close(): void {
    this.dialogRef.close();
  }

}
