'use client';
import React from 'react';
import { format } from 'date-fns';

const DEFAULT_AVATAR = '/images/nav_img.png';

const ActivityTable = ({ activities, isLoading, error }) => {
    return (
        <section className="flex flex-col items-start self-stretch rounded-lg border border-stroke-200 dark:border-neutral-700 overflow-hidden w-full">
            {/* Table header (desktop only) */}
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
                </div>
            </header>

            {/* Table body */}
            <div className="w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full py-16">
                        <div className="w-6 h-6 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center w-full py-16 gap-1 text-center px-4">
                        <p className="text-sm text-red-500">Failed to load activity</p>
                        <p className="text-xs text-neutral-400">{error}</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full py-16 gap-1 px-4 text-center">
                        <p className="text-sm text-neutral-400 dark:text-neutral-300">No activity recorded yet</p>
                        <p className="text-xs text-neutral-300 dark:text-neutral-400">
                            Actions like inviting members or creating groups will appear here
                        </p>
                    </div>
                ) : (
                    activities.map((activity) => {
                        const created = activity.createdAt ? new Date(activity.createdAt) : null;
                        const dateLabel = created ? format(created, 'dd/MM/yyyy') : '';
                        const timeLabel = created ? format(created, 'h:mm a') : '';

                        return (
                            <React.Fragment key={activity.id}>
                                {/* Desktop row */}
                                <article className="hidden md:flex items-center gap-2 lg:gap-3 px-3 py-3 self-stretch border-b border-stroke-300 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group last:border-b-0">
                                    <div className="flex flex-1 items-center gap-2 lg:gap-3 min-w-0">
                                        {/* Date */}
                                        <div className="w-[180px] lg:w-[200px] xl:w-[240px] px-2 lg:px-3 flex-shrink-0">
                                            <div className="flex flex-col justify-center items-start gap-0.5">
                                                <time className="text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{dateLabel}</time>
                                                <div className="flex items-start gap-1 flex-wrap">
                                                    <address className="text-xs text-neutral-300 dark:text-neutral-300 not-italic">{activity.location}</address>
                                                    <span className="text-xs text-neutral-300 dark:text-neutral-300">•</span>
                                                    <time className="text-xs text-neutral-300 dark:text-neutral-300">{timeLabel}</time>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity */}
                                        <div className="flex-1 px-2 lg:px-3 min-w-0">
                                            <div className="flex flex-col justify-center items-start gap-0.5">
                                                <p className="text-sm text-neutral-300 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate w-full">{activity.activity}</p>
                                                <p className="text-xs text-neutral-300 dark:text-neutral-300 truncate w-full">{activity.category}</p>
                                            </div>
                                        </div>

                                        {/* Person */}
                                        <div className="w-[160px] lg:w-[200px] xl:w-[260px] px-2 lg:px-3 flex-shrink-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <img
                                                    src={activity.person.avatar || DEFAULT_AVATAR}
                                                    alt={activity.person.name}
                                                    className="h-6 w-6 flex-shrink-0 rounded-lg"
                                                />
                                                <span className="text-sm text-neutral-300 dark:text-neutral-300 truncate">
                                                    {activity.person.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>

                                {/* Mobile card */}
                                <article className="flex md:hidden flex-col gap-3 p-3 border-b border-stroke-300 dark:border-neutral-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <p className="text-sm font-medium text-neutral-500 dark:text-white">{activity.activity}</p>
                                        <p className="text-xs text-neutral-300 dark:text-neutral-300">{activity.category}</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={activity.person.avatar || DEFAULT_AVATAR}
                                                alt={activity.person.name}
                                                className="h-5 w-5 rounded-lg flex-shrink-0"
                                            />
                                            <span className="text-xs text-neutral-400 dark:text-neutral-300">{activity.person.name}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 dark:text-neutral-300">
                                            <time>{dateLabel}</time>
                                            <span>•</span>
                                            <address className="not-italic">{activity.location}</address>
                                            <span>•</span>
                                            <time>{timeLabel}</time>
                                        </div>
                                    </div>
                                </article>
                            </React.Fragment>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default ActivityTable;