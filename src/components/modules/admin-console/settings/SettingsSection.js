import React from 'react';
import SettingsItem from './SettingsItem';
import { VectorIcon } from '@/components/ui/icons';

const SettingsSection = ({ section }) => {
    const { title, items } = section;

    return (
        <section className="flex flex-col items-start gap-4 self-stretch">
            <h2 className="text-medium-18 dark:text-medium-18-white">{title}</h2>
            
            <div className="flex flex-col justify-center items-center gap-4 p-4 self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 dark:bg-neutral-800/30">
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