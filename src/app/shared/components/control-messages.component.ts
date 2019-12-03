import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ValidationService } from "../../helpers/validation.service";

@Component({
  selector: "control-messages",
  template: `
    <div *ngIf="errorMessage !== null"></div>
  `
})
export class ControlMessages {
  @Input() control: FormControl;
  constructor() {}

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }
}
