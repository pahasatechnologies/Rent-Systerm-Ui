import {
  Component,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnInit,
  AfterContentInit,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { Listing } from "src/app/models/Listing";
import { ListingService } from "../../../services/listing.service";
import { HelperService } from "src/app/helpers/helper.service";
import { environment } from "src/environments/environment";
import { LazyLoadScriptService } from "src/app/services/lazy-load-script.service";
import {
  map,
  filter,
  take,
  switchMap,
  tap,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";
import { Category } from "src/app/models/Category";
import { fromEvent, Observable } from "rxjs";
import { Router } from "@angular/router";
import { ModalBasicComponent } from "src/app/shared/components/modal-basic/modal-basic.component";
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, AfterContentInit {
  listings: Listing[] = [];
  listing_id: number;
  locations: any[] = [];
  categories: Category[] = [];
  searchedLocations = [];
  searchLocation = "";
  subcription: { email: string } = { email: "" };
  @ViewChild("subscriptionModal", { static: true })
  subscriptionModal: ModalBasicComponent;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => {
        console.log(term);
        return term.length < 2
          ? []
          : this.locations
              .filter(
                (v) => v.state.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
              .map((l) => l.state);
      })
    );

  constructor(
    private cd: ChangeDetectorRef,
    private listingService: ListingService,
    private helper: HelperService,
    private lazyLoadService: LazyLoadScriptService,
    private _router: Router,
    private logger: ToastrService,
  ) {
    listingService.getListings(1, { count: 8 }).subscribe((response: any) => {
      this.handleData(response);
    });

    listingService.getCategories().subscribe((data: any[]) => {
      this.categories = data;
    });

    listingService.getLocations().subscribe((data: any[]) => {
      this.locations = data;
      console.log("locations", this.locations);
    });
  }

  ngOnInit() {}

  ngAfterContentInit(): void {
    this.lazyLoadService
      .loadScript("assets/js/jquery.js")
      .pipe(
        map((_) => "jQuery is loaded"),
        filter((jquery) => !!jquery),
        take(1),
        switchMap((_) =>
          this.lazyLoadService.loadScript("assets/libraries/slick/slick.min.js")
        )
      )
      .subscribe((_) => {
        console.log("SLICK");
        setTimeout(() => {
          $(".testimonials").slick({
            infinite: true,
            dots: true,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
          });
        });
      });

    this.showModal();
  }

  onSearch(data) {
    // this.listingService.searchListing(data, 1).subscribe(
    //   (response) => {
    //     console.log("search response", response);
    //     this.handleData(response);
    //   },
    //   (err) => {}
    // );

    if (this.searchLocation && this.searchLocation.length > 3) {
      this._router.navigate(["/app/listing/list"], {
        queryParams: { location: this.searchLocation },
      });
    }
  }

  getUrl(listing: Listing) {
    if (!listing.images || listing.images.length == 0) {
      return `assets/img/tmp/listing-${this.helper.generateRandom()}.jpg`;
    } else {
      return environment.baseUrl + listing.images[0];
    }
  }

  setListing(listing_id: number) {
    this.listing_id = listing_id;
    this.cd.detectChanges();
  }

  buildRating(rating) {
    let template = "";

    for (let i = 0; i < rating; i++) {
      template += '<i class="fa fa-star"></i>';
    }

    for (let i = rating; i < 5; i++) {
      template += '<i class="fa fa-star-o"></i>';
    }

    return template;
  }

  showModal() {
    if (!sessionStorage.getItem("showSubscriptionModal")) {
      this.subscriptionModal.show();
      sessionStorage.setItem("showSubscriptionModal", "1");
    }
  }

  hideModal() {
    this.subscriptionModal.hide();
  }

  onSubscribe() {
    this.listingService
      .onSubscribe(this.subcription)
      .subscribe((response: any) => {
        console.log("response", response);
        this.logger.success(response.message);
        this.hideModal();
      },
      (error) => {
        if (error.status === 400) {
          this.logger.error(error.error.message);
        } else {
          this.logger.error("something went wrong");
        }
        this.hideModal();

      });
  }

  private handleData(response) {
    this.listings = response.data;
    this.listings.forEach((listing: Listing) => {
      listing.thumbnail = this.getUrl(listing);
    });
  }
}
