import FileActionMenu from "./FileActionMenu";

const FileGridItem = ({ file, isSelected, onSelect }) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-[#F2F2F3] dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all group">
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          aria-label={`Select ${file.name}`}
          className="h-[18px] w-[18px] rounded-[4px] border-[#EAEAEB] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:invert dark:hue-rotate-180 dark:brightness-75 dark:accent-white shrink-0"
        />
        {/* Hidden until hover on desktop, always reachable on touch */}
        <div className="lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity">
          <FileActionMenu file={file} />
        </div>
      </div>

      <div className="flex items-center justify-center py-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20" fill="none">
          <path d="M11.6667 1.66675H5.00004C4.55801 1.66675 4.13409 1.84234 3.82153 2.1549C3.50897 2.46746 3.33337 2.89139 3.33337 3.33341V16.6667C3.33337 17.1088 3.50897 17.5327 3.82153 17.8453C4.13409 18.1578 4.55801 18.3334 5.00004 18.3334H15C15.4421 18.3334 15.866 18.1578 16.1786 17.8453C16.4911 17.5327 16.6667 17.1088 16.6667 16.6667V6.66675L11.6667 1.66675Z" stroke="#4C3CC6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.6667 1.66675V6.66675H16.6667" stroke="#4C3CC6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 dir="auto" className="text-sm font-medium text-neutral-500 dark:text-white truncate text-center">
        {file.displayName}
      </h3>

      <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 dark:text-neutral-300">
        <span>{file.formattedSize}</span>
        <span>•</span>
        <span>{file.formattedTime}</span>
      </div>
    </div>
  );
};

export default FileGridItem;