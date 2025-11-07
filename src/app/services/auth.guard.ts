import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { CognitoService } from './cognito';

// 💡 Using the functional guard syntax (Angular 14+)
export const AuthGuard: CanActivateFn = async(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(CognitoService);
  const router = inject(Router);

  const isAuthenticated = await authService.isAuthenticated();
  if (isAuthenticated) {
    return true;
  } else {
    console.log('Access denied. Redirecting to sign in.');
    return router.createUrlTree(['/signIn']);
  }
};