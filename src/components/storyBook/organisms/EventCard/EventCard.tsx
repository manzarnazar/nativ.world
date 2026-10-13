'use client';
import React from 'react';
import { PiCheckCircleFill } from 'react-icons/pi';
import ImagePreview from '../../atoms/ImagePreview';
import { Typography } from '../../atoms/Typography';
import { EventCardProps } from './EventCard.type';
import IconLabel from '../../atoms/IconLabel';
import EventFormModal from '@/components/modalsAndSheets/EventFormModal';

const EventCard: React.FC<EventCardProps> = ({
    event,
    className = '',
}) => {

    return (
        <>
            <div className={`hidden md:block relative w-full rounded-2xl overflow-hidden h-[500px] lg:h-[535px] ${className}`}>
                {/* Full-bleed background image */}
                <ImagePreview
                    src={event.image}
                    alt={event.title}
                    objectFit="cover"
                    containerClassName="absolute inset-0 w-full h-full"
                />

                {/* Content card — left overlay */}
                <div className="absolute inset-0 z-10 flex items-stretch h-full">
                    <div className="bg-white rounded-2xl sm:m-8 lg:m-12 p-5 sm:p-6 flex flex-col justify-between w-full max-w-[300px] sm:max-w-[320px] md:max-w-[343px] shadow-lg">

                        {/* Title + Description */}
                        <div className="space-y-3">
                            <Typography variant="h3" weight="semibold" className='first-letter:capitalize'>
                                {event.title}
                            </Typography>
                            <Typography variant="desc1" className='first-letter:capitalize'>
                                {event.description}
                            </Typography>
                        </div>

                        {/* Feature list */}
                        {event.features && event.features.length > 0 && (
                            <ul className="space-y-4">
                                {event.features.map((feature, i) => (
                                    <li key={i}>
                                        <IconLabel icon={<PiCheckCircleFill className='primaryColor text-xl' />} label={feature} className='text-sm' />
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* CTA */}
                        <EventFormModal eventId={event.id} />
                    </div>
                </div>
            </div>
            {/* Mobile / Tablet layout — md:hidden */}
            <div className={`md:hidden flex flex-col rounded-2xl border overflow-hidden bg-white p-3 gap-y-4 ${className} h-full`}>

                {/* Image */}
                <div className='max-399:h-[120px] h-[160px] w-full overflow-hidden rounded-lg'>
                    <ImagePreview
                        src={event.image}
                        alt={event.title}
                        objectFit='cover'
                    />
                </div>

                {/* Content */}
                <div className='flex flex-col gap-2 justify-between h-full'>
                    <div className='flex flex-col gap-2'>

                        {/* Title */}
                        <Typography variant='h3' weight='semibold' className='first-letter:capitalize'>
                            {event.title}
                        </Typography>

                        {/* Description */}
                        <Typography variant='desc1' className='text-sm leading-relaxed first-letter:capitalize'>
                            {event.description}
                        </Typography>

                        {/* Feature list */}
                        {event.features && event.features.length > 0 && (
                            <ul className='space-y-4 my-4'>
                                {event.features.map((feature, i) => (
                                    <li key={i}>
                                        <IconLabel
                                            icon={<PiCheckCircleFill className='primaryColor text-xl shrink-0' />}
                                            label={feature}
                                            className='text-sm'
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* CTA */}
                    <EventFormModal eventId={event.id} />

                </div>
            </div>
        </>
    );
};

export default EventCard;
