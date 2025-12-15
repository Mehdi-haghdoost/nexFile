import { CARD_VARIANTS } from './actionButtonsCard.config';

const ActionButtonsCard = ({ 
  icon, 
  title, 
  bgColor = 'bg-white dark:bg-neutral-900', 
  borderColor = 'border-[#E1E0E5] dark:border-neutral-600', 
  textColor = 'text-neutral-500 dark:text-white', 
  iconColor = '', 
  onClick,
  size = 'normal'
}) => {
  // Get variant configuration
  const variant = CARD_VARIANTS[size] || CARD_VARIANTS.normal;

  return (
    <div
      className={`
        flex flex-col items-start
        ${variant.container}
        rounded-lg border 
        ${borderColor} ${bgColor} ${iconColor} 
        cursor-pointer 
        transition-[border,box-shadow,transform,color,opacity]
        hover:scale-105 active:scale-95
        w-full h-full
      `}
      onClick={onClick}
    >
      {/* Icon Container */}
      <div className={`flex items-center justify-center shrink-0 ${variant.icon}`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          className='w-full h-full'
        >
          {icon}
        </svg>
      </div>

      {/* Title */}
      <h3 className={`${textColor} ${variant.text} font-medium leading-snug line-clamp-2`}>
        {title}
      </h3>
    </div>
  );
};

export default ActionButtonsCard;