import React from 'react';
import ToolCard from '@/components/modules/admin-console/dashboard/ToolCard';

const ToolsSection = ({ tools, description }) => {
    return (
        <section className='flex flex-col gap-5 p-4 rounded-lg border border-stroke-300 w-full max-w-full'>
            {/* Tools Header */}
            <div className='flex flex-col gap-1'>
                <h3 className='text-medium-16'>Tools provided with your subscription</h3>
                {description && (
                    <p className='text-regular-12 text-neutral-400'>{description}</p>
                )}
            </div>

            {/* Tools Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full'>
                {tools.map((column, colIndex) => (
                    <div key={colIndex} className='flex flex-col gap-3'>
                        {column.map((tool, toolIndex) => (
                            <ToolCard
                                key={toolIndex}
                                icon={tool.icon}
                                title={tool.title}
                                description={tool.description}
                                onClick={tool.onClick}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ToolsSection;