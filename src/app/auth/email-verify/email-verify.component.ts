import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
  selector: "app-email-verify",
  templateUrl: "./email-verify.component.html",
  styleUrls: ["./email-verify.component.css"],
})
export class EmailVerifyComponent implements OnInit {
  queryURL: string = "";
  message: string = "";

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private logger: ToastrService,
    private _authService: AuthenticationService
  ) {
    this._route.queryParams.subscribe((params) => {
      this.queryURL = params["queryURL"];
    });
  }

  ngOnInit() {
    this.validateEmail();
  }

  private validateEmail() {
    this._authService
      .onVerifyEmail(this.queryURL)
      .subscribe((response: any) => {
        console.log("response", response);
        this.message = response.message
        this.logger.success(this.message);
        this._router.navigate(["/auth/login"]);
      });
  }
}
