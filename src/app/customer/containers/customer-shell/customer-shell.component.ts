import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

export const myValidator = (min: number, max: number): ValidatorFn => {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  };
};

const emailMatcher = (c: AbstractControl): { [key: string]: boolean } | null => {
  const email = c.get('email');
  const confirmEmail = c.get('confirmEmail');

  if (email.pristine || confirmEmail.pristine) {
    return null;
  }

  if (email.value !== confirmEmail.value) {
    // TODO: WOW
    confirmEmail.setErrors({'match': true});
    return { 'match': true };
  }
  return null;
};

@Component({
  selector: 'app-customer-shell',
  templateUrl: './customer-shell.component.html',
  styleUrls: ['./customer-shell.component.scss']
})
export class CustomerShellComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;
  emailMessage: string = '';
  get addressGroups(): FormArray{
    return <FormArray>this.customerForm.get('addressGroup');
  }

  private emailValidationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required]],
      }, { validator: emailMatcher }),
      phone: [''],
      rating: [null, [myValidator(1, 5)]],
      notification: ['email'],
      sendCatalog: true,
      addressGroup: this.fb.array([ this.buildAddress() ]),
    });

    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl)
    )
  }

  addAddress = (): void => {
    if (this.addressGroups.length < 3) {
      this.addressGroups.push(this.buildAddress());
    }
  }

  buildAddress = (): FormGroup => {
    return this.fb.group({
      addressType: ['home'],
      street1: ['', Validators.required],
      street2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: [''],
    });
  }

  setMessage = (c: AbstractControl): void => {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.emailValidationMessages[key]
      ).join(' ' );
    }
  };

  setNotification = (notifyType: string): void => {
    const phoneControl = this.customerForm.get('phone');
    if (notifyType === 'text') {
      phoneControl.setValidators([Validators.required]);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  populateTestData = (): void => {
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harknes',
      email: 'jack@torchwood.com',
      sendCatalog: false
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}
