import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const firstControl = control.get(controlName);
    const secondControl = control.get(matchingControlName);

    if (!firstControl || !secondControl) {
      return null;
    }

    if (firstControl.value !== secondControl.value) {
      // Set mismatch error on the second control while preserving existing errors
      secondControl.setErrors({ ...secondControl.errors, mismatch: true });
      return { mismatch: true };
    } else {
      // Remove mismatch error if it exists, preserving other errors
      if (secondControl.errors) {
        const { mismatch, ...remainingErrors } = secondControl.errors;
        secondControl.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
      }
      return null;
    }
  };
}
