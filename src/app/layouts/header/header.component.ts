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
import { Category } from 'src/app/models/Category';
import { ListingService } from 'src/app/services/listing.service';
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
  categories: Category[] = [];
  pCategories: Category[] = [];
  subCategories: Category[] = [];

  get imageUrl() {
    return `url('${environment.baseUrl + this.currentUser.image}')`;
  }

  constructor(private router: Router,
    public auth: AuthenticationService,
    private _listingService: ListingService) {
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
    // this.getCategories();
  }

  ngAfterContentInit() {
    /**
     * Toggle navigation
     */
    $(".navigation-toggle").on("click", function (e) {
      e.preventDefault();

      $("body").toggleClass("navigation-open");

      $('.nav-item').not('.has-sub-menu').on('click', function (e) {
        // e.preventDefault();
        setTimeout(() => {
          $('body').removeClass('navigation-open');
        }, 200);
      });
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

  getCategories() {
    this._listingService.getCategories().subscribe((data: any[]) => {
      this.categories = data;
      this.pCategories = this.categories.filter(cat => !cat.parent_id);
      this.pCategories.forEach(category => {
        category.children = this.categories.filter(cat => category.id === cat.parent_id);
      });
      console.log("parent catgories", this.pCategories);
      const children = this.pCategories.map(cat => cat.children);
      this.subCategories = [].concat.apply([], children);
      console.log("sub catgories", this.subCategories);


    });
  }

  onLogout() {
    this.auth.onLogout().subscribe();
  }
}
