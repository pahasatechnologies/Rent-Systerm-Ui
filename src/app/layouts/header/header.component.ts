import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  AfterContentInit,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { User } from "../../models/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { environment } from "src/environments/environment";
declare const $: any;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AppHeaderComponent implements OnInit, AfterContentInit {
  headerClass: string;
  currentUser: User = null;

  get imageUrl() {
    return `url('${environment.baseUrl + this.currentUser.image}')`;
  }

  constructor(private router: Router, public auth: AuthenticationService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.changeHeader();
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });

    this.subscribeUser();
  }

  ngOnInit() {
    this.auth.getUser().subscribe();
  }

  ngAfterContentInit() {
    /**
     * Toggle navigation
     */
    $(".navigation-toggle").on("click", function (e) {
      e.preventDefault();

      $("body").toggleClass("navigation-open");
    });
  }

  full_name() {
    return this.currentUser
      ? this.currentUser.first_name + " " + this.currentUser.last_name
      : "";
  }

  changeHeader() {
    console.log("current url", this.router.url);
    if (this.router.url == "/home")
      this.headerClass = "header-transparent header-light";
    else this.headerClass = "";
  }

  subscribeUser() {
    this.auth.userEmitter.subscribe((user: User) => {
      console.log("header", user);
      this.currentUser = user;
    });
  }

  onLogout() {
    this.auth.onLogout().subscribe();
  }
}
