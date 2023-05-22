export const trimMetroIcon = headsign =>
  headsign.toLowerCase().replace(/\(m\)/g, '').trim();

export const getRenameDestinationId = (headsign: string, gtfsId: string) =>
  headsign.concat(' - ', gtfsId).toLowerCase();
