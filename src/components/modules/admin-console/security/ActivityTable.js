import React from 'react';
import { ACTIVITY_DATA } from '@/utils/constants/securityConstants';
import SecurityActionButton from './SecurityActionButton';

const ActivityTable = () => {
    return (
        <section className="flex flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700">
            {/* Table Header */}
            <header className="flex items-center h-10 py-[13px] px-3 self-stretch border-b border-stroke-300 bg-stroke-50 dark:bg-neutral-800 dark:border-neutral-700">
                <div className="flex flex-1 items-center gap-3">
                    <div className="w-[240px] px-3">
                        <span className="text-regular-14 dark:text-regular-14-neutral-300">Date</span>
                    </div>
                    <div className="flex-1 px-3">
                        <span className="text-regular-14 dark:text-regular-14-neutral-300">Activity</span>
                    </div>
                    <div className="w-[260px] px-3">
                        <span className="text-regular-14 dark:text-regular-14-neutral-300">Person</span>
                    </div>
                    <div className="w-[52px] px-3 flex justify-center">
                        <span className="text-regular-14 dark:text-regular-14-neutral-300">Action</span>
                    </div>
                </div>
            </header>

            {/* Table Body */}
            <div className="w-full">
                {ACTIVITY_DATA.map((activity) => (
                    <article 
                        key={activity.id}
                        className="flex items-center gap-3 px-3 py-2 self-stretch border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-custom hover:-translate-y-0.5 cursor-pointer group last:border-b-0"
                    >
                        <div className="flex flex-1 items-center gap-3">
                            {/* Date Column */}
                            <div className="w-[240px] px-3">
                                <div className="flex flex-col justify-center items-start gap-0.5">
                                    <time className="text-regular-14 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{activity.date}</time>
                                    <div className="flex items-start gap-1">
                                        <address className="text-regular-12 not-italic group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{activity.location}</address>
                                        <span className="text-regular-12 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">•</span>
                                        <time className="text-regular-12 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{activity.time}</time>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Column */}
                            <div className="flex-1 px-3">
                                <div className="flex flex-col justify-center items-start gap-0.5">
                                    <p className="text-regular-14 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{activity.activity}</p>
                                    <p className="text-regular-12 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{activity.category}</p>
                                </div>
                            </div>

                            {/* Person Column */}
                            <div className="w-[260px] px-3">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={activity.person.avatar}
                                        alt={activity.person.name}
                                        className="h-6 w-6 flex-shrink-0 rounded-lg group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <span className="text-regular-14 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300 cursor-pointer">
                                        {activity.person.name}
                                    </span>
                                </div>
                            </div>

                            {/* Action Column */}
                            <div className="w-[52px] px-3 flex justify-center">
                                <SecurityActionButton />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ActivityTable;