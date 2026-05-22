import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILogin } from './login.interface';
import { Auth } from '../../services/auth';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [MatFormField, MatInput, MatButton, ReactiveFormsModule, MatLabel, MatError],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(Auth);

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const payload: ILogin = this.loginForm.value;
      this.authService.login(payload);
    }
  }
}
