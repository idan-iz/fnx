import { Component } from '@angular/core';
import { Login } from "../../components/login/login";
import { Register } from "../../components/register/register";
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [Login, Register, MatButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  regOrLogin: boolean = true

  onTogggleRegOrLogin() {
    this.regOrLogin = !this.regOrLogin;
  }
}
