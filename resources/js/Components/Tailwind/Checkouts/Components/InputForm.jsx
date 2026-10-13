import React from 'react';

const InputForm = ({
    error,
    label,
    className = '',
    labelClass = '',
    required = false,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className={`block text-sm 2xl:text-base mb-1 customtext-neutral-dark ${labelClass}`}>
                    {label} 
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300 ${className} ${error && 'border-red-500'}	`}
                {...props}
            />
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default InputForm;
