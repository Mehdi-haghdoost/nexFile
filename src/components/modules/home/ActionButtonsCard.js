const ActionButtonsCard = ({ icon, title, bgColor, borderColor, textColor, onClick }) => {
    return (
        <div
            className={`flex flex-col p-3 items-start gap-2 flex-1 rounded-lg border ${borderColor} ${bgColor} cursor-pointer transition-all duration-200 hover:scale-105`}
            onClick={onClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                {icon}
            </svg>
            <h3 className={textColor}>{title}</h3>
        </div>
    )
}

export default ActionButtonsCard