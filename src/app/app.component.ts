import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './core/auth/auth.service';
import { ApiLoadingService } from './core/services/api-loading.service';
import { filter } from 'rxjs/operators';

interface NavItem { label: string; icon: string; route?: string; disabled?: boolean; permission?: string; }
interface NavGroup { groupLabel: string; items: NavItem[]; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatTooltipModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  /** true = icon-only on desktop, hidden on mobile */
  sidebarCollapsed = false;
  /** mobile overlay open */
  mobileOpen = false;
  isMobile = false;
  isTablet = false;

  currentPageTitle = 'Resume Builder';
  currentSection   = 'Talent Acquisition';
  readonly currentYear = new Date().getFullYear();

  readonly navGroups: NavGroup[] = [
    {
      groupLabel: 'Talent Acquisition',
      items: [
        { label: 'Resume Builder',       icon: 'description',       route: '/resume', permission: 'app:full_access' },
        { label: 'Candidate Assessment', icon: 'assignment_ind',    route: '/assessment', permission: 'assessment:write' },
        { label: 'Assessment Reports',   icon: 'bar_chart',         route: '/reports', permission: 'app:full_access' },
      ]
    },
    {
      groupLabel: 'Employee Management',
      items: [
        { label: 'Employee Directory',   icon: 'people',            disabled: true },
        { label: 'Onboarding',           icon: 'waving_hand',       disabled: true },
        { label: 'Org Chart',            icon: 'account_tree',      disabled: true },
      ]
    },
    {
      groupLabel: 'Payroll & Finance',
      items: [
        { label: 'Payroll Processing',   icon: 'payments',          disabled: true },
        { label: 'Expense Claims',       icon: 'receipt_long',      disabled: true },
      ]
    },
    {
      groupLabel: 'Leave & Attendance',
      items: [
        { label: 'Leave Management',     icon: 'event_available',   disabled: true },
        { label: 'Attendance Tracker',   icon: 'fingerprint',       disabled: true },
        { label: 'Holiday Calendar',     icon: 'calendar_month',    disabled: true },
      ]
    },
    {
      groupLabel: 'Performance',
      items: [
        { label: 'Performance Reviews',  icon: 'stars',             disabled: true },
        { label: 'Goal Setting',         icon: 'flag',              disabled: true },
      ]
    },
    {
      groupLabel: 'Learning & Dev',
      items: [
        { label: 'Training Programs',    icon: 'school',            disabled: true },
        { label: 'Certifications',       icon: 'workspace_premium', disabled: true },
      ]
    },
  ];

  constructor(public authService: AuthService, public apiLoading: ApiLoadingService, private router: Router) {}

  ngOnInit() {
    this.checkBreakpoint();
    if (!this.authService.isLoggedIn()) this.router.navigate(['/login']);
    else if (this.router.url === '/' || this.router.url === '') this.router.navigate([this.authService.getDefaultRoute()]);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => { this.updateBreadcrumb(); if (this.isMobile) this.mobileOpen = false; });
    this.updateBreadcrumb();
  }

  ngOnDestroy() {}

  @HostListener('window:resize')
  onResize() { this.checkBreakpoint(); }

  private checkBreakpoint() {
    const w = window.innerWidth;
    this.isMobile  = w < 768;
    this.isTablet  = w >= 768 && w < 1024;
    if (this.isMobile) { this.sidebarCollapsed = false; }
    if (this.isTablet)  { this.sidebarCollapsed = true; }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.mobileOpen = !this.mobileOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeMobileMenu() { this.mobileOpen = false; }

  logout() {
    this.authService.logout();
    this.mobileOpen = false;
    this.router.navigate(['/login']);
  }

  get userInitials(): string {
    return (this.authService.getUsername() || 'U').substring(0, 2).toUpperCase();
  }

  get username(): string {
    return this.authService.getUsername() || 'User';
  }

  get roleLabel(): string {
    const role = this.authService.getRole() || '';
    if (role === 'admin') return 'Administrator';
    if (role === 'candidate_assessment') return 'Candidate Assessment Panel';
    return 'User';
  }

  isNavItemVisible(item: NavItem): boolean {
    if (item.disabled) return true;
    if (!item.permission) return true;
    return this.authService.hasPermission(item.permission);
  }

  /** CSS classes on the sidebar */
  get sidebarClasses(): Record<string, boolean> {
    return {
      'icon-only':    !this.isMobile && this.sidebarCollapsed,
      'mobile-hidden': this.isMobile && !this.mobileOpen,
      'mobile-open':   this.isMobile && this.mobileOpen,
    };
  }

  /** CSS classes on main wrapper */
  get mainWrapperClasses(): Record<string, boolean> {
    return {
      'icon-only':   !this.isMobile && this.sidebarCollapsed,
      'no-sidebar':   this.isMobile,
    };
  }

  get toggleIcon(): string {
    if (this.isMobile)           return this.mobileOpen ? 'close' : 'menu';
    return this.sidebarCollapsed ? 'menu'                : 'menu_open';
  }

  private updateBreadcrumb() {
    const url = this.router.url;
    if (url.includes('/resume'))          { this.currentPageTitle = 'Resume Builder';         this.currentSection = 'Talent Acquisition'; }
    else if (url.includes('/assessment')) { this.currentPageTitle = 'Candidate Assessment';   this.currentSection = 'Talent Acquisition'; }
    else if (url.includes('/reports'))    { this.currentPageTitle = 'Assessment Reports';     this.currentSection = 'Talent Acquisition'; }
  }
}
