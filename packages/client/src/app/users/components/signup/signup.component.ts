import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core';
import { RegisterResponse } from 'src/app/shared';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    username: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [ Validators.required, Validators.minLength(6)])
  });
  errorMessage: string | null = '';
  destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    const { fullName, username, email, password, password2 } = this.form.value;
    if (password !== password2) {
      this.errorMessage = 'Passwords mismatch';
      return;
    }
    if (!this.form.valid) {
      this.errorMessage = 'Please enter valid information';
      return;
    }
    this.authService.register(fullName, username, email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: RegisterResponse | null | undefined) => {
          const savedUserId = result?.register.user.id;
          this.snackBar.open('Signup Success!', 'Ok', { duration: 5 * 1000 });
          if (savedUserId) {
            this.router.navigateByUrl('/users/profile/${savedUserId}')
          }
        },
        error: (err) => {
          console.error(err.error);
          this.errorMessage = err.message;
          this.snackBar.open(err.message, 'Ok', { duration: 5 * 1000 })
        }
      });
  }

}
