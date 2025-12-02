import { CopyLinkIcon, DrawIcon, FileIcon, FolderIcon, FoldersIcon, ViewIcon } from '@/components/ui/icons';

// Filter buttons configuration
export const sharedFilesFilters = [
  {
    id: 'recent',
    icon: <ViewIcon />,
    label: 'Recent'
  },
  {
    id: 'folders',
    icon: <FoldersIcon />,
    label: 'Folders'
  },
  {
    id: 'files',
    icon: <FileIcon />,
    label: 'Files'
  },
  {
    id: 'links',
    icon: <CopyLinkIcon />,
    label: 'Links'
  },
  {
    id: 'requests',
    icon: <DrawIcon />,
    label: 'Request a Sign'
  }
];

// Sample files data
export const allSharedFiles = [
  {
    id: 1,
    name: "File.pdf",
    icon: <FileIcon />,
    date: "22/12/2024",
    time: "02:30 PM",
    type: "file"
  },
  {
    id: 2,
    name: "Word.pdf",
    icon: <FileIcon />,
    date: "21/12/2024",
    time: "01:15 PM",
    type: "file"
  },
  {
    id: 3,
    name: "Illustrator Design",
    icon: <FolderIcon />,
    date: "20/12/2024",
    time: "10:30 AM",
    type: "folder"
  },
  {
    id: 4,
    name: "Campaign Design",
    icon: <FolderIcon />,
    date: "19/12/2024",
    time: "03:45 PM",
    type: "folder"
  },
  {
    id: 5,
    name: "Presentation.pdf",
    icon: <FileIcon />,
    date: "18/12/2024",
    time: "11:20 AM",
    type: "file"
  },
  {
    id: 6,
    name: "Marketing Assets",
    icon: <FolderIcon />,
    date: "17/12/2024",
    time: "09:15 AM",
    type: "folder"
  }
];

// Table columns configuration
export const sharedFilesTableColumns = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
    width: 'flex-1'
  },
  {
    id: 'date',
    label: 'Date',
    sortable: true,
    width: 'w-[150px]'
  },
  {
    id: 'time',
    label: 'Time',
    sortable: true,
    width: 'w-[150px]'
  },
  {
    id: 'action',
    label: 'Action',
    sortable: false,
    width: 'w-[52px]'
  }
];