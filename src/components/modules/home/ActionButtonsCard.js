const ActionButtonsCard = ({ 
  icon, 
  title, 
  bgColor, 
  borderColor, 
  textColor, 
  iconColor, 
  onClick,
  size = 'normal'
}) => {

    const getSizeClasses = () => {
      switch(size) {
        case 'compact':
          return 'p-2 gap-1 min-h-[70px]';
        case 'small':
          return 'p-2.5 gap-1.5 min-h-[80px]';
        case 'normal':
        default:
          return 'p-3 gap-2 min-h-[90px]';
      }
    };

    const getTextSize = () => {
      switch(size) {
        case 'compact':
          return 'text-xs';
        case 'small':
          return 'text-xs';
        case 'normal':
        default:
          return 'text-sm';
      }
    };

    const getIconSize = () => {
      switch(size) {
        case 'compact':
          return 'w-4 h-4';
        case 'small':
          return 'w-5 h-5';
        case 'normal':
        default:
          return 'w-5 h-5';
      }
    };

    return (
        <div
            className={`
              flex flex-col items-start
              ${getSizeClasses()}
              rounded-lg border 
              ${borderColor} ${bgColor} ${iconColor} 
              cursor-pointer 
              transition-all duration-200 
              hover:scale-105 active:scale-95
              w-full h-full
            `}
            onClick={onClick}
        >
            <div className={`flex items-center justify-center shrink-0 ${getIconSize()}`}>
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
            <h3 className={`${textColor} ${getTextSize()} leading-snug line-clamp-2`}>
              {title}
            </h3>
        </div>
    )
}

export default ActionButtonsCard;