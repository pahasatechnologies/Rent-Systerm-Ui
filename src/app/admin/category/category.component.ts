import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../_services/AdminService';
import { HelperService } from 'src/app/helpers/helper.service';
import { ModalBasicComponent } from 'src/app/shared/components/modal-basic/modal-basic.component';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Category } from 'src/app/models/Category';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  parentCategories = [];
  initCategory = new Category();
  selectedCategory = {...this.initCategory};
  @ViewChild("categoryModal", { static: true }) categoryModal: ModalBasicComponent;

  constructor(private _adminService: AdminService,
    private helper: HelperService, private logger: ToastrService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this._adminService
      .getCategories()
      .subscribe((response: any) => {
        this.handleData(response);
      });
  }

  displayModal(category) {
    this.selectedCategory = {...category};
    this.categoryModal.show();
  }

  hideModal() {
    this.categoryModal.hide();
    this.selectedCategory = {...this.initCategory};
  }

  deleteCategory(category) {
    this._adminService.removeCategory(category.id).subscribe((response: any) => {
      console.log("response", response);
      this.getData();
    });
  }

  onSaveCategory(form: NgForm) {
    console.log("selectedCategory", this.selectedCategory, form.value);
    if (this.selectedCategory.id) {
      this._adminService.updateCategory(this.selectedCategory.id, this.selectedCategory).subscribe((response: any) => {
        console.log("response", response);
        this.getData();
        this.hideModal();
      }, (err) => {
        const error = err.error;
        this.logger.error("Something went wrong", "Error");
      });
    } else {
      this._adminService.saveCategory(this.selectedCategory).subscribe((response: any) => {
        console.log("response", response);
        this.getData();
        this.hideModal();
      }, (err) => {
        const error = err.error;
        this.logger.error("Something went wrong", "Error");
      });
    }
  }

  private handleData(response) {
    this.categories = response;
    console.log(response);
    this.parentCategories = [];
    this.categories.forEach((category) => {
      if (!category.parent_id)
        this.parentCategories.push(category);
    });
    // this.listings.forEach((listing: Listing) => {
    //   listing.thumbnail = this.getUrl(listing);
    //   listing.address = `${listing.addressLineOne} ${listing.addressLineTwo}`;
    // });
    // this.activePage = response.current_page;
    // this.totalRecords = response.total;
    // this.recordsPerPage = response.per_page;
  }

}
