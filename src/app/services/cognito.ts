import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Amplify } from 'aws-amplify';
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchAuthSession,
  fetchUserAttributes,
  updateUserAttributes
} from 'aws-amplify/auth';

import awsconfig from '../../aws-exports'

export interface IUser {
  email: string;
  password?: string;
  showPassword?: boolean;
  code?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor() {
    Amplify.configure(awsconfig);
    this.authenticationSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.authenticationSubject.asObservable();
  }

  public async signUp(user: IUser): Promise<any> {
    try
    {
      var result = await signUp({
      username: user.email,
      password: user.password!,
      options: {
        userAttributes: {
          email: user.email,
          name: user.name || '',
        },
      },
    });
    return result;
    }
    catch(error)
    {
      
    }
    
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return confirmSignUp({
      username: user.email,
      confirmationCode: user.code!,
    });
  }

  public async signIn(user: IUser): Promise<boolean> {
    try {
        await signIn({
            username: user.email,
            password: user.password!,
            options: { authFlowType: 'USER_PASSWORD_AUTH' }
        });

        this.authenticationSubject.next(true);
        console.log("Sign-in successful.");
        return true; 
        
    } catch (error) {
        console.error("Sign-in failed:", error);
        return false; 
    }
}

public async getUser(): Promise<any> {
    try {
      const attributes = await fetchUserAttributes();
      this.authenticationSubject.next(true);
      return attributes;
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      throw error;
    }
  }

  public signOut(): Promise<void> {
    return signOut().then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public async isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return true;
    }

    try {
      const session = await fetchAuthSession(); 
      const isAuthenticated = !!session.userSub || !!session.tokens?.accessToken;
      if (isAuthenticated) {
            this.authenticationSubject.next(true); 
            return true;
        } else {
            this.authenticationSubject.next(false); 
            return false;
        }
    } catch (error) {
      this.authenticationSubject.next(false);
    }

    if (this.authenticationSubject.value == false) {
        this.authenticationSubject.next(false);
    }
    return this.authenticationSubject.value;
}

  public async updateUser(user: IUser): Promise<boolean> {
    const attributesToUpdate: any = {};
    if (user.name) {
      attributesToUpdate.name = user.name;
    }

    try
    {    
        var result = await updateUserAttributes({
                                      userAttributes: attributesToUpdate
                                  });
        return true;
    }
    catch(error)
    {
        console.error("Failed to update user:", error);
        return false; 
    }
  }

  public getAuthenticationSubject(): BehaviorSubject<boolean> {
    return this.authenticationSubject;
  }

  public async getAuthenticatedSession(): Promise<any> {
      try {
        const session = await fetchAuthSession(); 
        return session;
      } catch (error) {
        return null;
      }
  }

  public async getIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
  }

  public async getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
  }
}