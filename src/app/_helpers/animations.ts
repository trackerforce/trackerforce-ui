import { trigger, sequence, animate, transition, style, state } from '@angular/animations';

export const rowsAnimation =
    trigger('rowsAnimation', [
        transition('void => *', [
            style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
            sequence([
                animate(".35s ease", style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none' })),
                animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
            ])
        ])
    ]);

export const detailsAnimation =
    trigger('detailExpand', [
        state('collapsed', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]);