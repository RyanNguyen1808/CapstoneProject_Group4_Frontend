import { Component, signal, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CognitoService } from './services/cognito'
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('angular-cognito');
  isAuthenticated: boolean;
  private authSubscription: Subscription | undefined;

  constructor(private router: Router,
              private cognitoService: CognitoService,
              private cdRef: ChangeDetectorRef) {
    this.isAuthenticated = false;
  }

  public ngOnInit(): void {
    this.authSubscription = this.cognitoService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.cdRef.detectChanges();
    });

    this.cognitoService.isAuthenticated();
  }

  public signOut(): void {
    this.cognitoService.signOut()
    .then(() => {
      this.router.navigate(['/signIn']);
    });
  }

  ngOnDestroy(): void {
    // 💡 Clean up the subscription when the component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
