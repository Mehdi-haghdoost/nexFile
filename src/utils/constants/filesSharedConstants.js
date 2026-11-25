import { CopyLinkIcon, FileIcon, FoldersIcon, ViewIcon } from '@/components/ui/icons';

// The two halves of the Shared list
export const sharedFilesTabs = [
  {
    id: 'with-me',
    label: 'Shared with me'
  },
  {
    id: 'by-me',
    label: 'Shared by me'
  }
];

// Filter buttons configuration
export const sharedFilesFilters = [
  {
    id: 'all',
    icon: <ViewIcon />,
    label: 'All'
  },
  {
    id: 'files',
    icon: <FileIcon />,
    label: 'Files'
  },
  {
    id: 'folders',
    icon: <FoldersIcon />,
    label: 'Folders'
  },
  {
    id: 'links',
    icon: <CopyLinkIcon />,
    label: 'Links'
  }
];

// The order a column starts in when it is first chosen
export const sharedFilesDefaultOrder = {
  name: 'asc',
  sharedAt: 'desc'
};

// Table columns configuration; the people column is named for the tab it shows
export const sharedFilesTableColumns = [
  {
    id: 'name',
    label: 'Name',
    sortable: true,
    width: 'flex-1'
  },
  {
    id: 'people',
    label: 'Shared by',
    tabLabels: { 'with-me': 'Shared by', 'by-me': 'Shared with' },
    sortable: false,
    width: 'w-[160px] lg:w-[200px]'
  },
  {
    id: 'permission',
    label: 'Permission',
    sortable: false,
    width: 'w-[110px]'
  },
  {
    id: 'sharedAt',
    label: 'Shared',
    sortable: true,
    width: 'w-[120px] lg:w-[140px]'
  },
  {
    id: 'action',
    label: 'Action',
    sortable: false,
    width: 'w-[52px]'
  }
];