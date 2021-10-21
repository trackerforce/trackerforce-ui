import { trigger, animate, transition, style, state } from '@angular/animations';

export const fadeAnimation =
    trigger('fadeAnimation', [
        state('in', style({ opacity: 1 })),
        transition(':enter', [style({ opacity: 0 }), animate(400)]),
        transition(':leave', animate(400, style({ opacity: 0 })))
    ]);

export const detailsAnimation =
    trigger('detailExpand', [
        state('collapsed', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]);