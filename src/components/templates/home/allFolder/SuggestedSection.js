import styles from './suggestedSection.module.css';

const SuggestedSection = () => {
  return (
    <div className='flex flex-col items-start gap-3 self-stretch'>
      <h3 className='text-medium-18'>Suggested from your activity</h3>
      <ul className='flex flex-wrap items-start gap-3 self-stretch'>
        <li className='flex flex-col items-start w-[246px] gap-2 flex-1 p-4 rounded-lg bg-white border border-[#ECECEE]'>
          <img className='bg-[#F6F6F7] rounded-lg py-4 px-7 gap-2.5 ' src="/images/folder.png" alt="folder.png" />
          <div className='flex justify-center items-center gap-1.5 self-stretch'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
              <path d="M14.576 3.52586C14.6752 3.6818 14.5052 3.86346 14.325 3.8225C13.9725 3.7175 13.5825 3.665 13.185 3.665H10.7722C10.615 3.665 10.4669 3.59106 10.3725 3.46537L9.5475 2.3675C9.44186 2.21783 9.54172 2 9.72491 2H11.79C12.9608 2 13.992 2.60805 14.576 3.52586Z" fill="#FFCA28" />
              <path d="M15.105 5.405C14.7825 5.1725 14.415 5 14.0175 4.9025C13.7475 4.8275 13.47 4.79 13.185 4.79H10.395C9.96 4.79 9.93 4.7525 9.6975 4.445L8.6475 3.05C8.16 2.3975 7.7775 2 6.555 2H4.815C2.985 2 1.5 3.485 1.5 5.315V13.685C1.5 15.515 2.985 17 4.815 17H13.185C15.015 17 16.5 15.515 16.5 13.685V8.105C16.5 6.9875 15.9525 6.005 15.105 5.405ZM10.7925 12.755H7.2C6.9075 12.755 6.6825 12.5225 6.6825 12.23C6.6825 11.945 6.9075 11.705 7.2 11.705H10.7925C11.085 11.705 11.3175 11.945 11.3175 12.23C11.3175 12.5225 11.085 12.755 10.7925 12.755Z" fill="#FFCA28" />
            </svg>
            <h3 className='text-medium-14 flex-1'>DOCX</h3>
            <p className='text-regular-12'>1h ago</p>
          </div>
        </li>
        <li className='flex flex-col items-start w-[246px] gap-2 flex-1 p-4 rounded-lg bg-white border border-[#ECECEE]'>
          <img className='bg-[#F6F6F7] rounded-lg py-4 px-7 gap-2.5 ' src="/images/folder.png" alt="folder.png" />
          <div className='flex justify-center items-center gap-1.5 self-stretch'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
              <path d="M14.576 3.52586C14.6752 3.6818 14.5052 3.86346 14.325 3.8225C13.9725 3.7175 13.5825 3.665 13.185 3.665H10.7722C10.615 3.665 10.4669 3.59106 10.3725 3.46537L9.5475 2.3675C9.44186 2.21783 9.54172 2 9.72491 2H11.79C12.9608 2 13.992 2.60805 14.576 3.52586Z" fill="#FFCA28" />
              <path d="M15.105 5.405C14.7825 5.1725 14.415 5 14.0175 4.9025C13.7475 4.8275 13.47 4.79 13.185 4.79H10.395C9.96 4.79 9.93 4.7525 9.6975 4.445L8.6475 3.05C8.16 2.3975 7.7775 2 6.555 2H4.815C2.985 2 1.5 3.485 1.5 5.315V13.685C1.5 15.515 2.985 17 4.815 17H13.185C15.015 17 16.5 15.515 16.5 13.685V8.105C16.5 6.9875 15.9525 6.005 15.105 5.405ZM10.7925 12.755H7.2C6.9075 12.755 6.6825 12.5225 6.6825 12.23C6.6825 11.945 6.9075 11.705 7.2 11.705H10.7925C11.085 11.705 11.3175 11.945 11.3175 12.23C11.3175 12.5225 11.085 12.755 10.7925 12.755Z" fill="#FFCA28" />
            </svg>
            <h3 className='text-medium-14 flex-1'>DOCX</h3>
            <p className='text-regular-12'>1h ago</p>
          </div>
        </li>
        <li className='flex flex-col items-start w-[246px] gap-2 flex-1 p-4 rounded-lg bg-white border border-[#ECECEE]'>
          <img className='bg-[#F6F6F7] rounded-lg py-4 px-7 gap-2.5 ' src="/images/folder.png" alt="folder.png" />
          <div className='flex justify-center items-center gap-1.5 self-stretch'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
              <path d="M14.576 3.52586C14.6752 3.6818 14.5052 3.86346 14.325 3.8225C13.9725 3.7175 13.5825 3.665 13.185 3.665H10.7722C10.615 3.665 10.4669 3.59106 10.3725 3.46537L9.5475 2.3675C9.44186 2.21783 9.54172 2 9.72491 2H11.79C12.9608 2 13.992 2.60805 14.576 3.52586Z" fill="#FFCA28" />
              <path d="M15.105 5.405C14.7825 5.1725 14.415 5 14.0175 4.9025C13.7475 4.8275 13.47 4.79 13.185 4.79H10.395C9.96 4.79 9.93 4.7525 9.6975 4.445L8.6475 3.05C8.16 2.3975 7.7775 2 6.555 2H4.815C2.985 2 1.5 3.485 1.5 5.315V13.685C1.5 15.515 2.985 17 4.815 17H13.185C15.015 17 16.5 15.515 16.5 13.685V8.105C16.5 6.9875 15.9525 6.005 15.105 5.405ZM10.7925 12.755H7.2C6.9075 12.755 6.6825 12.5225 6.6825 12.23C6.6825 11.945 6.9075 11.705 7.2 11.705H10.7925C11.085 11.705 11.3175 11.945 11.3175 12.23C11.3175 12.5225 11.085 12.755 10.7925 12.755Z" fill="#FFCA28" />
            </svg>
            <h3 className='text-medium-14 flex-1'>DOCX</h3>
            <p className='text-regular-12'>1h ago</p>
          </div>
        </li>
        <li className='flex flex-col items-start w-[246px] gap-2 flex-1 p-4 rounded-lg bg-white border border-[#ECECEE]'>
          <img className='bg-[#F6F6F7] rounded-lg py-4 px-7 gap-2.5 ' src="/images/folder.png" alt="folder.png" />
          <div className='flex justify-center items-center gap-1.5 self-stretch'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
              <path d="M14.576 3.52586C14.6752 3.6818 14.5052 3.86346 14.325 3.8225C13.9725 3.7175 13.5825 3.665 13.185 3.665H10.7722C10.615 3.665 10.4669 3.59106 10.3725 3.46537L9.5475 2.3675C9.44186 2.21783 9.54172 2 9.72491 2H11.79C12.9608 2 13.992 2.60805 14.576 3.52586Z" fill="#FFCA28" />
              <path d="M15.105 5.405C14.7825 5.1725 14.415 5 14.0175 4.9025C13.7475 4.8275 13.47 4.79 13.185 4.79H10.395C9.96 4.79 9.93 4.7525 9.6975 4.445L8.6475 3.05C8.16 2.3975 7.7775 2 6.555 2H4.815C2.985 2 1.5 3.485 1.5 5.315V13.685C1.5 15.515 2.985 17 4.815 17H13.185C15.015 17 16.5 15.515 16.5 13.685V8.105C16.5 6.9875 15.9525 6.005 15.105 5.405ZM10.7925 12.755H7.2C6.9075 12.755 6.6825 12.5225 6.6825 12.23C6.6825 11.945 6.9075 11.705 7.2 11.705H10.7925C11.085 11.705 11.3175 11.945 11.3175 12.23C11.3175 12.5225 11.085 12.755 10.7925 12.755Z" fill="#FFCA28" />
            </svg>
            <h3 className='text-medium-14 flex-1'>DOCX</h3>
            <p className='text-regular-12'>1h ago</p>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default SuggestedSection