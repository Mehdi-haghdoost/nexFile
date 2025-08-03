"use client";
import ActionButtonsCard from '@/components/modules/home/ActionButtonsCard';
import styles from './actionButtons.module.css';
import { useState } from 'react';

const ActionButtons = () => {
  const [activeCard, setActiveCard] = useState(0);

  const handleActiveCart = (cardId) => {
    setActiveCard(cardId)
  }

  const actionButtons = [
    {
      id: 0,
      title: "Create",
      icon: <path d="M5 10H15M10 15V5" stroke="#4C3CC6" strokeWidth="1.2" />
    },
    {
      id: 1,
      title: "Upload or drop",
      icon: <path d="M18.3333 12.5V13.5C18.3333 14.9001 18.3333 15.6002 18.0608 16.135C17.8211 16.6054 17.4387 16.9878 16.9683 17.2275C16.4335 17.5 15.7334 17.5 14.3333 17.5H7.33331C5.93318 17.5 5.23312 17.5 4.69834 17.2275C4.22793 16.9878 3.84548 16.6054 3.6058 16.135C3.33331 15.6002 3.33331 14.9001 3.33331 13.5V12.5M15 6.66667L10.8333 2.5M10.8333 2.5L6.66665 6.66667M10.8333 2.5V12.5" stroke="#4C3CC6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />

    },
    {
      id: 2,
      title: "Create folder",
      icon: <path d="M11.5 5.83333L10.5704 3.9741C10.3029 3.439 10.1691 3.17144 9.96952 2.97597C9.79302 2.80311 9.58031 2.67164 9.34677 2.59109C9.08268 2.5 8.78355 2.5 8.18528 2.5H5.00004C4.06662 2.5 3.59991 2.5 3.24339 2.68166C2.92979 2.84144 2.67482 3.09641 2.51503 3.41002C2.33337 3.76654 2.33337 4.23325 2.33337 5.16667V5.83333M2.33337 5.83333H15C16.4002 5.83333 17.1002 5.83333 17.635 6.10582C18.1054 6.3455 18.4879 6.72795 18.7276 7.19836C19 7.73314 19 8.4332 19 9.83333V13.5C19 14.9001 19 15.6002 18.7276 16.135C18.4879 16.6054 18.1054 16.9878 17.635 17.2275C17.1002 17.5 16.4002 17.5 15 17.5H6.33337C4.93324 17.5 4.23318 17.5 3.6984 17.2275C3.22799 16.9878 2.84554 16.6054 2.60586 16.135C2.33337 15.6002 2.33337 14.9001 2.33337 13.5V5.83333ZM10.6667 14.1667V9.16667M8.16671 11.6667H13.1667" stroke="#4C3CC6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    },
    {
      id: 3,
      title: "Edit PDF",
      icon: <path d="M10.5 16.6667H18M3 16.6667H4.39545C4.8031 16.6667 5.00693 16.6667 5.19874 16.6206C5.3688 16.5798 5.53138 16.5125 5.6805 16.4211C5.84869 16.318 5.99282 16.1739 6.28107 15.8856L16.75 5.41669C17.4404 4.72634 17.4404 3.60705 16.75 2.91669C16.0597 2.22634 14.9404 2.22634 14.25 2.91669L3.78105 13.3856C3.4928 13.6739 3.34867 13.818 3.2456 13.9862C3.15422 14.1353 3.08688 14.2979 3.04605 14.468C3 14.6598 3 14.8636 3 15.2713V16.6667Z" stroke="#4C3CC6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    },
    {
      id: 4,
      title: "Get signatures",
      icon: <path d="M12 2.5V5.83333C12 6.05435 12.0878 6.26631 12.2441 6.42259C12.4004 6.57887 12.6123 6.66667 12.8333 6.66667H16.1667M12 2.5H6.16667C5.72464 2.5 5.30072 2.67559 4.98816 2.98816C4.67559 3.30072 4.5 3.72464 4.5 4.16667V15.8333C4.5 16.2754 4.67559 16.6993 4.98816 17.0118C5.30072 17.3244 5.72464 17.5 6.16667 17.5H14.5C14.942 17.5 15.366 17.3244 15.6785 17.0118C15.9911 16.6993 16.1667 16.2754 16.1667 15.8333V6.66667M12 2.5L16.1667 6.66667M8.66667 15L12.8333 10.8333C13.0543 10.6123 13.1785 10.3126 13.1785 10C13.1785 9.68744 13.0543 9.38768 12.8333 9.16666C12.6123 8.94565 12.3126 8.82149 12 8.82149C11.6874 8.82149 11.3877 8.94565 11.1667 9.16666L7 13.3333V15H8.66667Z" stroke="#4C3CC6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    },
    {
      id: 5,
      title: "Sign yourself",
      icon: <path d="M2.66675 15.8333C5.44425 14.1667 6.83341 12.5 6.83341 10.8333C6.83341 8.33333 6.00008 8.33333 5.16675 8.33333C4.33341 8.33333 3.47341 9.2375 3.50008 10.8333C3.52841 12.54 4.88175 13.2308 5.58341 14.1667C6.83341 15.8333 7.66675 16.25 8.50008 15C9.05591 14.1667 9.47258 13.4725 9.75008 12.9167C10.5834 14.8608 11.6942 15.8333 13.0834 15.8333H15.1667M15.1667 15.8333L13.5001 14.1667V4.16667C13.5001 3.2325 14.2326 2.5 15.1667 2.5C16.1009 2.5 16.8334 3.2325 16.8334 4.16667V14.1667L15.1667 15.8333ZM13.5001 5.83333H16.8334" stroke="#4C3CC6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    },

  ]

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
    <div className='flex items-center gap-4 self-stretch'>
      {actionButtons.map((button) => {
        const styles = getCardStyles(button.id)
        return (
          <ActionButtonsCard
            key={button.id}
            title={button.title}
            icon={button.icon}
            onClick={() => handleActiveCart(button.id)}
            {...styles}
          />
        )
      })}
    </div>
  )
}

export default ActionButtons