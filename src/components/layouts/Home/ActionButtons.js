"use client";
import ActionButtonsCard from '@/components/modules/home/ActionButtonsCard';
import styles from './actionButtons.module.css';
import { useEffect, useRef, useState } from 'react';
import CreateDropdown from '@/components/modules/home/actionDropdowns/CreateDropdown';
import EditPdfModal from '@/components/modules/Modals/editPdfModal/EditPdfModal';
import useModalStore from '@/store/modalStore';
import { actionButtonsConfig } from './actionButtonsConfig';

const ActionButtons = ({ activeSection = 'all-folders' }) => {
  const [activeCard, setActiveCard] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null)
  const containerRef = useRef(null);

  const { openModal } = useModalStore();

  const actionButtons = actionButtonsConfig[activeSection] || actionButtonsConfig['all-folders'];

  const handleActiveCart = (cardId) => {
    // پیدا کردن دکمه ی کلیک شده
    const clickedButton = actionButtons.find(button => button.id === cardId);
    //  اگر دکمه دارای مدال است اونو باز کن
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

    // اینجا گفتم فقط زمانی که دراپ داون بازهست لیسنر اضافه کن 
    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)  //این حالت برای موبایله
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
  }, [openDropdown])

  // برای بسته شدن ا فشردن دکمه Escape
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
      // استایل کارت فعال و دیفالت
      return {
        bgColor: 'bg-primary-500/5',
        borderColor: 'border-primary-500',
        textColor: 'text-regular-14-primary-500',
      }
    } else {
      return {
        bgColor: 'bg-white',
        borderColor: 'border-[#E1E0E5]',
        textColor: 'text-regular-14-neutral-500',
      }
    }
  }

  return (
    <div className='flex items-center gap-4 self-stretch ' ref={containerRef}>
      {actionButtons.map((button, index) => {
        const cardStyles = getCardStyles(button.id);
        const DropdownComponent = CreateDropdown;
        const isLast = index === actionButtons.length - 1;
        return (
          <div className='relative w-full'
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