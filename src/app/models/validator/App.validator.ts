import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class AppValidators {
  static mustMatch(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      console.log('matching..');
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      console.log(control?.value, checkControl?.value);
      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }
      if (control?.value !== checkControl?.value) {
        console.log('no match');
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
