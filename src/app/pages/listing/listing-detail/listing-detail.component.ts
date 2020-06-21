import { Component, OnInit, Input, AfterContentInit } from "@angular/core";

declare const $: any;
declare const google: any;
declare const RichMarker: any;
import { ScriptLoaderService } from "../../../services/script-loader.service";
import { Listing } from "../../../models/Listing";
import { ListingService } from "../../../services/listing.service";
import { ActivatedRoute } from "@angular/router";
import { HelperService } from "src/app/helpers/helper.service";
import { environment } from "src/environments/environment";
import { LazyLoadScriptService } from "src/app/services/lazy-load-script.service";
import { map, filter, take, switchMap } from "rxjs/operators";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-listing-detail",
  templateUrl: "./listing-detail.component.html",
  styleUrls: ["./listing-detail.component.css"]
})
export class ListingDetailComponent implements OnInit, AfterContentInit {
  @Input() listing_id: number;
  map: any;
  bound: any;
  zoom: number = 15;
  currentUser = null;
  reviewObj: Review = { rating: 0, review: "" };
  is_bookmarked: boolean = false;

  listing: Listing;
  latest: Listing[];

  constructor(
    private logger: ToastrService,
    private listingService: ListingService,
    private route: ActivatedRoute,
    private helper: HelperService,
    private lazyLoadService: LazyLoadScriptService,
    private _auth: AuthenticationService
  ) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.listing_id = params.id;
      this.fetchData();
      this.fetchLatestData();
    });
  }

  ngOnInit() {
    this._auth.userEmitter.subscribe(user => {
      console.log("main", user);
      this.currentUser = user;
    });
  }

  ngAfterContentInit(): void {
    this.lazyLoadService
      .loadScript("assets/js/jquery.js")
      .pipe(
        map(_ => "jQuery is loaded"),
        filter(jquery => !!jquery),
        take(1),
        switchMap(_ =>
          this.lazyLoadService.loadScript("assets/libraries/slick/slick.min.js")
        ),
        switchMap(_ =>
          this.lazyLoadService.loadScript("assets/js/jquery.raty.js")
        )
      )
      .subscribe(_ => {
        console.log("SLICK");
        setTimeout(() => {
          $(".gallery").slick({
            infinite: true,
            dots: true,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1
          });
        }, 500);

        console.log($(".rating-item").length);
        // if ($(".rating-item").length !== 0) {
        //   $(".rating-item").each(function() {
        //     $(this).raty({
        //       starType: "i",
        //       starOn: "fa fa-star",
        //       starHalf: "fa fa-star-half-o",
        //       starOff: "fa fa-star-o"
        //     });
        //   });
        // }
      });
  }

  initMap() {
    const markerCenter = new google.maps.LatLng(
      this.listing["latitude"],
      this.listing["longitude"]
    );
    this.map = new google.maps.Map(document.getElementById("map-details"), {
      zoom: this.zoom,
      scrollwheel: false,
      center: markerCenter,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }, { lightness: 17 }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }]
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 18 }]
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { lightness: 16 }]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }, { lightness: 21 }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#dedede" }, { lightness: 21 }]
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            { visibility: "on" },
            { color: "#ffffff" },
            { lightness: 16 }
          ]
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ saturation: 36 }, { color: "#333333" }, { lightness: 40 }]
        },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#f2f2f2" }, { lightness: 19 }]
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#fefefe" }, { lightness: 20 }]
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }]
        }
      ]
    });
    // const component = this;
    // component.bound = new google.maps.LatLngBounds();

    // this.listing["latitude"] = 30.7333;
    // this.listing["longitude"] = 76.7794;

    // if (this.listing["latitude"] && this.listing["longitude"]) {
    //   console.log("latitude", this.listing["latitude"], this.map);
    //   const markerCenter = new google.maps.LatLng(
    //     this.listing["latitude"],
    //     this.listing["longitude"]
    //   );

    const markerVerified = this.listing["is_active"]
      ? '<div class="marker-verified"><i class="fa fa-check"></i></div>'
      : "";

    const markerPrice =
      this.listing["price"] && this.listing["price"] != "false"
        ? '<div class="marker-price">' + this.listing["price"] + "</div>"
        : "";

    const markerContent =
      '<div class="marker">' +
      '<div class="marker-inner">' +
      '<span class="marker-image" style="background-image: url(' +
      this.listing["thumbnail"] +
      ');"></span>' +
      "</div>" +
      markerVerified +
      markerPrice +
      "</div>";

    const marker = new RichMarker({
      id: this.listing["id"],
      data: this.listing,
      flat: true,
      position: markerCenter,
      map: this.map,
      shadow: 0,
      content: markerContent
    });

    //   component.bound.extend(
    //     new google.maps.LatLng(
    //       this.listing["latitude"],
    //       this.listing["longitude"]
    //     )
    //   );
    // }
  }

  actionZoomIn() {
    this.map.setZoom(this.map.getZoom() + 1);
  }

  actionZoomOut() {
    this.map.setZoom(this.map.getZoom() - 1);
  }

  actionType(type: string) {
    if (type === "HYBRID") {
      this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
    } else if (type === "SATELLITE") {
      this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    } else if (type === "TERRAIN") {
      this.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    } else if (type === "ROADMAP") {
      this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }
  }

  fetchData() {
    this.listingService
      .getListing(this.listing_id)
      .subscribe((listing: any) => {
        this.listing = listing;
        this.listing.thumbnail = this.getUrl(this.listing);
        this.initMap();
      });

    if (this.currentUser) {
      this.listingService
        .isBookmarked(this.listing_id)
        .subscribe((response: any) => {
          console.log("is bookmarked", response);
          this.is_bookmarked = response.is_bookmarked;
        });
    }
  }

  fetchLatestData() {
    this.listingService.getLatestListing().subscribe((listing: any) => {
      this.latest = listing;
      this.latest.forEach(listing => {
        listing.thumbnail = this.getUrl(listing);
      });
    });
  }

  getAddress(listing) {
    if (!listing) return "";
    return `${listing.addressLineOne} ${listing.city} ${listing.state}`;
  }

  getUrl(listing: Listing) {
    if (!listing) return "";
    if (!listing.images || listing.images.length == 0) {
      return `assets/img/tmp/listing-${this.helper.generateRandom()}.jpg`;
    } else {
      return environment.baseUrl + listing.images[0];
    }
  }

  getImgUrl(image: string) {
    if (!image) return "";
    return environment.baseUrl + image;
  }

  onRatingClick(clickObj: any): void {
    // const item = this.items.find(((i: any) => i.id === clickObj.itemId));
    // if (!!item) {
    //   item.rating = clickObj.rating;
    //   this.ratingClicked = clickObj.rating;
    //   this.itemIdRatingClicked = item.company;
    // }

    console.log("clickObj", clickObj);
    this.reviewObj.rating = clickObj.rating;
  }

  onReviewSubmit() {
    console.log("...", this.reviewObj);
    if (this.reviewObj.id) {
      this.listingService
        .updateRating(this.reviewObj.id, this.reviewObj)
        .subscribe(
          res => {
            this.logger.success("review saved successfully");
            this.clearReviewForm();
            this.fetchData();
          },
          err => {
            this.logger.error("something went wrong");
          }
        );
    } else {
      this.listingService.saveRating(this.listing_id, this.reviewObj).subscribe(
        res => {
          this.logger.success("review saved successfully");
          this.clearReviewForm();
          this.fetchData();
        },
        err => {
          this.logger.error("something went wrong");
        }
      );
    }
  }

  onDeleteRating(id: number) {
    this.listingService.deleteRating(id).subscribe(
      res => {
        this.logger.success("review deleted successfully");
        this.fetchData();
      },
      err => {
        this.logger.error("something went wrong");
      }
    );
  }

  onEditClick(review: any) {
    this.reviewObj = <Review>review;
    $("html, body").animate(
      {
        scrollTop: $("#comment-form").offset().top
      },
      500
    );
    console.log(this.reviewObj);
  }

  addBookmark() {
    this.listingService.addBookmark(this.listing.id).subscribe(
      resp => {
        console.log("bookmark", resp);
        this.is_bookmarked = resp.is_bookmarked;
      },
      err => {
        console.log("err bookmark", err);
      }
    );
  }

  removeBookmark() {
    this.listingService.removeBookmark(this.listing.id).subscribe(
      resp => {
        console.log("bookmark", resp);
        this.is_bookmarked = resp.is_bookmarked;
      },
      err => {
        console.log("err bookmark", err);
      }
    );
  }

  clearReviewForm() {
    this.reviewObj = { rating: 0, review: "" };
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
}
