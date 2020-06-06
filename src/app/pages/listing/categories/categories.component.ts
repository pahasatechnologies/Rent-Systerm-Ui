import { Component, OnInit } from '@angular/core';
import { ListingService } from "src/app/services/listing.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/Category';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  private sub: Subscription = null;
  categoryId: number;
  category: Category;

  constructor(private listingService: ListingService,
    private _router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.categoryId = params["id"];
      this.getData();
    });
  }

  getData() {
    this.listingService
      .getCategory(this.categoryId)
      .subscribe((response: any) => {
        this.handleData(response);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private handleData(response) {
    this.category = response;
    console.log("this.category",this.category);
  }


}
