document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const compressionInput = document.getElementById('compression-input');
    const compressBtn = document.getElementById('compress-btn');
    const originalImage = document.getElementById('original-image');
    const compressedImage = document.getElementById('compressed-image');
    const originalInfo = document.getElementById('original-info');
    const compressedInfo = document.getElementById('compressed-info');
    const downloadLink = document.getElementById('download-link');
  
    fileInput.addEventListener('change', function() {
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      reader.addEventListener('load', function() {
        originalImage.src = reader.result;
        compressedImage.src = reader.result;
        originalInfo.textContent = `File Size: ${formatBytes(file.size)}`;
      });
  
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  
    compressBtn.addEventListener('click', function() {
      const compressionLevel = Number(compressionInput.value);
      if (compressionLevel >= 0 && compressionLevel <= 100) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        const img = new Image();
        img.src = originalImage.src;
  
        img.addEventListener('load', function() {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
  
          const compressedDataURL = canvas.toDataURL('image/jpeg', compressionLevel / 100);
          compressedImage.src = compressedDataURL;
          const compressedFile = dataURLtoFile(compressedDataURL, 'compressed_image.jpg');
          compressedInfo.textContent = `File Size: ${formatBytes(compressedFile.size)}`;
  
          downloadLink.href = compressedDataURL;
        });
      } else {
        alert('Please enter a compression level between 0 and 100.');
      }
    });
  
    function formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  
    function dataURLtoFile(dataURL, fileName) {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    }
  });
  