import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    template: `
<div class="lp">

  <!-- ── Left: Brand Panel ── -->
  <div class="lp-left">
    <!-- Top gradient bar -->
    <div class="lp-gbar"></div>

    <div class="lp-brand">
      <!-- Logo on white pill -->
      <div class="lp-logo-wrap">
        <img src="assets/megansoft-logo.png" alt="MeganSoft" />
      </div>

      <h2>Human Resource<br>Management System</h2>
      <p class="lp-desc">
        A unified platform powering MeganSoft's global HR operations —
        from talent acquisition to full employee lifecycle management.
      </p>

      <ul class="lp-features">
        @for (f of features; track f) {
          <li>
            <span class="material-icons lp-fi">{{ f.icon }}</span>
            <span>{{ f.label }}</span>
          </li>
        }
      </ul>

      <div class="lp-stat-row">
        <div class="lp-stat">
          <strong>20+</strong>
          <span>Years</span>
        </div>
        <div class="lp-divider"></div>
        <div class="lp-stat">
          <strong>200+</strong>
          <span>Employees</span>
        </div>
        <div class="lp-divider"></div>
        <div class="lp-stat">
          <strong>Global</strong>
          <span>Presence</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Right: Form Panel ── -->
  <div class="lp-right">
    <div class="lp-form-wrap">

      <!-- Mobile logo (only visible on small screens) -->
      <div class="lp-mobile-logo">
        <img src="assets/megansoft-logo.png" alt="MeganSoft" />
      </div>

      <h1 class="lp-form-title">Welcome back</h1>
      <p class="lp-form-sub">Sign in to your HRMS workspace</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="lp-form">

        <div class="lp-field">
          <label>Email / Username</label>
          <mat-form-field appearance="outline">
            <input matInput formControlName="username"
              autocomplete="username"
              placeholder="Enter Username">
              <mat-icon matSuffix>person_outline</mat-icon>
            </mat-form-field>
          </div>

          <div class="lp-field">
            <label>Password</label>
            <mat-form-field appearance="outline">
              <input matInput
                [type]="hide ? 'password' : 'text'"
                formControlName="password"
                autocomplete="current-password"
                placeholder="Enter Password">
                <button mat-icon-button matSuffix type="button"
                  (click)="hide = !hide">
                  <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>
            </div>

            @if (error) {
              <div class="lp-error">
                <span class="material-icons">error_outline</span>
                {{ error }}
              </div>
            }

            <button class="lp-submit" type="submit"
              [disabled]="loading || form.invalid">
              @if (loading) {
                <mat-spinner diameter="20"
                style="display:inline-flex"></mat-spinner>
              }
              @if (!loading) {
                <span class="material-icons" style="font-size:1rem">login</span>
                Sign In to HRMS
              }
            </button>

          </form>

          <div class="lp-secure">
            <span class="material-icons" style="font-size:0.9rem">lock</span>
            Secured by MeganSoft IT Security
          </div>

        </div>
      </div>

    </div>
`,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: [`
/* ── Page container ── */
.lp {
  min-height: 100vh;
  display: flex;
}

/* ══════════════════════════════
   LEFT BRAND PANEL
   ══════════════════════════════ */
.lp-left {
  flex: 1.1;
  background: linear-gradient(160deg, #1e2260 0%, #313896 55%, #9F32B2 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Decorative gradient bar at top */
.lp-gbar {
  height: 5px;
  background: linear-gradient(90deg, #00D7FF, #313896, #9F32B2);
  flex-shrink: 0;
}

/* Decorative circles */
.lp-left::before {
  content: '';
  position: absolute;
  top: -120px; right: -120px;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: rgba(0,215,255,.06);
}
.lp-left::after {
  content: '';
  position: absolute;
  bottom: -80px; left: -80px;
  width: 380px; height: 380px;
  border-radius: 50%;
  background: rgba(159,50,178,.08);
}

.lp-brand {
  position: relative;
  z-index: 1;
  padding: 40px 48px 48px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 560px;
}

/* Logo on white pill */
.lp-logo-wrap {
  display: inline-flex;
  background: #fff;
  border-radius: 10px;
  padding: 8px 14px;
  margin-bottom: 32px;
  width: fit-content;
  box-shadow: 0 4px 20px rgba(0,0,0,.2);

  img { height: 34px; width: auto; }
}

.lp-brand h2 {
  font-size: 2.1rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 16px;
}

.lp-desc {
  color: rgba(255,255,255,.72);
  font-size: 1rem;
  line-height: 1.65;
  margin-bottom: 32px;
}

.lp-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 36px;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255,255,255,.85);
    font-size: 0.9rem;
  }
}

.lp-fi {
  font-family: 'Material Icons';
  font-size: 1.1rem;
  width: 34px; height: 34px;
  background: rgba(255,255,255,.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #00D7FF;
}

.lp-stat-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background: rgba(255,255,255,.08);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.12);
  width: fit-content;
}

.lp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  strong {
    font-size: 1.1rem;
    font-weight: 800;
    color: #fff;
  }

  span {
    font-size: 0.7rem;
    color: rgba(255,255,255,.5);
    text-transform: uppercase;
    letter-spacing: .08em;
    font-weight: 600;
  }
}

.lp-divider {
  width: 1px; height: 32px;
  background: rgba(255,255,255,.15);
}

/* ══════════════════════════════
   RIGHT FORM PANEL
   ══════════════════════════════ */
.lp-right {
  width: 480px;
  background: #f0f2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 40px;
  position: relative;
}

/* Cyan top accent bar */
.lp-right::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 5px;
  background: linear-gradient(90deg, #313896, #00D7FF);
}

.lp-form-wrap {
  width: 100%;
  max-width: 360px;
}

.lp-mobile-logo {
  display: none;
  margin-bottom: 24px;
  img { height: 32px; }
}

.lp-form-title {
  font-size: 1.8rem;
  font-weight: 900;
  color: #0d0f2e;
  margin-bottom: 6px;
}

.lp-form-sub {
  color: #6b6f9a;
  font-size: 0.9rem;
  margin-bottom: 28px;
}

.lp-form {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lp-field {
  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #2d3260;
    margin-bottom: 4px;
    margin-top: 12px;
  }
}

.lp-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
  margin-top: 4px;
}

.lp-submit {
  width: 100%;
  height: 52px;
  margin-top: 16px;
  background: linear-gradient(135deg, #313896 0%, #9F32B2 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity .2s, box-shadow .2s, transform .15s;
  box-shadow: 0 4px 20px rgba(49,56,150,.35);

  &:hover:not(:disabled) {
    opacity: .92;
    box-shadow: 0 6px 28px rgba(49,56,150,.45);
    transform: translateY(-1px);
  }

  &:disabled { opacity: .5; cursor: not-allowed; transform: none; }
}

.lp-secure {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  margin-top: 20px;
  font-size: 0.75rem;
  color: #a8acd0;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .lp { flex-direction: column; }

  .lp-left { flex: none; }

  .lp-brand {
    padding: 32px 28px;
    h2 { font-size: 1.5rem; }
  }

  .lp-stat-row { display: none; }

  .lp-right {
    width: 100%;
    padding: 36px 24px 48px;
  }

  .lp-mobile-logo { display: block; }

  .lp-brand .lp-logo-wrap { display: none; }
}

@media (max-width: 480px) {
  .lp-features { display: none; }
  .lp-brand { padding: 24px 20px; }
  .lp-brand h2 { font-size: 1.25rem; }
  .lp-desc { font-size: 0.875rem; margin-bottom: 0; }
}
  `]
})
export class LoginComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  loading = false;
  hide = true;
  error = '';

  readonly features = [
    { icon: 'auto_awesome',  label: 'AI-powered Resume Builder with template generation' },
    { icon: 'assignment_ind',label: 'Candidate Assessment with smart skill evaluation' },
    { icon: 'people',        label: 'Full employee lifecycle & HR operations' },
    { icon: 'bar_chart',     label: 'Analytics dashboards, reports & data export' },
  ];

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, password } = this.form.value;
    this.auth.login(username!, password!).subscribe({
      next: () => { this.loading = false; this.router.navigate([this.auth.getDefaultRoute()]); },
      error: () => { this.loading = false; this.error = 'Invalid username or password. Please try again.'; }
    });
  }
}
