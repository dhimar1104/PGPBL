import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";

export class RegisterPageForm {
    private formBuilder: FormBuilder;
    private form: FormGroup;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.form = this.createForm();
    }

    private createForm(): FormGroup {
        let form = this.formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: [''],
            phone: ['', [Validators.required]],
            address: this.formBuilder.group({
                street: ['', [Validators.required]],
                number: ['', [Validators.required]],
                neighborhood: ['', [Validators.required]],
                complement: ['', [Validators.required]],
                zipCode: ['', [Validators.required]],
                state: ['', [Validators.required]],
                city: ['', [Validators.required]]
            })
        });

        // Setting custom validator for matching password and repeatPassword
        form.get('repeatPassword')?.setValidators(this.matchPasswordAndRepeatPassword(form));

        return form;
    }


    getForm(): FormGroup {
        return this.form;
    }

    // Custom validator function
    private matchPasswordAndRepeatPassword(form: FormGroup): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const password = form.get('password')?.value;
            const repeatPassword = control.value;

            // Check if passwords match
            if (password !== repeatPassword) {
                return { isntMatching: true };
            }
            return null;
        };
    }
}
