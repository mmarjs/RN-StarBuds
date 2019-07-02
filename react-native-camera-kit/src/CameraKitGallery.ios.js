import {
  NativeModules,
} from 'react-native';

var CKGallery = NativeModules.CKGalleryManager;

async function getAlbumsWithThumbnails() {
    const albums = await CKGallery.getAlbumsWithThumbnails();
    return albums;
}

async function getImageUriForId(imageId, imageQuality) {
  const {images} = await CKGallery.getImagesForIds([imageId], imageQuality);
  if (!images) {
    return;
  }
  if (images.length === 1) {
    return { imageUri: images[0].uri, mediaType: images[0].mediaType};
  }
  return;
}

async function getImagesForIds(imagesId = [], imageQuality) {
  const images = await CKGallery.getImagesForIds(imagesId, imageQuality);
  return { imageUri: images.uri, mediaType: images.mediaType };
}

async function getImageForTapEvent(nativeEvent) {
  let selectedImageId;
  let imageUri;
  if (nativeEvent.selectedId) {
    selectedImageId = nativeEvent.selectedId;
    imageUri = nativeEvent.selected;
    isType = nativeEvent.mediaType;
  } else {
    selectedImageId = nativeEvent.selected;
    images = await getImageUriForId(selectedImageId);
    imageUri = images.imageUri;
    isType = images.mediaType;
  }
  console.log("getImageForTapEvent", isType)
  return { selectedImageId, imageUri, isType, width: nativeEvent.width, height: nativeEvent.height};
}

async function getImagesForCameraEvent(event) {
  return event.captureImages || [];
}

async function resizeImage(image = {}, quality = 'original') {
  if (quality === 'original') {
    return images;
  }

  const ans = await CKGallery.resizeImage(image, quality);
  return ans;
}

async function checkDevicePhotosAuthorizationStatus() {
    const isAuthorized = await CKGallery.checkDevicePhotosAuthorizationStatus();
    return isAuthorized;
}

async function requestDevicePhotosAuthorization() {
  const isAuthorized = await CKGallery.requestDevicePhotosAuthorization();
  return isAuthorized;
}


export default {
  getAlbumsWithThumbnails,
  getImageUriForId,
  getImagesForIds,
  getImageForTapEvent,
  getImagesForCameraEvent,
  checkDevicePhotosAuthorizationStatus,
  requestDevicePhotosAuthorization,
  resizeImage
}
