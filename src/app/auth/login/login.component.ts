import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ValidationService } from "../../helpers/validation.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  // encapsulation: ViewEncapsulation.Native
})
export class LoginComponent implements OnInit {
  error: any;
  loading = false;
  returnUrl: string;
  loginForm: FormGroup;

  get f() {
    return this.loginForm.controls;
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
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";
    // this._router.navigate([this.returnUrl]);

    // this._script.loadScripts('body', [
    //     'assets/vendors/base/vendors.bundle.js',
    //     // 'assets/demo/default/base/scripts.bundle.js'
    //     ], true).then(() => {
    //         Helpers.setLoading(false);
    //         LoginCustom.init();
    //     });

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, ValidationService.emailValidator]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  signIn() {
    this.error = "";
    if (this.loginForm.dirty && this.loginForm.valid) {
      //this._authService.login(this.model.email, this.model.password)
      //this._router.navigate([this.returnUrl]);
      this._authService.onLogin(this.loginForm.value).subscribe(
        (response) => {
          // get return url from route parameters or default to '/'
          this.logger.success("Logged in successfully");
          this._router.navigate([this.returnUrl]);
          this.loginForm.reset();
          this.resetForm(this.loginForm);
        },
        (error) => {
          if (error.status === 422) {
            this.error = error.error.data;
          }
          this.logger.error(this.error);
        }
      );
      // Clear form fields
    }
  }

  sendVerificationMail() {
    this.error = '';
    this._authService.onResendVerificationMail().subscribe(
      (response) => {
        // get return url from route parameters or default to '/'
        this._authService.removeSessionToken();
        this.loginForm.reset();
        this.resetForm(this.loginForm);
        this.logger.success(response.message);
      },
      (error) => {
        this.logger.error(this.error);
      }
    );
  }

  resetForm(form: FormGroup) {
    form.reset();

    Object.keys(form.controls).forEach((key) => {
      form.get(key).setErrors(null);
    });
  }
}
