import React from 'react';
import { PiStarFill } from 'react-icons/pi';
import { RatingsProps } from './Ratings.type';
import { Typography } from '../Typography';

const Ratings: React.FC<RatingsProps> = ({ value, col = false, className = '' }) => {
    return (
        <div
            className={`bg-[#FEF5E6]  rounded-lg inline-flex ${col ? 'flex-col items-center gap-1 p-3 w-14' : 'py-1 px-2 flex-row items-center gap-2'} ${className}`}
        >
            <PiStarFill className="text-[#DB9305] text-lg" />
            <Typography variant='caption' children={value} weight='medium' className='text-black!'/>
        </div>
    );
};

export default Ratings;
