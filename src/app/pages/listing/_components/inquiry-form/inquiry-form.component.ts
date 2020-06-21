import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit,
  Output,
  Input,
} from "@angular/core";
import { ScriptLoaderService } from 'src/app/services/script-loader.service';
import { ListingService } from 'src/app/services/listing.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Inquiry } from 'src/app/models/Inquiry';
import { ContactService } from 'src/app/pages/contact/_service/contact.service';
import { Listing } from 'src/app/models/Listing';

@Component({
  selector: "app-inquiry-form",
  templateUrl: "./inquiry-form.component.html",
  styleUrls: ["./inquiry-form.component.css"],
})

export class InquiryFormComponent {
  inquiry: Inquiry = new Inquiry();
  @Input() listing: Listing;

  constructor(
    private contactSevice: ContactService,
    private logger: ToastrService
  ) {  }

  onSubmit(form: NgForm) {
    console.log(form.value, this.listing);
    if (form.invalid) {
      return this.logger.error("Fill all fields");
    }
    const inquiry = form.value;
    inquiry.subject = `Inquiry regarding ${this.listing.title}`;
    this.contactSevice.sendContact(inquiry).subscribe(response => {
      console.log("response", response);
      this.logger.success("Mail sent sucessfully");
    },
    error => {
      this.logger.error("Something went wrong");
    })

  }

}