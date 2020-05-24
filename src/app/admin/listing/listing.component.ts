import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { environment } from "src/environments/environment";
import { Listing } from "src/app/models/Listing";
import { HelperService } from "src/app/helpers/helper.service";
import { AdminService } from "../_services/AdminService";
import { ModalBasicComponent } from 'src/app/shared/components/modal-basic/modal-basic.component';

@Component({
  selector: "app-listing",
  templateUrl: "./listing.component.html",
  styleUrls: ["./listing.component.css"],
})
export class ListingComponent implements OnInit {
  listings: Listing[] = [];
  activePage: number = 1;
  totalRecords: number = 15;
  recordsPerPage: number = 5;
  selectedUser = null;
  @ViewChild("userModal", {static: true}) userModal: ModalBasicComponent;


  constructor(
    private _adminService: AdminService,
    private helper: HelperService
  ) {
    this.getData();
  }

  ngOnInit() {}

  getData() {
    this._adminService
      .getListings(this.activePage, {})
      .subscribe((response: any) => {
        this.handleData(response);
      });
  }

  deleteListing(listing: Listing) {
    this._adminService.removeListing(listing.id).subscribe((response: any) => {
      console.log("response", response);
      this.getData();
    });
  }

  displayActivePage(activePageNumber: number) {
    console.log(activePageNumber);
    this.activePage = activePageNumber;
    this.getData();
  }

  getUrl(listing: Listing) {
    if (!listing.images || listing.images.length == 0) {
      return `assets/img/tmp/listing-${this.helper.generateRandom()}.jpg`;
    } else {
      return environment.baseUrl + listing.images[0];
    }
  }

  displayUser(user) {
    this.selectedUser = user;
    this.userModal.show();
  }

  hideModal() {
    this.userModal.hide();
  }

  changeFeatured(listing: Listing) {
    const status = !listing.is_featured;
    this._adminService.setFeatured(listing.id, status).subscribe((response: any) => {
      console.log("response", response);
      this.getData();
    });
  }

  changeStatus(listing: Listing) {
    const status = !listing.is_active;
    this._adminService.setActiveStatus(listing.id, status).subscribe((response: any) => {
      console.log("response", response);
      this.getData();
    });
  }

  private handleData(response) {
    this.listings = response.data;
    console.log(response);
    this.listings.forEach((listing: Listing) => {
      listing.thumbnail = this.getUrl(listing);
      listing.address = `${listing.addressLineOne} ${listing.addressLineTwo}`;
    });
    this.activePage = response.current_page;
    this.totalRecords = response.total;
    this.recordsPerPage = response.per_page;
  }
}
