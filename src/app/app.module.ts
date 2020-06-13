import { SharedModule } from "./shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthenticationService } from "./services/authentication.service";
import { AppLayoutComponent } from "./layouts/app-layout.component";
import { AppHeaderComponent } from "./layouts/header/header.component";
import { AppFooterComponent } from "./layouts/footer/footer.component";
import { AppSidebarComponent } from "./layouts/sidebar/sidebar.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ScriptLoaderService } from "./services/script-loader.service";
import { AppHttpInterceptorService } from "./services/http-interceptor.service";
import { TermConditionsComponent } from './pages/term-conditions/term-conditions.component';
import { ContactComponent } from './pages/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    AppFooterComponent,
    TermConditionsComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    AuthenticationService,
    ScriptLoaderService,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
