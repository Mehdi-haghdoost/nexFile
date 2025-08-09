import styles from './dropdownWrapper.module.css';
const DropdownWrapper = ({ children, onClose, className, isLast = false }) => {

  const handleContentClick = (e) => {
    e.stopPropagation()
  }
  const positionClass = isLast ? '-left-[132px]' : '-left-[3px]';
  return (
    <div
      onClick={handleContentClick}
      className={`flex flex-col justify-center items-center gap-2 w-[285px] p-2 absolute ${positionClass} top-[83px] rounded-lg border border-[#F2F2F3] bg-white ${styles.dropdown} ${styles.boxShadowDropdown} ${className || ''}`}
    >
      {children}
    </div>
  )
}

export default DropdownWrapper