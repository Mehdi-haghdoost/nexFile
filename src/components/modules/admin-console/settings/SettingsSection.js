import React from 'react';
import SettingsItem from './SettingsItem';

const SettingsSection = ({ section }) => {
    const { title, items } = section;

    return (
        <section className="flex flex-col items-start gap-3 sm:gap-4 self-stretch w-full">
            <h2 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">{title}</h2>
            
            <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 p-3 sm:p-4 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 dark:bg-neutral-800/30 w-full">
                {items.map((item, index) => (
                    <article key={item.id} className="w-full">
                        <SettingsItem item={item} />
                    </article>
                ))}
            </div>
        </section>
    );
};

export default SettingsSection;