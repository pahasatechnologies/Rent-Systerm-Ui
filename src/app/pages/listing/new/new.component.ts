import { Component, OnInit, AfterContentInit } from "@angular/core";
import { ListingService } from "../../../services/listing.service";
import { ToastrService } from "ngx-toastr";
import { Listing } from 'src/app/models/Listing';
import { Location } from '@angular/common';

@Component({
  selector: "listing-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.css"]
})
export class NewComponent implements OnInit {
  listing: Listing = new Listing();
  constructor(
    private _listingService: ListingService,
    private logger: ToastrService,
    private location: Location
  ) {}
  ngOnInit() {}

  onSubmit(formData: any) {
    console.log("formData", formData);
    this._listingService.saveListing(formData).subscribe(
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
