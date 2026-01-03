import Swal from 'sweetalert2';

const getCommonConfig = () => ({
  background: document.documentElement.classList.contains('dark') ? '#1E1E23' : '#ffffff',
  color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
  customClass: {
    container: 'swal-high-z-index'
  }
});

export const showConfirmDialog = async ({
  title = 'Are you sure?',
  text = '',
  icon = 'warning',
  confirmButtonText = 'Yes, proceed',
  cancelButtonText = 'Cancel',
  confirmButtonColor = '#4C3CC6',
  cancelButtonColor = '#6b7280',
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
    ...getCommonConfig(),
  });

  return result.isConfirmed;
};

export const showSuccessAlert = async (title = 'Success!', text = '') => {
  return await Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#4C3CC6',
    ...getCommonConfig(),
  });
};

export const showErrorAlert = async (title = 'Error!', text = '') => {
  return await Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#4C3CC6',
    ...getCommonConfig(),
  });
};

export const showLoadingAlert = (title = 'Please wait...', text = '') => {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    ...getCommonConfig(),
  });
};

export const closeLoadingAlert = () => {
  if (Swal.isVisible()) {
    Swal.close();
  }
};

export const showUploadProgress = (title = 'Uploading...') => {
  Swal.fire({
    title,
    html: `
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
        <div id="upload-progress-bar" class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: 0%"></div>
      </div>
      <p id="upload-progress-text" class="text-sm text-gray-600 dark:text-gray-300">0%</p>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    ...getCommonConfig(),
  });
};

export const updateUploadProgress = (progress) => {
  const progressBar = document.getElementById('upload-progress-bar');
  const progressText = document.getElementById('upload-progress-text');
  
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
  
  if (progressText) {
    progressText.textContent = `${progress}%`;
  }
};