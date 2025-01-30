import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators as AngularValidators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';
import { Validators } from '../../Validators/validators';
//import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private router: Router,
    private snackBar: MatSnackBar
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

  private formatDate(date: any): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { passwordGroup, ...registrationData } = this.registerForm.value;
  
      registrationData.password = this.registerForm.value.passwordGroup.password;
      registrationData.date_of_birth = this.formatDate(this.registerForm.value.date_of_birth);
  
      console.log('Sending Data:', registrationData); 
  
      this.apiService.register(registrationData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        }
      });
    }
  }
}