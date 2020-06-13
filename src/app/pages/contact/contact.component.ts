import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/Contact';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ContactService } from './_service/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact: Contact = new Contact();

  constructor(private logger: ToastrService, private contactSevice: ContactService) { }

  ngOnInit() {
  }

  onSendContact(form: NgForm) {
    if (form.invalid) {
      return this.logger.error("Fill all fields");
    }

    console.log(form.value);
    this.contactSevice.sendContact(form.value).subscribe(response => {
      console.log("response", response);
      this.logger.success("Mail sent sucessfully");
    },
    error => {
      this.logger.error("Something went wrong");
    })

  }

}
