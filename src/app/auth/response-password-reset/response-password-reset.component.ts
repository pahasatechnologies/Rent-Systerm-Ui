import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from "../../helpers/validation.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-response-password-reset",
  templateUrl: "./response-password-reset.component.html",
  styleUrls: ["./response-password-reset.component.css"],
})
export class ResponsePasswordResetComponent implements OnInit {
  error: any;
  loading = false;
  returnUrl: string;
  resetPasswordForm: FormGroup;

  get f() {
    return this.resetPasswordForm.controls;
  }

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private logger: ToastrService,
    private _authService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ["", [Validators.required, ValidationService.emailValidator]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      password_confirmation: [
        "",
        [Validators.required, ValidationService.matchValues("password")],
      ],
      resetToken: ["", Validators.required],
    });

    this._route.queryParams.subscribe((params) => {
      this.resetPasswordForm.get("resetToken").setValue(params["token"]);
    });
  }

  ngOnInit() {
    // this.model.remember = true;
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";
    // this._router.navigate([this.returnUrl]);

    // this._script.loadScripts('body', [
    //     'assets/vendors/base/vendors.bundle.js',
    //     // 'assets/demo/default/base/scripts.bundle.js'
    //     ], true).then(() => {
    //         Helpers.setLoading(false);
    //         LoginCustom.init();
    //     });
  }

  onSubmit() {
    console.log(this.resetPasswordForm);
    if (this.resetPasswordForm.dirty && this.resetPasswordForm.valid) {

      console.log("Values",this.resetPasswordForm.value)
      this._authService.onResetPassword(this.resetPasswordForm.value).subscribe(
        (response) => {
          // get return url from route parameters or default to '/'
          this.logger.success("Password resetted successfully");
          this._router.navigate([this.returnUrl]);
          this.resetPasswordForm.reset();
        },
        (error) => {
          this.error = error.error;
          this.logger.error("Invalid mobile or password ");
        }
      );
      // Clear form fields
    }
  }
}
