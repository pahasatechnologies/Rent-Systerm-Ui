import { Component, OnInit } from "@angular/core";
import { ListingService } from "src/app/services/listing.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { Listing } from "src/app/models/Listing";
import { environment } from "src/environments/environment";
import { HelperService } from "src/app/helpers/helper.service";
import { Location } from '@angular/common';


@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"]
})
export class EditComponent implements OnInit {
  private listing_id: number;
  listing: Listing = new Listing();

  constructor(
    private _listingService: ListingService,
    private logger: ToastrService,
    private route: ActivatedRoute,
    private helper: HelperService,
    private location: Location
  ) {
    this.route.params.subscribe(params => {
      console.log(params);
      this.listing_id = params.id;
      this.fetchData();
    });
  }

  ngOnInit() {}

  fetchData() {
    this._listingService
      .getListing(this.listing_id)
      .subscribe((listing: any) => {
        this.listing = listing;
        this.listing.thumbnail = this.getUrl(this.listing);
        this.listing.address = `${this.listing.addressLineOne} ${this.listing.addressLineTwo}`;
      });
  }

  getUrl(listing: Listing) {
    if (!listing) return "";
    if (!listing.images || listing.images.length == 0) {
      return `assets/img/tmp/listing-${this.helper.generateRandom()}.jpg`;
    } else {
      return environment.baseUrl + listing.images[0];
    }
  }

  onSubmit(formData: any) {
    console.log("formData", formData);
    this._listingService.updateListing(this.listing_id, formData).subscribe(
      response => {
        console.log("onSubmit", response);
        this.logger.success("Data Saved Successfully");
         this.location.back();
      },
      error => {
        console.log(error);
        let message = Object.values(error.error.errors).join(",")
        this.logger.error(message);
      }
    );
  }
}
