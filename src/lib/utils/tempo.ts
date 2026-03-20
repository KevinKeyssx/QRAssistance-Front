import { format } from "@formkit/tempo";

export function formatDate( date: string | Date, time: boolean = false ): string {
    return format( date, `dddd D, MMMM YYYY ${time ? 'h:mm a' : ''}`, 'es-MX' );
}
