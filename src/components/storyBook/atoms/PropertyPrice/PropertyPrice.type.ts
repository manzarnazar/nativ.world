export interface PropertyPriceProps {
    /** Price per night */
    price: number;
    /** Currency symbol */
    currency?: string;
    /** i18n label for "Starting from" */
    startingFromLabel?: string;
    /** i18n label for "Night" */
    nightLabel?: string;
    /** Additional CSS classes */
    className?: string;
    searchCard?: boolean
    showTaxLabel?: boolean,
    taxesAmt?: number,
    detailPage?: boolean
    fixedBottom?: boolean
    roomsCard?: boolean
}
