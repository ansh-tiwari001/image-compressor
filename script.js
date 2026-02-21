const upload = document.getElementById("upload");
const dropArea = document.getElementById("dropArea");
const previewImage = document.getElementById("previewImage");
const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const downloadBtn = document.getElementById("downloadBtn");

let originalImage;
let compressedBlob;

dropArea.addEventListener("click", () => upload.click());

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  originalSize.textContent = (file.size / 1024).toFixed(2) + " KB";

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function(event) {
    previewImage.src = event.target.result;
    previewImage.style.display = "block";

    const img = new Image();
    img.src = event.target.result;

    img.onload = function() {
      originalImage = img;
      compressImage();
    };
  };
});

qualitySlider.addEventListener("input", () => {
  qualityValue.textContent = qualitySlider.value;
  if (originalImage) {
    compressImage();
  }
});

function compressImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = originalImage.width;
  canvas.height = originalImage.height;

  ctx.drawImage(originalImage, 0, 0);

  canvas.toBlob(function(blob) {
    compressedBlob = blob;
    compressedSize.textContent = (blob.size / 1024).toFixed(2) + " KB";
    downloadBtn.disabled = false;
  }, "image/jpeg", qualitySlider.value / 100);
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(compressedBlob);
  link.download = "compressed.jpg";
  link.click();
});