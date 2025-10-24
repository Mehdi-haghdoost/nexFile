import React from 'react';
import { ACTIVITY_DATA } from '@/utils/constants/securityConstants';

const ActivityTable = () => {
    const ActionMenuButton = () => (
        <button
            className="flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-stroke-200 bg-white rounded cursor-pointer hover:bg-gray-50 hover:shadow-middle transition-all duration-200 active:scale-95"
            aria-label="Activity actions menu"
            title="More actions"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="4"
                height="12"
                viewBox="0 0 4 12"
                fill="none"
                aria-hidden="true"
            >
                <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
            </svg>
        </button>
    );

    return (
        <section className="flex flex-col items-start self-stretch rounded-lg border border-stroke-200">
            {/* Table Header */}
            <header className="flex items-center h-10 py-[13px] px-3 self-stretch border-b border-stroke-300 bg-stroke-50">
                <div className="flex flex-1 items-center gap-3">
                    <div className="w-[240px] px-3">
                        <span className="text-regular-14">Date</span>
                    </div>
                    <div className="flex-1 px-3">
                        <span className="text-regular-14">Activity</span>
                    </div>
                    <div className="w-[260px] px-3">
                        <span className="text-regular-14">Person</span>
                    </div>
                    <div className="w-[52px] px-3 flex justify-center">
                        <span className="text-regular-14">Action</span>
                    </div>
                </div>
            </header>

            {/* Table Body */}
            <div className="w-full">
                {ACTIVITY_DATA.map((activity) => (
                    <article 
                        key={activity.id}
                        className="flex items-center h-[60px] py-[13px] px-3 self-stretch border-b border-stroke-100 last:border-b-0 hover:bg-stroke-50 transition-colors duration-200"
                    >
                        <div className="flex flex-1 items-center gap-3">
                            {/* Date Column */}
                            <div className="w-[240px] px-3">
                                <div className="flex flex-col justify-center items-start gap-0.5">
                                    <time className="text-medium-14">{activity.date}</time>
                                    <div className="flex items-start gap-1">
                                        <address className="text-regular-12 not-italic">{activity.location}</address>
                                        <span className="text-regular-12">•</span>
                                        <time className="text-regular-12">{activity.time}</time>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Column */}
                            <div className="flex-1 px-3">
                                <div className="flex flex-col justify-center items-start gap-0.5">
                                    <p className="text-medium-14">{activity.activity}</p>
                                    <p className="text-regular-12">{activity.category}</p>
                                </div>
                            </div>

                            {/* Person Column */}
                            <div className="w-[260px] px-3">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={activity.person.avatar}
                                        alt={activity.person.name}
                                        className="h-6 w-6 flex-shrink-0 rounded-lg hover:scale-110 transition-transform duration-200"
                                    />
                                    <span className="text-medium-14 hover:text-primary-500 transition-colors duration-200 cursor-pointer">
                                        {activity.person.name}
                                    </span>
                                </div>
                            </div>

                            {/* Action Column */}
                            <div className="w-[52px] px-3 flex justify-center">
                                <ActionMenuButton />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ActivityTable;