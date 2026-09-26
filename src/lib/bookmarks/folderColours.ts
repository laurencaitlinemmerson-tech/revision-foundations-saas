/**
 * Folder colours are stored by id in the folder's `emoji` column, so the ids stay
 * and only the hues change. Muted tones from the site palette, not pastels.
 */
export const FOLDER_COLOURS: Record<string, string> = {
  sage: '#3B8F7A',
  warm: '#A6906B',
  slate: '#4F79A8',
  rose: '#B0664A',
  ink: '#3D3530',
  sand: '#C4B49A',
};

export function folderColour(id: string): string {
  return FOLDER_COLOURS[id] ?? id ?? FOLDER_COLOURS.sage;
}
