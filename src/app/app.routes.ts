import { Routes } from '@angular/router';

import { Profile } from './components/profile/profile';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { AuthGuard } from './services/auth.guard';
export  const routes: Routes = [
  {
    path: '',
    redirectTo: 'signIn',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard]
  },
  {
    path: 'signIn',
    component: SignIn,
  },
  {
    path: 'register',
    component: SignUp,
  },
  {
    path: '**',
    redirectTo: 'signIn',
  },
]