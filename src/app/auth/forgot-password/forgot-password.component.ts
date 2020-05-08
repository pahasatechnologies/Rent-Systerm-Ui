import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from "../../helpers/validation.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  error: any;
  loading = false;
  returnUrl: string;
  forgotForm: FormGroup;

  get f() {
    return this.forgotForm.controls;
  }

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private logger: ToastrService,
    private _authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // this.model.remember = true;
    // get return url from route parameters or default to '/'
    this.returnUrl = "/";
    // this._router.navigate([this.returnUrl]);

    // this._script.loadScripts('body', [
    //     'assets/vendors/base/vendors.bundle.js',
    //     // 'assets/demo/default/base/scripts.bundle.js'
    //     ], true).then(() => {
    //         Helpers.setLoading(false);
    //         LoginCustom.init();
    //     });

    this.forgotForm = this.fb.group({
      email: ["", [Validators.required, ValidationService.emailValidator]],
    });
  }

  onSubmit() {
    console.log(this.forgotForm);
    if (this.forgotForm.dirty && this.forgotForm.valid) {
      //this._authService.login(this.model.email, this.model.password)
      //this._router.navigate([this.returnUrl]);
      this._authService.onForgotPassword(this.forgotForm.value).subscribe(
        (response: any) => {
          // get return url from route parameters or default to '/'
          this.logger.success(response.data);
          // this._router.navigate([this.returnUrl]);
          this.forgotForm.reset();
          this.forgotForm.markAsPristine();
          this.forgotForm.markAsUntouched();
          this.forgotForm.updateValueAndValidity();
        },
        (error) => {
          this.error = error.error;
          this.logger.error("Invalid email ");
        }
      );
      // Clear form fields
    }
  }
}
