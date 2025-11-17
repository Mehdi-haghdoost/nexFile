import React from 'react';

const ToolCard = ({ icon: Icon, title, description, onClick }) => {
    return (
        <article 
            className='
                flex flex-col items-start gap-5 p-3 rounded-xl 
                border border-stroke-500 bg-white 
                dark:bg-neutral-800 dark:border-neutral-700
                transition-all duration-300 ease-out
                hover:scale-[1.02] hover:shadow-middle
                active:scale-[0.98]
                cursor-pointer h-full min-h-[120px]
                group relative overflow-hidden
            '
            onClick={onClick}
        >
            {/* Gradient overlay on hover */}
            <div className='
                absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-300
                rounded-xl
            ' />
            
            {/* Tool Icon */}
            <div className='
                flex justify-center items-center gap-2 p-1 h-6 w-6 aspect-square rounded 
                bg-gradient-to-b from-[#CDCDD1] to-[#9B9B9E] 
                shadow-[0_-1px_1px_0_rgba(0,0,0,0.08)_inset,0_1px_1px_0_rgba(255,255,255,0.40)_inset] 
                flex-shrink-0 dark:bg-dark-neutral-gradient 
                transition-all duration-300 ease-out
                group-hover:scale-110 group-hover:shadow-custom
                relative z-10
            '>
                <Icon />
            </div>
            
            {/* Tool Details */}
            <div className='flex flex-col items-start gap-1 flex-1 relative z-10'>
                <h4 className='
                    text-medium-14 line-clamp-2 
                    dark:text-medium-14-white
                    transition-colors duration-300
                    dark:group-hover:text-primary-400
                '>
                    {title}
                </h4>
                <p className='
                    text-regular-12 text-neutral-400 line-clamp-2 
                    dark:text-regular-12-neutral-300
                    transition-colors duration-300
                    group-hover:text-neutral-500
                    dark:group-hover:text-neutral-200
                '>
                    {description}
                </p>
            </div>
        </article>
    );
};

export default ToolCard;