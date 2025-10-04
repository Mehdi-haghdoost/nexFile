const FileIcon = ({ extension }) => {
  const getIconStyle = () => {
    switch (extension) {
      case 'pdf':
        return { bg: '#F8E8EA', stroke: '#BC1828' };
      case 'doc':
      case 'docx':
        return { bg: '#E8F0FA', stroke: '#2E5AAC' };
      case 'xls':
      case 'xlsx':
        return { bg: '#E8F5E9', stroke: '#1B5E20' };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return { bg: '#FFF3E0', stroke: '#E65100' };
      case 'zip':
      case 'rar':
        return { bg: '#F3E5F5', stroke: '#6A1B9A' };
      default:
        return { bg: '#F5F5F5', stroke: '#616161' };
    }
  };

  const { bg, stroke } = getIconStyle();

  // PDF Icon
  if (extension === 'pdf') {
    return (
      <div className='flex h-[28px] w-[28px] justify-center items-center gap-2.5 rounded-sm' style={{ backgroundColor: bg }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path 
            d="M2.5 9.99935H4.16667C4.60869 9.99935 5.03262 9.82375 5.34518 9.51119C5.65774 9.19863 5.83333 8.77471 5.83333 8.33268C5.83333 7.89065 5.65774 7.46673 5.34518 7.15417C5.03262 6.84161 4.60869 6.66602 4.16667 6.66602H2.5V13.3327M14.1667 9.99935H16.6667M17.5 6.66602H14.1667V13.3327M8.33333 6.66602V13.3327H10C10.442 13.3327 10.866 13.1571 11.1785 12.8445C11.4911 12.532 11.6667 12.108 11.6667 11.666V8.33268C11.6667 7.89065 11.4911 7.46673 11.1785 7.15417C10.866 6.84161 10.442 6.66602 10 6.66602H8.33333Z" 
            stroke={stroke} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    );
  }

  // Word Icon
  if (extension === 'doc' || extension === 'docx') {
    return (
      <div className='flex h-[28px] w-[28px] justify-center items-center gap-2.5 rounded-sm' style={{ backgroundColor: bg }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path 
            d="M4.16667 6.66602L5.83333 13.3327L7.5 7.49935L9.16667 13.3327L10.8333 6.66602M13.3333 6.66602V13.3327M13.3333 6.66602H16.6667M13.3333 6.66602H15M13.3333 13.3327H15H16.6667" 
            stroke={stroke} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    );
  }

  // Excel Icon
  if (extension === 'xls' || extension === 'xlsx') {
    return (
      <div className='flex h-[28px] w-[28px] justify-center items-center gap-2.5 rounded-sm' style={{ backgroundColor: bg }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path 
            d="M3.33333 6.66602L7.5 13.3327M7.5 6.66602L3.33333 13.3327M10.8333 6.66602V13.3327M10.8333 6.66602H12.5C12.942 6.66602 13.366 6.84161 13.6785 7.15417C13.9911 7.46673 14.1667 7.89065 14.1667 8.33268C14.1667 8.77471 13.9911 9.19863 13.6785 9.51119C13.366 9.82375 12.942 9.99935 12.5 9.99935H10.8333M10.8333 13.3327H12.5C12.942 13.3327 13.366 13.1571 13.6785 12.8445C13.9911 12.532 14.1667 12.108 14.1667 11.666C14.1667 11.224 13.9911 10.8001 13.6785 10.4875C13.366 10.175 12.942 9.99935 12.5 9.99935H10.8333M10.8333 9.99935H12.5" 
            stroke={stroke} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    );
  }

  // Image Icon
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return (
      <div className='flex h-[28px] w-[28px] justify-center items-center gap-2.5 rounded-sm' style={{ backgroundColor: bg }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path 
            d="M2.5 13.3327L6.66667 9.16602C7.10869 8.72399 7.53262 8.5484 7.84518 8.23584C8.15774 7.92328 8.57826 7.74768 9.02029 7.74768C9.46232 7.74768 9.88285 7.92328 10.1954 8.23584L14.1667 12.2077M12.5 10.8327L13.3333 9.99935C13.7754 9.55732 14.1993 9.38173 14.5118 9.06917C14.8244 8.75661 15.2449 8.58102 15.6869 8.58102C16.129 8.58102 16.5495 8.75661 16.862 9.06917L17.5 9.70768M12.5 6.66602H12.5083M4.16667 17.4993H15.8333C16.2754 17.4993 16.6993 17.3238 17.0118 17.0112C17.3244 16.6986 17.5 16.2747 17.5 15.8327V4.16602C17.5 3.72399 17.3244 3.30006 17.0118 2.9875C16.6993 2.67494 16.2754 2.49935 15.8333 2.49935H4.16667C3.72464 2.49935 3.30072 2.67494 2.98816 2.9875C2.67559 3.30006 2.5 3.72399 2.5 4.16602V15.8327C2.5 16.2747 2.67559 16.6986 2.98816 17.0112C3.30072 17.3238 3.72464 17.4993 4.16667 17.4993Z" 
            stroke={stroke} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
    );
  }

  // Default File Icon
  return (
    <div className='flex h-[28px] w-[28px] justify-center items-center gap-2.5 rounded-sm' style={{ backgroundColor: bg }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path 
          d="M11.6667 2.5V5.83333C11.6667 6.05435 11.7545 6.26631 11.9107 6.42259C12.067 6.57887 12.2789 6.66667 12.5 6.66667H15.8333M11.6667 2.5H5.83333C5.39131 2.5 4.96738 2.67559 4.65482 2.98816C4.34226 3.30072 4.16667 3.72464 4.16667 4.16667V15.8333C4.16667 16.2754 4.34226 16.6993 4.65482 17.0118C4.96738 17.3244 5.39131 17.5 5.83333 17.5H14.1667C14.6087 17.5 15.0326 17.3244 15.3452 17.0118C15.6577 16.6993 15.8333 16.2754 15.8333 15.8333V6.66667M11.6667 2.5L15.8333 6.66667" 
          stroke={stroke} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    </div>
  );
};

export default FileIcon;