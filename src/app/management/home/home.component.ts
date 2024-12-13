import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements AfterViewInit {

  tenant: string | undefined;
  currentView: string = 'home'

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
    this.route.params.subscribe(params => this.tenant = params.tenant || this.authService.getUserInfo('tenant'));
  }

  ngAfterViewInit(): void {
    this.route.url.subscribe(() =>  this.setMenuSelection(this.route.snapshot?.firstChild?.data.view));
  }

  private setMenuSelection(selectionMenu?: string) {
    document.getElementById(this.currentView)?.classList.remove('selected-view');

    if (selectionMenu) {
      document.getElementById(selectionMenu)?.classList.add('selected-view');
      this.currentView = selectionMenu;
    }
  }

  toggleMenu(selection?: HTMLElement): void {
    const sideBar = document.getElementById('sidebar') || undefined;
    const content = document.getElementById('content') || undefined;

    if (selection)
      this.setMenuSelection(selection.id);

    if (sideBar == undefined || content == undefined)
      return;

    if (sideBar.className == 'active') {
      sideBar.className = '';
      content.className = '';
    } else {
      window.scrollTo(0, 0);
      sideBar.className = 'active';
      content.className = 'hide';
    }
  }

  isAgent() {
    return this.authService.hasRole('AGENT');
  }

}
