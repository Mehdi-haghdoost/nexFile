"use client";
import ActionButtonsCard from '@/components/modules/home/ActionButtonsCard';
import styles from './actionButtons.module.css';
import { useEffect, useRef, useState } from 'react';
import CreateDropdown from '@/components/modules/home/actionDropdowns/CreateDropdown';
import EditPdfModal from '@/components/modules/Modals/editPdfModal/EditPdfModal';
import useModalStore from '@/store/ui/modalStore';
import { actionButtonsConfig } from './actionButtonsConfig';

const ActionButtons = ({ activeSection = 'all-folders' }) => {
  const [activeCard, setActiveCard] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null)
  const containerRef = useRef(null);

  const { openModal } = useModalStore();

  const actionButtons = actionButtonsConfig[activeSection] || actionButtonsConfig['all-folders'];

  const handleActiveCart = (cardId) => {

    const clickedButton = actionButtons.find(button => button.id === cardId);

    if (clickedButton?.modal) {
      openModal(clickedButton.modal);
      setOpenDropdown(null);
      return;
    }

    // اگر اگر دکمه دارای دراپ داون بود دراپ داون را تاگل کن
    if (clickedButton?.dropdown) {
      setActiveCard(cardId);
      setOpenDropdown(openDropdown === cardId ? null : cardId);
      return;
    }

    // default behavior
    setActiveCard(cardId);
  }

  // کلیک خارج از مدال برای بستن
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdown === null) return;

      if (containerRef.current && containerRef.current.contains(e.target)) return;

      setOpenDropdown(null);
    }

 
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
  }, [openDropdown])


  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && openDropdown !== null) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openDropdown])

 const getCardStyles = (cardId) => {
  if (cardId === activeCard) {
    return {
      bgColor: 'bg-primary-500/5',
      borderColor: 'border-primary-500 dark:border-primary-500',
      textColor: 'text-regular-14-primary-500 dark:text-regular-14-white',
      iconColor: 'dark:[&>svg>path]:stroke-white',
    }
  } else {
    return {
      bgColor: 'bg-white dark:bg-neutral-900',
      borderColor: 'border-[#E1E0E5] dark:border-neutral-600',
      textColor: 'text-regular-14-neutral-500 dark:text-regular-14-white',
      iconColor: '',
    }
  }
}

 
  const getButtonContainerClass = () => {
    if (activeSection === 'send-and-monitor') {
      return 'relative';
    }
    return 'relative w-full';
  }

  const getButtonContainerStyle = () => {
    if (activeSection === 'send-and-monitor') {
      return { width: '156.833px' };
    }
    return {};
  }

  return (
    <div className='flex items-center gap-4 self-stretch' ref={containerRef}>
      {actionButtons.map((button, index) => {
        const cardStyles = getCardStyles(button.id);
        const DropdownComponent = CreateDropdown;
        const isLast = index === actionButtons.length - 1;
        return (
          <div 
            className={getButtonContainerClass()}
            style={getButtonContainerStyle()}
            key={button.id}
          >
            <ActionButtonsCard
              title={button.title}
              icon={button.icon}
              onClick={() => handleActiveCart(button.id)}
              {...cardStyles}
            />
            {openDropdown === button.id && button.dropdown && (
              <DropdownComponent
                onClose={() => setOpenDropdown(null)}
                isLast={isLast}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ActionButtons;