import { Aerosol } from './aerosol/aerosol';
import { ApplicateurDeCouleur } from './applicateur-de-couleur/applicateur-de-couleur';
import { Crayon } from './crayon/crayon';
import { Efface } from './efface/efface';
import { Ellipse } from './ellipse/ellipse';
import { Etampe } from './etampe/etampe';
import { Ligne } from './ligne/ligne';
import { Pinceau } from './pinceau/pinceau';
import { Pipette } from './pipette/pipette';
import { Plume } from './plume/plume';
import { Polygone } from './polygone/polygone';
import { PotDePeinture } from './pot-de-peinture/pot-de-peinture';
import { Rectangle } from './rectangle/rectangle';
import { Selection } from './selection/selection';

export const tools = new Map()
  .set('crayon', Crayon.getInstance())
  .set('ligne', Ligne.getInstance())
  .set('pinceau', Pinceau.getInstance())
  .set('rectangle', Rectangle.getInstance())
  .set('aerosol', Aerosol.getInstance())
  .set('ellipse', Ellipse.getInstance())
  .set('polygone', Polygone.getInstance())
  .set('rectangle de selection', Selection.getInstance())
  .set('pipette', Pipette.getInstance())
  .set ('efface', Efface.getInstance())
  .set('applicateur de couleur', ApplicateurDeCouleur.getInstance())
  .set('plume', Plume.getInstance())
  .set('pot de peinture', PotDePeinture.getInstance())
  .set('etampe', Etampe.getInstance());
