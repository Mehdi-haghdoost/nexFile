import React from 'react';
import { ACTIVITY_DATA } from '@/utils/constants/securityConstants';
import SecurityActionButton from './SecurityActionButton';

const ActivityTable = () => {
    return (
        <section className="flex flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden w-full">
            {/* Table Header - Hidden on mobile */}
            <header className="hidden md:flex items-center min-h-[40px] py-3 px-3 self-stretch border-b border-stroke-300 bg-stroke-50 dark:bg-neutral-800 dark:border-neutral-700">
                <div className="flex flex-1 items-center gap-2 lg:gap-3 min-w-0">
                    <div className="w-[180px] lg:w-[200px] xl:w-[240px] px-2 lg:px-3 flex-shrink-0">
                        <span className="text-sm text-neutral-300 dark:text-neutral-300">Date</span>
                    </div>
                    <div className="flex-1 px-2 lg:px-3 min-w-0">
                        <span className="text-sm text-neutral-300 dark:text-neutral-300">Activity</span>
                    </div>
                    <div className="w-[160px] lg:w-[200px] xl:w-[260px] px-2 lg:px-3 flex-shrink-0">
                        <span className="text-sm text-neutral-300 dark:text-neutral-300">Person</span>
                    </div>
                    <div className="w-[52px] px-2 lg:px-3 flex justify-center flex-shrink-0">
                        <span className="text-sm text-neutral-300 dark:text-neutral-300">Action</span>
                    </div>
                </div>
            </header>

            {/* Table Body */}
            <div className="w-full">
                {ACTIVITY_DATA.map((activity) => (
                    <React.Fragment key={activity.id}>
                        {/* Desktop View */}
                        <article 
                            className="hidden md:flex items-center gap-2 lg:gap-3 px-3 py-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group last:border-b-0"
                        >
                            <div className="flex flex-1 items-center gap-2 lg:gap-3 min-w-0">
                                {/* Date Column */}
                                <div className="w-[180px] lg:w-[200px] xl:w-[240px] px-2 lg:px-3 flex-shrink-0">
                                    <div className="flex flex-col justify-center items-start gap-0.5">
                                        <time className="text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{activity.date}</time>
                                        <div className="flex items-start gap-1 flex-wrap">
                                            <address className="text-xs text-neutral-300 dark:text-neutral-300 not-italic group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{activity.location}</address>
                                            <span className="text-xs text-neutral-300 dark:text-neutral-300 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">•</span>
                                            <time className="text-xs text-neutral-300 dark:text-neutral-300 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{activity.time}</time>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Column */}
                                <div className="flex-1 px-2 lg:px-3 min-w-0">
                                    <div className="flex flex-col justify-center items-start gap-0.5">
                                        <p className="text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate w-full">{activity.activity}</p>
                                        <p className="text-xs text-neutral-300 dark:text-neutral-300 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors truncate w-full">{activity.category}</p>
                                    </div>
                                </div>

                                {/* Person Column */}
                                <div className="w-[160px] lg:w-[200px] xl:w-[260px] px-2 lg:px-3 flex-shrink-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <img
                                            src={activity.person.avatar}
                                            alt={activity.person.name}
                                            className="h-6 w-6 flex-shrink-0 rounded-lg group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <span className="text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors cursor-pointer truncate">
                                            {activity.person.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Column */}
                                <div className="w-[52px] px-2 lg:px-3 flex justify-center flex-shrink-0">
                                    <SecurityActionButton />
                                </div>
                            </div>
                        </article>

                        {/* Mobile Card View */}
                        <article className="flex md:hidden flex-col gap-3 p-3 border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <div className="flex items-start justify-between gap-2 w-full">
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-neutral-500 dark:text-white truncate">{activity.activity}</p>
                                    <p className="text-xs text-neutral-300 dark:text-neutral-300">{activity.category}</p>
                                </div>
                                <SecurityActionButton />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={activity.person.avatar}
                                        alt={activity.person.name}
                                        className="h-5 w-5 rounded-lg flex-shrink-0"
                                    />
                                    <span className="text-xs text-neutral-400 dark:text-neutral-300">{activity.person.name}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 dark:text-neutral-300">
                                    <time>{activity.date}</time>
                                    <span>•</span>
                                    <address className="not-italic">{activity.location}</address>
                                    <span>•</span>
                                    <time>{activity.time}</time>
                                </div>
                            </div>
                        </article>
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default ActivityTable;