import { Component, OnInit } from "@angular/core";
import { AdminService } from "../_services/AdminService";
import { HelperService } from "src/app/helpers/helper.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-subscriber",
  templateUrl: "./subscriber.component.html",
  styleUrls: ["./subscriber.component.css"],
})
export class SubscriberComponent implements OnInit {
  subscribers: any[] = [];
  activePage: number = 1;
  totalRecords: number = 15;
  recordsPerPage: number = 5;
  selectedUser = null;

  constructor(
    private _adminService: AdminService,
    private helper: HelperService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.getData();
    });
  }

  ngOnInit() {}

  getData() {
    this._adminService
      .getSubscriberListings(this.activePage)
      .subscribe((response: any) => {
        this.handleData(response);
      });
  }

  displayActivePage(activePageNumber: number) {
    console.log(activePageNumber);
    this.activePage = activePageNumber;
    this.getData();
  }

  deleteSubscriber(subscriber) {
    this._adminService.removeSubscriber(subscriber.id).subscribe((response: any) => {
      console.log("response", response);
      this.getData();
    });
  }

  changeSubscriberStatus(subscriber, status) {
    status = !status;
    this._adminService.changeSubscriberStatus(subscriber.id, status).subscribe((response: any) => {
      console.log("response", response);
      this.getData();
    });
  }

  private handleData(response) {
    this.subscribers = response.data;
    console.log(response);
    this.activePage = response.current_page;
    this.totalRecords = response.total;
    this.recordsPerPage = response.per_page;
  }
}
