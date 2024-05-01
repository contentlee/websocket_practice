export const getMedia = async (constrains: MediaStreamConstraints) => {
  return await navigator.mediaDevices.getUserMedia(constrains);
};

export const getDevices = async (type: MediaDeviceKind) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === type);
};
