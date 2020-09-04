import {
    SIZE,
} from '../components/drawing/tool-detail/applicable-setting.class';
import { Documented } from '../interfaces/documented';
import { OPTION_SLIDER } from './options-types';

const getLength = () => {
    let length = 0;
    for (const category of TOOL_LIST) {
        length += category.length;
    }
    return length;
};

export const TOOL_LIST: Documented[][] = [
    [
        {
            icon: undefined,
            category: 'Espace de Dessin',
            name: 'Grille',
            description: 'Pour afficher la grille, il suffit d’effectuer un' +
                ' clic sur l’icône dans la barre d’outils sur la zone de dessin,' +
                ' ou en utilisant le raccourci [G]. Alternativement, il est' +
                ' possible de modifier la grosseur de la grille et de changer' +
                ' sa visibilité sur la zone de dessin en effectuant un double' +
                ' clic sur l’icône mentionné ci-haut.',
            usage: 'undefined',
            options: [],
        },
    ],
    [
        {
            icon: 'edit',
            category: 'Traçage',
            name: 'Crayon',
            description: 'Le crayon est un outil servant à faire des lignes suivant' +
                ' le pointeur de la souris sur la zone de dessin.',
            usage: 'Pour utiliser le crayon, il suffit d’exécuter un' +
                ' glissé-déposé sur la zone de dessin avec un clic gauche de la' +
                ' souris. Les options disponibles sont : la largeur du trait et' +
                ' la couleur (principale uniquement). Raccourci : [C]',
            options: [
                {
                    name: SIZE,
                    label: 'Largeur du trait',
                    enabled: true,
                    default: 10,
                    choices: [],
                    min: 1,
                    max: 250,
                    type: OPTION_SLIDER,
                },
            ],
        },
    ],
    [
        {
            icon: 'backspace',
            category: 'Effaçage',
            name: 'Efface',
            description: 'La selection est un outil qui permet la manipulation' +
                ' d\'un ou plusieurs objets svg.',
            usage: 'Pour utiliser l’efface, il suffit d’exécuter un clic sur un' +
                ' élément du dessin fait avec un autre outil. Un clic gauche' +
                ' effacera l’élément. Un glissé-déposé effacera tous les' +
                ' éléments qui se retrouveront sous le curseur. Les options' +
                ' disponibles sont : la taille de l’efface. Raccourci : [E]',
            options: [
                {
                    name: SIZE,
                    label: 'Taille',
                    enabled: true,
                    default: 8,
                    choices: [],
                    min: 3,
                    max: 100,
                    type: OPTION_SLIDER,
                },
            ],
        },
    ],
    [
        {
            icon: 'colorize',
            category: 'Autre',
            name: 'Pipette',
            description: 'La pipette est un outil qui permet la selection d\'une couleur' +
                ' existante sur un élément du canvas.',
            usage: 'Pour utiliser la pipette, il suffit d’exécuter un clic sur' +
                ' la zone de travail. Un clic gauche changera la couleur' +
                ' principale sélectionnée et un clic droit changera la couleur' +
                ' secondaire sélectionnée. La couleur respective sera changée' +
                ' par la couleur se retrouvant sous le curseur lors du clic. Il' +
                ' n’existe aucune option disponible pour cet outil. Raccourci : [I]',
            options: [],
        },
        {
            icon: 'palette',
            category: 'Autre',
            name: 'Couleur',
            description: 'L\'outil de sélection de couleur est un outil qui altère tous' +
                ' les autres en changeant la couleur secondaire ou la couleur primaire' +
                ' de ces dernier.',
            usage: 'Pour utiliser la palette de couleur, il suffit de faire un' +
                ' glissé-déposé sur la glissade de couleur (celle de gauche) pour' +
                ' changer la couleur, puis d’exécuter un clic sur la zone de' +
                ' couleur pour changer la teinte de la couleur. Alternativement,' +
                ' il est possible de modifier seulement la couleur sans changer' +
                ' sa teinte, en cliquant sur « appliquer » et de modifier la' +
                ' couleur du fond de la zone de dessin en cliquant sur « Fond' +
                ' d’écran ». Enfin, il est possible de changer l’opacité de la' +
                ' couleur appliquée par les outils en utilisant la glissade' +
                ' d’opacité (celle de droite). Finalement, on peut choisir une' +
                ' couleur précédente en cliquant sur une des pastilles au bas,' +
                ' ou de sélectionner manuellement la valeur hexadécimale dans' +
                ' le champ dédié.',
            options: [],
        },
    ],
];

export const TOOL_NUMBER = getLength();

// tslint:disable:max-file-line-count
// Reason: File contains mostly text and constants; not code
