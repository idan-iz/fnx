import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { ErrorToast } from "./components/error-toast/error-toast";
import { Loader } from "./components/loader/loader";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ErrorToast, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'github-search';
}
