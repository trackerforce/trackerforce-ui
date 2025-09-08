import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { GlobalCreateComponent } from '../global-create/global-create.component';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { GlobalListComponent } from '../global-list/global-list.component';

@Component({
    selector: 'app-globals',
    templateUrl: './globals.component.html',
    styleUrls: ['./globals.component.scss'],
    imports: [MatDivider, GlobalCreateComponent, GlobalSearchComponent, GlobalListComponent]
})
export class GlobalsComponent {
}
