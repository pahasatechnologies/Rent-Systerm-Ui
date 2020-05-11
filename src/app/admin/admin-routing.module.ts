import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { ListingComponent } from './listing/listing.component';
import { UserComponent } from './user/user.component';
import { UserListingComponent } from './user-listing/user-listing.component';
import { SubscriberComponent } from './subscriber/subscriber.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'listings',
        component: ListingComponent
      },
      {
        path: 'listings/user/:id',
        component: UserListingComponent
      },
      {
        path: 'users',
        component: UserComponent
      },
      {
        path: 'subscribers',
        component: SubscriberComponent
      },
      {
        path: '**',
        redirectTo: '/admin/dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
