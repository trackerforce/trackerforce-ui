import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tenant: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.params.subscribe(params => this.tenant = params.tenant || this.authService.getUserInfo('tenant'));
  }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    const sideBar = document.getElementById('sidebar') || undefined;
    const content = document.getElementById('content') || undefined;

    if (sideBar == undefined || content == undefined)
      return;

    if (sideBar.className == 'active') {
      sideBar.className = "";
      content.className = "";
    } else {
      window.scrollTo(0, 0);
      sideBar.className = "active";
      content.className = "hide";
    }
  }

}
