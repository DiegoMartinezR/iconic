import React from 'react';

const ButtonSecondary = ({ children, className = '', ...props }) => {
    return (
        <a

            className={`w-full block border-primary cursor-pointer border-2 text-center font-bold customtext-primary py-3 px-4  hover:opacity-90 hover:shadow-md transition-all duration-300 focus:outline-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl ${className}`}
            {...props}
        >
            {children}
        </a>
    );
};

export default ButtonSecondary;
