import {
    ANGLE,
    APPROVED,
    BORDER,
    BORDER_SIZE,
    DRONE,
    ENABLE_POINTS,
    FULL,
    HOSPITAL,
    NORMAL,
    POINTS_SIZE,
    ROBOT,
    SIZE,
    STAY_AT_HOME,
    STYLE,
} from '../components/drawing/tool-detail/applicable-setting.class';
import { BrushTextures, brushTexturesTranslation } from '../components/svgElement/svg-brush/textures';
import { Documented } from '../interfaces/documented';
import { OPTION_SELECT, OPTION_SLIDE_TOGGLE, OPTION_SLIDER } from './options-types';

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
            category: 'undefined',
            name: 'Bienvenue',
            description: 'Bienvenue dans le guide d\'utilisation. Pour afficher' +
                ' le guide d\'utilisation d\'un outil, il suffit de cliquer sur' +
                ' l\'outil dans le menu sur la gauche de l\'écran. Vous pouvez' +
                ' également naviger vers l\'outil précédent ou suivant grâce aux' +
                ' boutons précédent et suivant au dessus de la page. Pour revenir' +
                ' à la page précédente, il vous suffit de cliquer sur le bouton' +
                ' retour en haut du menu.',
            usage: 'undefined',
            options: [],
        },
    ],
    [
        {
            icon: undefined,
            category: 'Dessins',
            name: 'Nouveau dessin',
            description: 'undefined',
            usage: 'Pour créer un nouveau dessin, il suffit d’ouvrir le dialogue' +
                ' par la page principale, ou en utilisant le raccourci [CTRL+O],' +
                ' puis de cliquer sur « Créer un nouveau dessin ». Alternativement,' +
                ' il est possible de modifier la couleur de fond du dessin et de' +
                ' modifier les dimensions de ce dernier.',
            options: [],
        },
        {
            icon: undefined,
            category: 'Dessins',
            name: 'Galerie',
            description: 'undefined',
            usage: 'Pour choisir un dessin existant, il suffit d’ouvrir le' +
                ' dialogue par la page principale, par la barre d’outils sur la' +
                ' zone de dessin, ou en utilisant le raccourci [CTRL+G]. Il faut' +
                ' ensuite sélectionner le dessin voulu, puis cliquer sur' +
                ' « Sélectionner ».',
            options: [],
        },
        {
            icon: undefined,
            category: 'Dessins',
            name: 'Sauvegarder',
            description: 'undefined',
            usage: 'Pour sauvegarder un dessin, il suffit d’ouvrir le dialogue' +
                ' par la barre d’outils sur la zone de dessin, ou en utilisant' +
                ' le raccourci [CTRL+S]. Il faut ensuite sélectionner le titre' +
                ' voulu, puis cliquer sur « Sauvegarder ». Alternativement, il' +
                ' est possible d’entrer des tags pour le retrouver plus' +
                ' rapidement à l’aide de la Galerie plus tard.',
            options: [],
        },
        {
            icon: undefined,
            category: 'Dessins',
            name: 'Exporter',
            description: 'undefined',
            usage: 'Pour exporter un dessin, il suffit d’ouvrir le dialogue' +
                ' par la barre d’outils sur la zone de dessin, ou en utilisant' +
                ' le raccourci [CTRL+E]. Il faut ensuite sélectionner le titre' +
                ' voulu, puis cliquer sur « Exporter ». Alternativement, il est' +
                ' possible d’appliquer un filtre sur le dessin, de changer' +
                ' l’extension du fichier et de l\'envoyer par courriel.',
            options: [],
        },
        {
            icon: undefined,
            category: 'Dessins',
            name: 'Tags',
            description: 'Les tags sont utilisés pour identifier les images.' +
                ' Lorsque vous sauvegardez une image, donnez-y des tags qui' +
                ' représentent bien votre image. Vous utiliserez ensuite ces' +
                ' tags pour les retrouver!',
            usage: 'undefined',
            options: [],
        },
    ],
    [
        {
            icon: undefined,
            category: 'Espace de Dessin',
            name: 'Espace de dessin',
            description: 'L’espace de dessin comprend 3 espaces : la barre' +
                ' d’outils, la zone de dessin et les options pour outils.' +
                ' Dessinez sur la zone de dessin au moyen des outils en' +
                ' utilisant la souris.',
            usage: 'undefined',
            options: [],
        },
        {
            icon: undefined,
            category: 'Espace de Dessin',
            name: 'Barre d\'outils',
            description: 'La barre d’outils est séparée en 3 catégories : retour' +
                ' au menu principal, les outils, et les options de dessin.',
            usage: 'undefined',
            options: [],
        },
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
        {
            icon: undefined,
            category: 'Espace de Dessin',
            name: 'Outils',
            description: 'Ce sont avec les outils que l’on peut modifier le' +
                ' dessin sur la zone de dessin. Chaque outil possède des' +
                ' propriétés spécifiques que l’on peut modifier dans la barre' +
                ' des options pour outils.',
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

        {
            icon: 'brush',
            category: 'Traçage',
            name: 'Pinceau',
            description: 'Le pinceau est un outil servant à faire des lignes' +
                ' texturés suivant le pointeur de la souris sur la zone de dessin.',
            usage: 'Pour utiliser le pinceau, il suffit d’exécuter un' +
                ' glissé-déposé sur la zone de dessin avec un clic gauche de la' +
                ' souris. Les options disponibles sont : la largeur du trait,' +
                ' une texture et la couleur (principale uniquement).' +
                ' Raccourci : [W]',
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
                {
                    name: STYLE,
                    label: 'Texture',
                    enabled: true,
                    default: brushTexturesTranslation[BrushTextures.Diffuse],
                    choices: [
                        {
                            label: brushTexturesTranslation[BrushTextures.Diffuse],
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: brushTexturesTranslation[BrushTextures.Irregular],
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: brushTexturesTranslation[BrushTextures.Foggy],
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: brushTexturesTranslation[BrushTextures.Shadow],
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: brushTexturesTranslation[BrushTextures.Lighting],
                            displayLabel: undefined,
                            icon: undefined,
                        },
                    ],
                    min: undefined,
                    max: undefined,
                    type: OPTION_SELECT,
                },
            ],
        },
        {
            icon: 'blur_on',
            category: 'Traçage',
            name: 'Aerosol',
            description: 'L’aérosol est un jet de peinture vaporisé à des intervals' +
                ' réguliers sous le pointeur tant que le bouton gauche de la souris' +
                ' est enfoncé. Le motif de vaporisation est aléatoire à chaque émission.',
            usage: 'Pour utiliser l’aérosol, il suffit d’exécuter un' +
                ' glissé-déposé sur la zone de dessin avec un clic gauche de la' +
                ' souris. Les options disponibles sont : la largeur de' +
                ' l’application, la couverture et la couleur (principale' +
                ' uniquement). Raccourci : [A]',
            options: [
                {
                    name: SIZE,
                    label: 'Largeur de l\'application',
                    enabled: true,
                    default: 10,
                    choices: [],
                    min: 1,
                    max: 25,
                    type: OPTION_SLIDER,
                },
                {
                    name: POINTS_SIZE,
                    label: 'Couverture',
                    enabled: true,
                    default: 15,
                    choices: [],
                    min: 1,
                    max: 50,
                    type: OPTION_SLIDER,
                },
            ],
        },

        {
            icon: 'gesture',
            category: 'Traçage',
            name: 'Plume',
            description: 'La plume est un outil servant à faire des lignes' +
                ' orientées suivant le pointeur de la souris sur la zone de dessin. ',
            usage: 'Pour utiliser la plume, il suffit d’exécuter un' +
                ' glissé-déposé sur la zone de dessin avec un clic gauche de la' +
                ' souris. Les options disponibles sont : l’angle de la ligne, ' +
                ' sa longueur et la couleur (principale' +
                ' uniquement). Raccourci : [P]',
            options: [
                {
                    name: ANGLE,
                    label: 'Angle d\'orientation',
                    enabled: true,
                    default: 45,
                    choices: [],
                    min: 0,
                    max: 360,
                    type: OPTION_SLIDER,
                },
                {
                    name: SIZE,
                    label: 'Longueur de la ligne',
                    enabled: true,
                    default: 35,
                    choices: [],
                    min: 10,
                    max: 100,
                    type: OPTION_SLIDER,
                },
            ],
        },
    ],
    [
        {
            icon: 'timeline',
            category: 'Forme',
            name: 'Ligne',
            description: 'La ligne est un outil servant à faire des lignes droites' +
                ' joignant des points sur la zone de dessin.',
            usage: 'Pour utiliser la ligne, il suffit d’exécuter un premier' +
                ' clic gauche sur la zone de dessin, de déplacer la souris, puis' +
                ' de cliquer à nouveau. Il est possible de placer une quantité' +
                ' illimitée de points. Pour terminer une ligne, il suffit de' +
                ' faire un double clic, et pour refermer le parcours au point' +
                ' original, vous pouvez effectuer un double clic sur le premier' +
                ' point. Alternativement, vous pouvez enfoncer la touche [SHIFT]' +
                ' du clavier pour que la ligne ait un angle multiple de 45' +
                ' degrés. Les options disponibles sont : la largeur du trait et' +
                ' la couleur (principale uniquement). Il est également possible' +
                ' d\'afficher ou de cacher les les jonctions. À noter: la grosseur' +
                ' des jonctions est également modulable. Raccourci : [L]',
            options: [
                {
                    name: SIZE,
                    label: 'Taille du trait',
                    enabled: true,
                    default: 10,
                    choices: [],
                    min: 1,
                    max: 100,
                    type: OPTION_SLIDER,
                },
                {
                    name: ENABLE_POINTS,
                    label: 'Jonctions visibles',
                    enabled: true,
                    default: false,
                    choices: [],
                    min: undefined,
                    max: undefined,
                    type: OPTION_SLIDE_TOGGLE,
                },
                {
                    name: POINTS_SIZE,
                    label: 'Taille des jonctions',
                    enabled: true,
                    default: 15,
                    choices: [],
                    min: 1,
                    max: 100,
                    type: OPTION_SLIDER,
                },
            ],
        },
        {
            icon: 'crop_square',
            category: 'Forme',
            name: 'Rectangle',
            description: 'Le rectangle est un outil servant à faire des rectangles' +
                ' sur la zone de dessin.',
            usage: 'Pour utiliser le rectangle, il suffit d’exécuter un' +
                ' glissé-déposé sur la zone de dessin avec un clic gauche de la' +
                ' souris. Alternativement, il vous pouvez enfoncer la touche' +
                ' [SHIFT] que la forme affichée soit un carré. Les options' +
                ' disponibles sont : la largeur du trait contour, le type et la' +
                ' couleur (principale et secondaire). Raccourci : [1]',
            options: [
                {
                    name: BORDER_SIZE,
                    label: 'Bordure',
                    enabled: true,
                    default: 10,
                    choices: [],
                    min: 1,
                    max: 100,
                    type: OPTION_SLIDER,
                },
                {
                    name: STYLE,
                    label: 'Type',
                    enabled: true,
                    default: NORMAL,
                    choices: [
                        {
                            label: FULL,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: BORDER,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: NORMAL,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                    ],
                    min: undefined,
                    max: undefined,
                    type: OPTION_SELECT,
                },
            ],
        },
        {
            icon: 'panorama_fish_eye',
            category: 'Forme',
            name: 'Ellipse',
            description: 'L\'ellipse est un outil servant à faire des ellipses' +
                ' sur la zone de dessin.',
            usage: 'Pour utiliser l’ellipse, il suffit d’exécuter un' +
                ' glissé-déposé sur la zone de dessin avec un clic gauche de la' +
                ' souris. Alternativement, il vous pouvez enfoncer la touche' +
                ' [SHIFT] que la forme affichée soit un cercle. Les options' +
                ' disponibles sont : la largeur du trait contour, le type et' +
                ' la couleur (principale et secondaire). Raccourci : [2]',
            options: [
                {
                    name: BORDER_SIZE,
                    label: 'Bordure',
                    enabled: true,
                    default: 10,
                    choices: [],
                    min: 1,
                    max: 100,
                    type: OPTION_SLIDER,
                },
                {
                    name: STYLE,
                    label: 'Type',
                    enabled: true,
                    default: NORMAL,
                    choices: [
                        {
                            label: FULL,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: BORDER,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: NORMAL,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                    ],
                    min: undefined,
                    max: undefined,
                    type: OPTION_SELECT,
                },
            ],
        },
        {
            icon: 'details',
            category: 'Forme',
            name: 'Polygone',
            description: 'Le polygone  est un outil servant à faire des polygones' +
                ' convexes et réguliers avec un nombre de côtés entre 3 et 12 sur' +
                ' la zone de dessin.',
            usage: 'Pour utiliser le polygone, il suffit d’exécuter un' +
                ' glissé-déposé sur la zone de dessin avec un clic gauche de' +
                ' la souris. Alternativement, il vous pouvez enfoncer la touche' +
                ' [SHIFT] que la forme affichée soit un polygone régulier. Les' +
                ' options disponibles sont : la largeur du trait contour, le' +
                ' type, le nombre de côtés et la couleur (principale et' +
                ' secondaire). Raccourci : [3]',
            options: [
                {
                    name: BORDER_SIZE,
                    label: 'Bordure',
                    enabled: true,
                    default: 10,
                    choices: [],
                    min: 1,
                    max: 100,
                    type: OPTION_SLIDER,
                },
                {
                    name: SIZE,
                    label: 'Nombre de côtés',
                    enabled: true,
                    default: 5,
                    choices: [],
                    min: 3,
                    max: 12,
                    type: OPTION_SLIDER,
                },
                {
                    name: STYLE,
                    label: 'Type',
                    enabled: true,
                    default: NORMAL,
                    choices: [
                        {
                            label: FULL,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: BORDER,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: NORMAL,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                    ],
                    min: undefined,
                    max: undefined,
                    type: OPTION_SELECT,
                },
            ],
        },
    ],
    [
        {
            icon: 'crop',
            category: 'Sélection',
            name: 'Rectangle de sélection',
            description: 'La selection est un outil qui permet la manipulation' +
                ' d\'un ou plusieurs objets svg.',
            usage: 'Pour utiliser le rectangle de sélection, il suffit' +
                ' d’exécuter un glissé-déposé sur la zone de dessin avec un' +
                ' clic gauche de la souris. Il n’existe aucune option disponible' +
                ' pour cet outil. Alternativement, il est possible d’utiliser le' +
                ' raccourci [CTRL+A] pour tout sélectionner. Raccourci : [S]',
            options: [],
        },
        {
            icon: undefined,
            category: 'Sélection',
            name: 'Coller',
            description: 'Le collage d\'une selection est un outil qui permet de' +
                ' coller un ou plusieurs objets svg précédemment copiés. En d\'autres' +
                ' mots, il est possible d\'ajouter des éléments copiés précédemment à' +
                ' la zone de dessin.',
            usage: 'Pour coller des éléments, il suffit de sélectionner un ou' +
                ' plusieurs éléments avec un outil de sélection, puis de choisir' +
                ' l\'option dans la barre des outils. Raccourci : [CTRL+V]',
            options: [],
        },
        {
            icon: undefined,
            category: 'Sélection',
            name: 'Copier',
            description: 'La copie d\'une sélection est un outil qui permet de copier' +
                ' un ou plusieurs objets svg.',
            usage: 'Pour copier des éléments, il suffit de sélectionner un ou' +
                ' plusieurs éléments avec un outil de sélection, puis de choisir' +
                ' l\'option dans la barre des outils. Raccourci : [CTRL+C]',
            options: [],
        },
        {
            icon: undefined,
            category: 'Sélection',
            name: 'Couper',
            description: 'La coupe d\'une sélection est un outil qui permet de' +
                ' couper un ou plusieurs objets svg. En d\'autres mots, il est' +
                ' possible de retirer les éléments de la zone de dessin, et de' +
                ' les copier en même temps.',
            usage: 'Pour couper des éléments, il suffit de sélectionner un ou' +
                ' plusieurs éléments avec un outil de sélection, puis de choisir' +
                ' l\'option dans la barre des outils. Raccourci : [CTRL+X]',
            options: [],
        },
        {
            icon: undefined,
            category: 'Sélection',
            name: 'Dupliquer',
            description: 'La duplication d\'une sélection est un outil qui permet' +
                ' de dupliquer un ou plusieurs objets svg. En d\'autres mots, il est' +
                ' possible de créer un double de la sélection.',
            usage: 'Pour dupliquer des éléments, il suffit de sélectionner un ou' +
                ' plusieurs éléments avec un outil de sélection, puis de choisir' +
                ' l\'option dans la barre des outils. Raccourci : [CTRL+D].',
            options: [],
        },
        {
            icon: undefined,
            category: 'Sélection',
            name: 'Supprimer',
            description: 'La suppression d\'une sélection est un outil qui permet' +
                ' de supprimer un ou plusieurs objets svg.',
            usage: 'Pour supprimer des éléments, il suffit de sélectionner un ou' +
                ' plusieurs éléments avec un outil de sélection, puis de choisir' +
                ' l\'option dans la barre des outils. Racourci: [DEL]',
            options: [],
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
            // src: https://www.flaticon.com/free-icon/
            icon: 'local_florist',
            category: 'Autre',
            name: 'Etampe',
            description: 'L\'étampe est un outil qui permet de déposer des images' +
                ' génériques sur la zone de dessin.',
            usage: 'Pour utiliser l\' étampe, il suffit d’exécuter un clic' +
                ' gauche de la souris sur la zone de dessin. Les options' +
                ' disponibles sont : la grosseur de l\'image, l\'angle' +
                ' d\'orientation de l\'étampe en degrés, et le choix de' +
                ' l\'étampe. Raccourci : [D]',
            options: [
                {
                    name: STYLE,
                    label: 'Selection de l\'étampe',
                    enabled: true,
                    default: STAY_AT_HOME,
                    choices: [
                        {
                            label: STAY_AT_HOME,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: HOSPITAL,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: ROBOT,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: DRONE,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                        {
                            label: APPROVED,
                            displayLabel: undefined,
                            icon: undefined,
                        },
                    ],
                    min: undefined,
                    max: undefined,
                    type: OPTION_SELECT,
                },
                {
                    name: SIZE,
                    label: 'Grosseur de l\'Étampe',
                    enabled: true,
                    default: 1,
                    choices: [],
                    min: 1,
                    max: 10,
                    type: OPTION_SLIDER,
                },
                {
                    name: ANGLE,
                    label: 'Angle de rotation',
                    enabled: true,
                    default: 0,
                    choices: [],
                    min: 0,
                    max: 360,
                    type: OPTION_SLIDER,
                },
            ],
        },
        {
            icon: 'compare',
            category: 'Autre',
            name: 'Applicateur de couleur',
            description: 'L\'applicateur de couleur est un outil qui permet de changer' +
                ' la couleur existante sur un élément du canvas.',
            usage: 'Pour utiliser l’applicateur de couleur, il suffit d’exécuter' +
                ' un clic sur un élément du dessin fait avec un autre outil. Un' +
                ' clic gauche changera la couleur principale de l’élément du' +
                ' dessin en dessous du curseur pour la couleur principale' +
                ' sélectionnée. Un clic droit changera la couleur secondaire de' +
                ' l’élément du dessin en dessous du curseur pour la couleur' +
                ' secondaire sélectionnée. Il n’existe aucune option disponible' +
                ' pour cet outil. Raccourci : [R]',
            options: [],
        },
        {
            icon: 'format_paint',
            category: 'Autre',
            name: 'Pot de peinture',
            description: 'Le pot de peinture est un outil qui permet de changer la couleur' +
                ' sur une zone du canvas.',
            usage: 'Pour utiliser le pot de peinture, il suffit d’exécuter un clic' +
                ' gauche sur la zone du dessin à colorer. Un clic changera les couleurs' +
                ' similaires à la zone du dessin en dessous du curseur pour la couleur' +
                ' principale sélectionnée. Les options disponibles sont: la tolérance à' +
                ' la variation de couleur et la couleur (principale uniquement).' +
                ' Raccourci : [B]',
            options: [
                {
                    name: SIZE,
                    label: 'Tolérance',
                    enabled: true,
                    default: 8,
                    choices: [],
                    min: 0,
                    max: 100,
                    type: OPTION_SLIDER,
                },
            ],
        },
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
