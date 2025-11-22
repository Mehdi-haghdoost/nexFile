import React from 'react';
import { ChevronRightIcon } from '@/components/ui/icons';
import * as Icons from '@/components/ui/icons';

const SettingsItem = ({ item }) => {
    const { title, description, icon } = item;
    const IconComponent = Icons[icon];

    return (
        <button className="group relative flex items-center gap-4 self-stretch w-full bg-white dark:bg-neutral-800 transition-all duration-500 rounded-2xl p-5 border border-stroke-200 dark:border-neutral-700 hover:bg-primary-500/2 dark:hover:bg-primary-500/5 hover:border-primary-500/20 dark:hover:border-primary-500/30 hover:shadow-light dark:hover:shadow-dark-panel overflow-hidden">
            {/* Very Subtle Background Glow */}
            <div className="absolute inset-0 bg-primary-500/1 dark:bg-primary-500/2 rounded-2xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"></div>
            
            {IconComponent && (
                <div className="relative z-10 p-2 rounded-lg bg-stroke-50 dark:bg-neutral-700 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-light dark:group-hover:shadow-dark-panel">
                    <IconComponent />
                </div>
            )}
            
            <div className="flex flex-1 flex-col justify-center items-start gap-2 text-left relative z-10">
                <h3 className="text-medium-14 text-neutral-500 dark:text-regular-14-neutral-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-500">
                    {title}
                </h3>
                <p className="text-regular-12-neutral-200 dark:text-regular-12-neutral-400 group-hover:text-neutral-400 dark:group-hover:text-neutral-300 transition-colors duration-300">
                    {description}
                </p>
            </div>
            
            <ChevronRightIcon className="relative z-10 flex-shrink-0 text-neutral-300 dark:text-neutral-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-125" />
        </button>
    );
};

export default SettingsItem;