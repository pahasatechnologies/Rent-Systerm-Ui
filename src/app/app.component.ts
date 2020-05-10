import { Component, ViewEncapsulation } from "@angular/core";
import { Subscription } from "rxjs";
import { LoaderService } from "./services/loader.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = "rent-management";
  loading: boolean = false;
  loadingSubscription: Subscription;
  constructor(private loaderService: LoaderService) {}
  ngOnInit() {
    this.loadingSubscription = this.loaderService.loaderStatus.subscribe(
      (val: boolean) => {
        console.log("isSpinnerVisible", val);
        // if (this.loading != val) {
          setTimeout(() => {
            this.loading = val;
          });
        // }
      }
    );
  }
  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
