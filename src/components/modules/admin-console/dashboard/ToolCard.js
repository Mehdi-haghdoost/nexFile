import React from 'react';

const ToolCard = ({ icon: Icon, title, description, onClick }) => {
    return (
        <article 
            className='flex flex-col items-start gap-5 p-3 rounded-lg border border-stroke-500 bg-white hover:border-stroke-400 transition-colors cursor-pointer'
            onClick={onClick}
        >
            {/* Tool Icon */}
            <div className='flex justify-center items-center gap-2 p-1 h-6 w-6 aspect-square rounded bg-gradient-to-b from-[#CDCDD1] to-[#9B9B9E] shadow-[0_-1px_1px_0_rgba(0,0,0,0.08)_inset,0_1px_1px_0_rgba(255,255,255,0.40)_inset]'>
                <Icon />
            </div>
            
            {/* Tool Details */}
            <div className='flex flex-col items-start gap-1'>
                <h4 className='text-medium-14'>{title}</h4>
                <p className='text-regular-12 text-neutral-400'>{description}</p>
            </div>
        </article>
    );
};

export default ToolCard;