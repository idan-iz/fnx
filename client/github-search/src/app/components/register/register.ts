import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRegister } from './register.interface';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [],
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
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const payload: IRegister = this.registerForm.value;
      this.authService.register(payload);
    }
  }
}
