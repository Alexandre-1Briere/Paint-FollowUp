export enum BrushTextures {
  Diffuse = 'Diffuse',
  Irregular = 'Irregular',
  Foggy = 'Foggy',
  Shadow = 'Shadow',
  Lighting = 'Lighting',
}

export const indexToBrushTextures: Record<number, BrushTextures> = {
  0: BrushTextures.Diffuse,
  1: BrushTextures.Irregular,
  2: BrushTextures.Foggy,
  3: BrushTextures.Shadow,
  4: BrushTextures.Lighting,
};

export const brushTexturesTranslation: Record<BrushTextures, string> = {
  Diffuse: 'Diffuse',
  Irregular: 'Irrégulier',
  Foggy: 'Embrouiller',
  Shadow: 'Ombrager',
  Lighting: 'Peinture',
};
