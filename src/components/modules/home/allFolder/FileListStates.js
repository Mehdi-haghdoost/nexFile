// Shared shell so every state keeps the section's spacing
const StateWrapper = ({ children }) => (
  <div className="flex flex-col items-center justify-center gap-4 flex-1 self-stretch p-8 sm:p-12 w-full">
    {children}
  </div>
);

export const FilesLoadingState = () => (
  <StateWrapper>
    <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
    <p className="text-sm text-neutral-400 dark:text-neutral-300">Loading files...</p>
  </StateWrapper>
);

export const FilesErrorState = ({ error }) => (
  <StateWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="stroke-red-500 w-12 h-12 sm:w-16 sm:h-16">
      <path d="M32 22V32M32 42H32.02M54 32C54 44.1503 44.1503 54 32 54C19.8497 54 10 44.1503 10 32C10 19.8497 19.8497 10 32 10C44.1503 10 54 19.8497 54 32Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="flex flex-col items-center gap-2 text-center">
      <h3 className="text-base sm:text-lg font-medium text-red-500">Failed to load files</h3>
      <p className="text-sm text-neutral-400 dark:text-neutral-300 px-4">{error}</p>
    </div>
  </StateWrapper>
);

// The wording differs by level: the root is where a first upload goes, a folder is simply empty
export const FilesEmptyState = ({ isRoot }) => (
  <StateWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="stroke-[#9E9EA7] dark:stroke-white w-12 h-12 sm:w-16 sm:h-16">
      <path d="M32 20V44M20 32H44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 54C44.1503 54 54 44.1503 54 32C54 19.8497 44.1503 10 32 10C19.8497 10 10 19.8497 10 32C10 44.1503 19.8497 54 32 54Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="flex flex-col items-center gap-2 text-center">
      <h3 className="text-base sm:text-lg font-medium text-neutral-500 dark:text-white">
        {isRoot ? "No files here yet" : "This folder is empty"}
      </h3>
      <p className="text-sm text-neutral-400 dark:text-neutral-300 px-4">
        {isRoot
          ? "Upload a file, or open a folder to see what is inside"
          : "Upload files here, or move them in from another folder"}
      </p>
    </div>
  </StateWrapper>
);