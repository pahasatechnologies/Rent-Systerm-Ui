import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ngxLoadingAnimationTypes, NgxLoadingModule } from "ngx-loading";
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ControlMessages } from "./components/control-messages.component";
import { ModalBasicComponent } from "./components/modal-basic/modal-basic.component";
import { AppPaginationComponent } from './components/app-pagination/app-pagination.component';
import { RatingComponent } from './components/rating/rating.component';
import { DataTableModule } from 'ng-angular8-datatable';
import { ModalAnimationComponent } from './components/modal-animation/modal-animation.component';
import { NouisliderModule } from 'ng2-nouislider';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    DataTableModule,
    NouisliderModule,
    NgbModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.rectangleBounce,
      backdropBackgroundColour: "rgba(0,0,0,0.4)",
      backdropBorderRadius: "4px",
      primaryColour: "#007bff",
      secondaryColour: "#20c997",
      tertiaryColour: "#343a40"
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  declarations: [ControlMessages, ModalBasicComponent,ModalAnimationComponent, AppPaginationComponent,RatingComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ControlMessages,
    NgxLoadingModule,
    NouisliderModule,
    ModalBasicComponent,
    ModalAnimationComponent,
    ToastrModule,
    DataTableModule,
    AppPaginationComponent,
    RatingComponent
  ]
})
export class SharedModule {}
