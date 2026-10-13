import React from 'react';
import { PropertyInfoProps } from './PropertyInfo.type';

const PropertyInfo: React.FC<PropertyInfoProps> = ({ name, location, className = '' }) => {
    return (
        <div className={`${className} space-y-2`}>
            <h3 className="text-base font-medium line-clamp-2 leading-tight first-letter:capitalize">{name}</h3>
            <p className="text-sm textSecondaryColor first-letter:capitalize line-clamp-1">{location}</p>
        </div>
    );
};

export default PropertyInfo;
