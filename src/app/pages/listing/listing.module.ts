import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListingRoutingModule } from "./listing-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { NewComponent } from "./new/new.component";
import { ListingFormComponent } from "./_components/listing-form/listing-form.component";
import { ListingComponent } from "./listing/listing.component";
import { ListingDetailComponent } from './listing-detail/listing-detail.component';
import { EditComponent } from './edit/edit.component';
import { CategoriesComponent } from './categories/categories.component';
import { InquiryFormComponent } from './_components/inquiry-form/inquiry-form.component';

@NgModule({
  declarations: [
    NewComponent,
    ListingFormComponent,
    ListingComponent,
    ListingDetailComponent,
    EditComponent,
    CategoriesComponent,
    InquiryFormComponent
  ],
  imports: [CommonModule, SharedModule, ListingRoutingModule]
})
export class ListingModule {}
