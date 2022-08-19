import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core';
import { LoginResponse } from 'src/app/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6)]),
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
    const { email, password } = this.form.value;
    if (!this.form.valid) {
      this.errorMessage = 'Please enter valid information';
      return;
    }
    this.authService.login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: LoginResponse | null | undefined) => {
          const savedUserId = result?.signIn.user.id;
          this.snackBar.open('Login Success!', 'Ok', { duration: 5 * 1000 });
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
