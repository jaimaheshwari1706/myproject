import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { UserserviceService } from './userservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserserviceService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.isLoggedIn === true) {
      return true; // Allow access to /CRUD
    } else {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      return false;
    }
  }

  }

