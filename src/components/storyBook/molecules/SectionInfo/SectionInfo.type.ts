import { BadgeProps } from '../../atoms/Badge/Badge.type';
import { TypographyProps } from '../../atoms/Typography/Typography.type';

export interface SectionInfoProps {
    /** Badge label text */
    badge?: string;
    /** Badge variant */
    badgeVariant?: BadgeProps['variant'];
    /** Badge size */
    badgeSize?: BadgeProps['size'];
    /** Badge rounded */
    badgeRounded?: BadgeProps['rounded'];
    /** Optional icon before badge label */
    badgeIconLeft?: React.ReactNode;
    /** Optional icon after badge label */
    badgeIconRight?: React.ReactNode;

    /** Heading text */
    title: string;
    /** Heading variant */
    titleVariant?: Extract<TypographyProps['variant'], 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
    /** Heading weight */
    titleWeight?: TypographyProps['weight'];

    /** Description text */
    desc?: string;
    /** Description variant */
    descVariant?: TypographyProps['variant'];

    /** Centers and constrains the content horizontally */
    isCenter?: boolean;

    /** Additional classes for the wrapper */
    className?: string;
    isTextWhite?: boolean;
    showInRichText?: boolean;
    blogsDetailsPage?: boolean;
}
