'use client';

import React from 'react';
import { PiTimer } from 'react-icons/pi';
import { Typography } from '../../atoms/Typography';
import AboutPropertyModal from '@/components/modalsAndSheets/AboutPropertyModal';
import { useTranslation } from '@/hooks/useTranslation';
import { CancellationCompProps } from './CancellationComp.type';
import { formateDatePretty } from '@/utils/helpers';
import { CancellationRule } from '@/hooks/queries/useBookingQuote';

/**
 * CancellationComp — Organism
 *
 * Displays the free-cancellation banner + "Read Policy" trigger.
 *
 * - variant="row"    → horizontal layout (hidden on mobile, shown on md+)
 *                      Used below the Reserve Now button inside ReserveCard.
 * - variant="column" → stacked/vertical layout (shown on mobile, hidden on md+)
 *                      Used above the price breakdown inside ReserveCard.
 */
const CancellationComp: React.FC<CancellationCompProps> = ({
    cancellationPolicy,
    variant = 'row',
    className = '',
}) => {
    const { t } = useTranslation();

    if (!cancellationPolicy) return null;

    const nonRefundableRule = !cancellationPolicy.free_cancellation_until
        ? cancellationPolicy.rules?.find((r) => r.refund_percentage > 0) ??
          cancellationPolicy.rules?.find((r) => r.refund_percentage === 0)
        : null;

    const label = nonRefundableRule
        ? `${nonRefundableRule.label} - ${nonRefundableRule.description}`
        : `${t('freeCancelationUntill')} ${formateDatePretty(cancellationPolicy.free_cancellation_until!)}`;

    /* ── Row variant (desktop inline) ──────────────────────────── */
    if (variant === 'row') {
        return (
            <div className={`hidden md:flexCenter gap-1 ${className} flex-wrap justify-start!`}>
                <PiTimer />
                <Typography
                    variant="caption"
                    className="textSecondaryColor text-sm!"
                    children={label}
                />
                <AboutPropertyModal 
                    content=""
                    cancelationPolicy={true}
                    cancellationRules={cancellationPolicy.rules}
                    cancellationCutoffTime={cancellationPolicy.cancellation_cutoff_time}
                />
            </div>
        );
    }

    /* ── Column variant (mobile stacked) ────────────────────────── */
    return (
        <div className={`flex flex-col md:hidden gap-2 ${className}`}>
            <Typography
                variant="h6"
                className="text-base!"
                weight="medium"
                children={t('cancellationPolicy')}
            />
            <div className="flex items-center gap-2">
                <PiTimer />
                <Typography
                    variant="caption"
                    className="textSecondaryColor! text-sm!"
                    children={label}
                />
            </div>
            <AboutPropertyModal
                content=""
                cancelationPolicy={true}
                cancellationRules={cancellationPolicy.rules}
                cancellationCutoffTime={cancellationPolicy.cancellation_cutoff_time}
            />
        </div>
    );
};

export default CancellationComp;
