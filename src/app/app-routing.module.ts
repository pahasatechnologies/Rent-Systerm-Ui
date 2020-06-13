import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout.component';
import { TermConditionsComponent } from './pages/term-conditions/term-conditions.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    // component: AppLayoutComponent,
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: 'app',
        component: AppLayoutComponent,
        children: [
          {
            path: 'profile',
            loadChildren: './pages/profile/profile.module#ProfileModule'
          },
          {
            path: 'listing',
            loadChildren: './pages/listing/listing.module#ListingModule'
          },
          {
            path: 'user',
            loadChildren: './pages/user/user.module#UserModule'
          },
          {
            // path: 'terms-conditons',
            path: 'terms',
            component: TermConditionsComponent
          },
          {
            // path: 'terms-conditons',
            path: 'contact',
            component: ContactComponent
          },
          {
            path: '',
            loadChildren: './pages/home/home.module#HomeModule'
          },
          {
            path: '**',
            redirectTo: '/app/home'
          }
        ]

      },
      {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule'
      },
      {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule'
      },
      {
        path: '**',
        redirectTo: '/app/home'
      }
    ]

  },
  {
    path: '**',
    redirectTo: '/app/home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
