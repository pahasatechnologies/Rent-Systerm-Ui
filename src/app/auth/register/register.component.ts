import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { ValidationService } from "src/app/helpers/validation.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  // encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  message: string = "";
  error: any;
  returnUrl: string;
  registerForm: FormGroup;
  roles: { label: string; value: string }[] = [
    { label: "Tenant", value: "tenant" },
    { label: "Landlord", value: "landlord" },
  ];

  get f() {
    return this.registerForm.controls;
  }

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService,
    private logger: ToastrService,
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

    this.registerForm = this.fb.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", [Validators.required, ValidationService.emailValidator]],
      phone: ["", [Validators.required, Validators.pattern("^[6-9]\\d{9}$")]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      password_confirmation: [
        "",
        [Validators.required, ValidationService.matchValues("password")],
      ],
      role: [this.roles[0].value, Validators.required],
    });
  }

  signUp() {
    console.log(this.registerForm);
    this.message = "";
    if (this.registerForm.dirty && this.registerForm.valid) {
      //this._authService.login(this.model.email, this.model.password)
      //this._router.navigate([this.returnUrl]);
      this._authService.onRegister(this.registerForm.value).subscribe(
        (response) => {
          // get return url from route parameters or default to '/'
          this._router.navigate([this.returnUrl]);
          this.message = "Please check your inbox for verification link";
          this.logger.success(this.message);
          this.registerForm.reset();
        },
        (error) => {
          this.error = error.error;
          this.logger.error("Invalid Data", "Error");
        }
      );
      // Clear form fields
    }
  }
}
