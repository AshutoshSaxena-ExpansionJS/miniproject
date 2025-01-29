import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators as AngularValidators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { Validators } from '../../Validators/validators';
//import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', AngularValidators.required],
      passwordGroup: this.fb.group({
        password: ['', [AngularValidators.required, Validators.passwordStrength]],
        confirmPassword: ['', AngularValidators.required]
      }, { validators: this.passwordMatchValidator }),
      email: ['', [AngularValidators.required, AngularValidators.email]],
      phone_number: ['', [AngularValidators.required, AngularValidators.minLength(10), AngularValidators.maxLength(10)]],
      date_of_birth: ['', AngularValidators.required]
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { passwordGroup, ...registrationData } = this.registerForm.value;
      this.apiService.register(registrationData).subscribe(response => {
        this.router.navigate(['/login']);
      });
    }
  }
}
