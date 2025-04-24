import { Component, OnInit } from '@angular/core';
import { UserserviceService } from '../userservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private service: UserserviceService,
    private router: Router,
  ) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  errorMessage = '';

  ngOnInit(): void {
  }
  login() {
    console.log('Login form value:',  this.service.isLoggedIn );
    if (this.loginForm.invalid) return;

    this.service.login(this.loginForm.value).subscribe((res: any) => {
      if (res.status == 'success') {
        console.log('Login successful:', res.user);
        this.service.isLoggedIn = true;
        this.router.navigate(['/CRUD']);
      } else {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }


}
