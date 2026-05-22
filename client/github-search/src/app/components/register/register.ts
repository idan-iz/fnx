import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRegister } from './register.interface';
import { Auth } from '../../services/auth';
import { matchValidator } from '../../validators/match.validator';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [MatFormField, MatInput, MatError, MatButton, ReactiveFormsModule, MatLabel],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(Auth);

  registerForm!: FormGroup;
  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    }, { validators: matchValidator('password', 'repeatPassword') });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const payload: IRegister = this.registerForm.value;
      this.authService.register(payload);
    }
  }
}
