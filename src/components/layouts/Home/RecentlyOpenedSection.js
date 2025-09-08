// RecentlyOpenedSection.js
const RecentlyOpenedSection = () => {
  const recentItems = [
    'Landing Page',
    'Mobile Apps', 
    'Dashboard',
    'Brief',
    'Winter Project',
    'Happy New Year'
  ];

  return (
    <div className='flex flex-col items-start self-stretch'>
      <div className='flex items-start h-[38px] py-1 px-3 gap-3 self-stretch'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="#737379" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className='text-regular-12-upper'>Recently opened</h3>
      </div>
      <ul>
        {recentItems.map((item, index) => (
          <li key={index} className='flex h-[38px] py-1 px-3 items-start gap-2 self-stretch'>
            <div className='flex h-5 w-5 items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.1955 3.36203C16.3058 3.53529 16.1169 3.73714 15.9167 3.69163C15.525 3.57496 15.0917 3.51663 14.65 3.51663H11.9414C11.7842 3.51663 11.6361 3.44268 11.5417 3.317L10.6083 2.07496C10.491 1.90866 10.6019 1.66663 10.8055 1.66663H13.1C14.4008 1.66663 15.5467 2.34224 16.1955 3.36203Z" fill="#FFCA28" />
                <path d="M16.7833 5.44996C16.425 5.19163 16.0167 4.99996 15.575 4.89163C15.275 4.80829 14.9667 4.76663 14.65 4.76663H11.55C11.0667 4.76663 11.0333 4.72496 10.775 4.38329L9.60833 2.83329C9.06666 2.10829 8.64166 1.66663 7.28333 1.66663H5.35C3.31666 1.66663 1.66666 3.31663 1.66666 5.34996V14.65C1.66666 16.6833 3.31666 18.3333 5.35 18.3333H14.65C16.6833 18.3333 18.3333 16.6833 18.3333 14.65V8.44996C18.3333 7.20829 17.725 6.11663 16.7833 5.44996ZM11.9917 13.6166H8C7.675 13.6166 7.425 13.3583 7.425 13.0333C7.425 12.7166 7.675 12.45 8 12.45H11.9917C12.3167 12.45 12.575 12.7166 12.575 13.0333C12.575 13.3583 12.3167 13.6166 11.9917 13.6166Z" fill="#FFCA28" />
              </svg>
            </div>
            <h3 className='text-regular-14'>{item}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyOpenedSection;