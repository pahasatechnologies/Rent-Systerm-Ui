import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NewComponent } from "./new/new.component";
import { ListingComponent } from './listing/listing.component';
import { ListingDetailComponent } from './listing-detail/listing-detail.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  {
    path: "",
    // component: AppLayoutComponent,
    children: [
      {
        path: "list",
        component: ListingComponent
      },
      {
        path: ":id/show",
        component: ListingDetailComponent
      },
      {
        path: "new",
        component: NewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ":id/edit",
        component: EditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "categories/:id",
        component: CategoriesComponent,
      },
      {
        path: "**",
        redirectTo: "/app/home"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "/app/home"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListingRoutingModule {}
