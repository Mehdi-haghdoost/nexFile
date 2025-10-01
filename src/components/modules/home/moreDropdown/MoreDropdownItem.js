import { ChevronRightIcon } from '@/components/ui/icons';

const MoreDropdownItem = ({ icon, title, description, onClick }) => {
    return (
        <div className='flex flex-col items-start py-1 px-2 self-stretch'>
            <button
                onClick={onClick}
                className='flex items-center gap-3 self-stretch w-full hover:bg-gray-50 rounded-md transition-colors'
            >
                <div className='flex items-center justify-center gap-2 h-6 w-6 p-1 aspect-square self-stretch rounded-sm border border-white/70 bg-gradient-to-t from-[#4C3CC6] to-[#7E60F8]'>
                    {icon}
                </div>
                <div className='flex flex-1 flex-col gap-1 items-start justify-start'>
                    <h3 className='text-medium-12'>{title}</h3>
                    <p className='text-regular-12-neutral-200 overflow-hidden text-[#9F9FA3] truncate self-stretch line-clamp-1'>
                        {description}
                    </p>
                </div>
                <ChevronRightIcon />
            </button>
        </div>
    );
};

export default MoreDropdownItem;