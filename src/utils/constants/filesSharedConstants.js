import { CopyLinkIcon, FileIcon, FoldersIcon, ViewIcon } from '@/components/ui/icons';

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
    id: 'sharedAt',
    label: 'Date',
    sortable: true,
    width: 'w-[150px]'
  },
  {
    id: 'time',
    label: 'Time',
    sortable: false,
    width: 'w-[150px]'
  },
  {
    id: 'action',
    label: 'Action',
    sortable: false,
    width: 'w-[52px]'
  }
];