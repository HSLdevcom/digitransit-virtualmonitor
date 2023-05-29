export const trimMetroIcon = headsign =>
  headsign
    .toLowerCase()
    .replace(/\(m\)/g, '')
    .trim()
    .replace(/\s{2,}/g, ' ');

export const getRenameDestinationId = (headsign: string, gtfsId: string) =>
  headsign.concat(' - ', gtfsId).toLowerCase();
