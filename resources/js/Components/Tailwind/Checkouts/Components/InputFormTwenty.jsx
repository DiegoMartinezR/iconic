import React from "react";

const InputFormTwenty = ({
    error,
    label,
    className = "",
    labelClass = "",
    required = false,
    ...props
}) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className={`block text-[11px] font-bold uppercase text-white/55 ${labelClass}`}>
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <input
                className={`w-full px-5 py-3 bg-white/10 border outline-none border-white/15 rounded-2xl text-white text-sm placeholder:text-white/35 focus:border-white/40 focus:bg-white/15 focus:ring-0 focus:outline-none transition-all duration-300 ${className} ${error ? "border-red-500" : ""}`}
                {...props}
            />
            {error && <div className="text-red-400 text-[11px] mt-1">{error}</div>}
        </div>
    );
};

export default InputFormTwenty;
