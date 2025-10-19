import { ChevronDownIcon, DesignerIcon, SearchIcon, UsersPlusIcon } from "@/components/ui/icons";

const GroupsContent = () => (
    <div className='flex flex-1 flex-col items-start gap-6 py-6 px-8 self-stretch bg-white'>
        {/* Group Filter Container */}
        <div className="flex flex-1 flex-col items-start gap-5 self-stretch">
            {/* Group Filter */}
            <div className="flex justify-between items-center self-stretch">
                {/* New Task Button */}
                <div className="flex justify-between items-center py-1 px-3 h-8 w-[190px] rounded-lg border border-stroke-300 bg-white shadow-light">
                    {/* Group Filter Text */}
                    <div className="flex items-center gap-1">
                        <p className="text-regular-14">Group type:</p>
                        <h3 className="text-medium-14">All group</h3>
                    </div>
                    <ChevronDownIcon />
                </div>
                {/* Search and Button Container */}
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1.5 h-8  py-[13px] pr-4 pl-3 rounded-lg border border-stroke-200 bg-white shadow-light'>
                        <SearchIcon />
                        <input
                            className='flex-1 text-regular-12-manrope outline-0'
                            type="text" name="" id="" />
                    </div>
                    <button
                        className='flex justify-center items-center gap-1.5 py-[13px] px-3 h-8 rounded-lg border border-[#5749BF] shadow-heavy bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8] text-medium-14-white text-sm whitespace-nowrap hover:opacity-90 transition-opacity'
                    >
                        <UsersPlusIcon />
                        Create new group
                    </button>
                </div>
            </div>

            {/* Group List Container */}
            <div className='flex flex-1 flex-col items-start self-stretch rounded-lg border border-stroke-200'>
                {/* Group List Header */}
                <div className='flex items-center gap-2 h-[40px] py-[13px] px-4 self-stretch border-b border-stroke-300 bg-stroke-50'>
                    <div className='flex flex-1 items-center gap-3'>
                        {/* Group Name Header */}
                        <div className='flex flex-1 items-center gap-2 h-[22px] py-0 px-3'>
                            <h3 className='text-regular-14'>Group name</h3>
                        </div>
                        {/* Members Header*/}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <h3 className='text-regular-14'>Members</h3>
                        </div>
                        {/* Managers Header */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <h3 className='text-regular-14'>Managers</h3>
                        </div>
                        {/* Content Permissions Header */}
                        <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                            <h3 className='text-regular-14'>Content premissions</h3>
                        </div>
                        {/* Action Header */}
                        <div className='flex items-center justify-center self-stretch w-[52px] py-0 px-3'>
                            <h3 className='text-regular-14'>Action</h3>
                        </div>
                    </div>
                </div>
                {/* Group Item Container */}
                <div className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch'>
                    <div className='flex flex-1 items-center gap-2'>
                        {/* Group Name Container */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch '>
                            <div className="flex justify-center items-center gap-2 p-1 h-6 w-6 rounded bg-gradient-to-b from-[#F35154] to-[#C71D20] shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] aspect-square">
                                <DesignerIcon />
                            </div>
                            <h3 className='text-medium-14'>UI/UX Designer</h3>
                        </div>
                        {/* Role Container */}
                        <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>5 person</h3>
                        </div>
                        {/* Member Storage Usage */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <img
                                className='w-6 h-6 rounded-3xl'
                                src="/images/adrian.png" alt="adrian.png" />
                            <h3 className='text-medium-14'>Adrian Carter</h3>
                        </div>
                        {/* Content Permissions Container */}
                        <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>Manage acccess</h3>
                        </div>
                        {/* Action Container */}
                        <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
                            <button
                                className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
                {/* Group Item Container */}
                <div className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch'>
                    <div className='flex flex-1 items-center gap-2'>
                        {/* Group Name Container */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch '>
                            <div className="flex justify-center items-center gap-2 p-1 h-6 w-6 rounded bg-gradient-to-b from-[#ECD65C] to-[#CBB018] shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] aspect-square">
                                <DesignerIcon />
                            </div>
                            <h3 className='text-medium-14'>Team Illustration</h3>
                        </div>
                        {/* Role Container */}
                        <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>7 person</h3>
                        </div>
                        {/* Member Storage Usage */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <img
                                className='w-6 h-6 rounded-3xl'
                                src="/images/bella.png" alt="bella.png" />
                            <h3 className='text-medium-14'>Bella Thompson</h3>
                        </div>
                        {/* Content Permissions Container */}
                        <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>Manage acccess</h3>
                        </div>
                        {/* Action Container */}
                        <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
                            <button
                                className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
                {/* Group Item Container */}
                <div className='flex items-center gap-2 h-[52px] py-[13px] px-3 self-stretch'>
                    <div className='flex flex-1 items-center gap-2'>
                        {/* Group Name Container */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch '>
                            <div className="flex justify-center items-center gap-2 p-1 h-6 w-6 rounded bg-gradient-to-b from-[#5C9FEC] to-[#186BCB] shadow-[inset_0_-1px_1px_0_rgba(0,0,0,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.40)] aspect-square">
                                <DesignerIcon />
                            </div>
                            <h3 className='text-medium-14'>Project Manager</h3>
                        </div>
                        {/* Role Container */}
                        <div className='flex flex-1 items-center gap-3 py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>7 person</h3>
                        </div>
                        {/* Member Storage Usage */}
                        <div className='flex flex-1 items-center gap-2 py-0 px-3 self-stretch'>
                            <img
                                className='w-6 h-6 rounded-3xl'
                                src="/images/daniel.png" alt="daniel.png" />
                            <h3 className='text-medium-14'>Daniel Foster</h3>
                        </div>
                        {/* Content Permissions Container */}
                        <div className='flex items-center gap-2 w-[180px] py-0 px-3 self-stretch'>
                            <h3 className='text-medium-14'>Manage acccess</h3>
                        </div>
                        {/* Action Container */}
                        <div className='flex justify-center items-center gap-2 w-[52px] py-0 px-3'>
                            <button
                                className='flex items-center justify-center w-8 h-8 p-1 gap-2.5 shadow-custom border border-[#F2F2F3] bg-white rounded cursor-pointer hover:bg-gray-50 transition-colors'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="12" viewBox="0 0 4 12" fill="none">
                                    <path d="M3.33337 1.33333C3.33337 0.6 2.73337 0 2.00004 0C1.26671 0 0.666708 0.6 0.666708 1.33333C0.666708 2.06667 1.26671 2.66667 2.00004 2.66667C2.73337 2.66667 3.33337 2.06667 3.33337 1.33333Z" fill="#2E2E37" />
                                    <path d="M3.33337 10.6666C3.33337 9.93325 2.73337 9.33325 2.00004 9.33325C1.26671 9.33325 0.666708 9.93325 0.666708 10.6666C0.666708 11.3999 1.26671 11.9999 2.00004 11.9999C2.73337 11.9999 3.33337 11.3999 3.33337 10.6666Z" fill="#2E2E37" />
                                    <path d="M3.33337 6.00008C3.33337 5.26675 2.73337 4.66675 2.00004 4.66675C1.26671 4.66675 0.666708 5.26675 0.666708 6.00008C0.666708 6.73341 1.26671 7.33341 2.00004 7.33341C2.73337 7.33341 3.33337 6.73341 3.33337 6.00008Z" fill="#2E2E37" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default GroupsContent;