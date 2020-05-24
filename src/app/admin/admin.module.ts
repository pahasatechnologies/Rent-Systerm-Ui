import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminSidebarComponent } from './layout/sidebar/sidebar.component';
import { AdminHeaderComponent } from './layout/header/header.component';
import { AdminFooterComponent } from './layout/footer/footer.component';
import { ListingComponent } from './listing/listing.component';
import { UserComponent } from './user/user.component';
import { UserListingComponent } from './user-listing/user-listing.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [DashboardComponent, AdminLayoutComponent, AdminSidebarComponent, AdminHeaderComponent, AdminFooterComponent, ListingComponent, UserComponent, UserListingComponent, SubscriberComponent, CategoryComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
