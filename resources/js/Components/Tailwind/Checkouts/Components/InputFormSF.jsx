import React from 'react';

const InputFormSF = ({
    label,
    className = '',
    labelClass = '',
    ...props
}) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className={`block text-sm 2xl:text-base customtext-neutral-dark tracking-tight opacity-65 ${labelClass}`}>
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 border text-base 2xl:text-lg customtext-neutral-dark placeholder:customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0 transition-all duration-300 ${className}`}
                {...props}
            />
        </div>
    );
};

export default InputFormSF;
