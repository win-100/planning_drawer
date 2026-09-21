# Format de sauvegarde / import JSON

Le bouton **Importer** attend un fichier JSON décrivant **un seul planning**. Il ne faut pas exporter la bibliothèque du navigateur (ni les champs `version`, `plans`, `activePlanId`) : le fichier doit commencer directement par `range`, `layout`, etc.

L'import vérifie uniquement la présence de `range`, de `layout` et d'un tableau `lanes`, puis complète certains tableaux et identifiants manquants. Pour un fichier fiable et facilement maintenable, utilisez toutefois le format complet décrit ci-dessous.

## Exemple minimal valide

Ce fichier peut être enregistré, par exemple, sous `mon-planning.json` puis importé directement.

```json
{
  "range": {
    "start": "2026-01-01",
    "end": "2026-12-31"
  },
  "layout": {
    "width": 1500,
    "left": 86,
    "right": 16,
    "lanesTop": 160,
    "laneGap": 5,
    "lanePaddingBottom": 10,
    "defaultItemHeight": 30
  },
  "monthLocale": "fr-FR",
  "theme": {
    "preset": "ocean",
    "colors": {
      "primary": "#22a79f",
      "primaryStrong": "#147b75",
      "primarySoft": "#c8ece9",
      "secondary": "#5877c8",
      "secondaryStrong": "#385a9f",
      "secondarySoft": "#dfe7f7",
      "accent": "#e8ad72",
      "accentSoft": "#f4cfad",
      "text": "#101820",
      "textSecondary": "#5f6b72",
      "textOnDark": "#ffffff",
      "neutral": "#8c9397",
      "neutralSoft": "#e9edef",
      "surface": "#ffffff",
      "surfaceAlt": "#f7fafa",
      "border": "#cbd4d6",
      "danger": "#ef2d20",
      "warning": "#c96a12",
      "success": "#168f88"
    },
    "appearance": {
      "timelineYear": "@primaryStrong",
      "timelineMonth": "@primary",
      "todayLine": "@danger"
    },
    "timeline": {
      "year": 12,
      "quarter": 13,
      "month": 18,
      "week": 11,
      "day": 10
    },
    "grid": {
      "primary": { "color": "@border", "width": 1.2, "style": "solid" },
      "secondary": { "color": "@neutralSoft", "width": 0.6, "style": "dotted" }
    }
  },
  "itemTypes": {
    "task": {
      "fill": "@surface",
      "stroke": "@primary",
      "strokeWidth": 1.4,
      "shape": "chevron",
      "h": 30,
      "textClass": "task-label"
    }
  },
  "items": [],
  "milestones": [],
  "overlays": [],
  "lanes": [
    {
      "id": "lane-projet",
      "key": "projet",
      "label": ["Projet"],
      "labelColor": "#8c9397",
      "backgroundColor": "#ffffff",
      "backgroundOpacity": 0.2,
      "items": [
        {
          "id": "item-cadrage",
          "label": "Cadrage",
          "start": "2026-01-12",
          "end": "2026-02-13",
          "yOffset": 0,
          "type": "task"
        }
      ],
      "milestones": []
    }
  ]
}
```

## Règles générales

- Le fichier doit être du JSON strict : pas de commentaires, pas de virgule après le dernier élément, et les chaînes doivent être entre guillemets doubles.
- Toutes les dates sont des chaînes au format ISO `AAAA-MM-JJ` (ex. `"2026-09-18"`).
- `range.start` doit être antérieur ou égal à `range.end`. Choisissez une plage couvrant tous les objets, afin qu'ils soient visibles.
- Les identifiants `id` sont des chaînes uniques dans l'ensemble du planning. Ils sont indispensables dès qu'une dépendance ou un positionnement relatif les référence. L'application en génère si nécessaire, mais il est préférable de les fournir.
- Les couleurs personnalisées sont au format hexadécimal `"#RRGGBB"`. Une référence de thème utilise le format `"@primary"` (voir ci-dessous).
- Les valeurs de hauteur, décalage, largeur et marges sont des nombres en pixels ; les opacités sont normalement comprises entre `0` et `1`.

## Objet racine

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `range` | objet | Oui | Période affichée : `start` et `end`. |
| `layout` | objet | Oui | Dimensions et espacements du rendu. Un objet vide est accepté, mais les valeurs par défaut seront utilisées. |
| `lanes` | tableau | Non | Lanes, affichées dans l'ordre du tableau. Par défaut : `[]`. |
| `items` | tableau | Non | Éléments sans lane, affichés au-dessus des lanes. Par défaut : `[]`. |
| `milestones` | tableau | Non | Jalons globaux, affichés au-dessus des lanes. Par défaut : `[]`. |
| `overlays` | tableau | Non | Bandes colorées verticales couvrant la zone des lanes. Par défaut : `[]`. |
| `workCalendar` | objet | Non | Jours travaillés, jours non travaillés supplémentaires et leur affichage. Par défaut : lundi à vendredi, sans exception ni surbrillance. |
| `itemTypes` | objet | Non | Styles partagés des éléments. Le style `task` est ajouté automatiquement s'il est absent. |
| `theme` | objet | Non | Palette du planning. Absente, elle est complétée avec la palette Océan. |
| `monthLocale` | chaîne | Non | Locale des libellés de mois et de trimestres, par exemple `"fr-FR"` ou `"en-US"`. Par défaut : `"fr-FR"`. Les trimestres s’affichent sans année (`T1` en français, `Q1` en anglais). |
| `timeline` | objet | Non | Réglages d’affichage de la frise. |

### `theme`

`preset` peut être `ocean`, `indigo`, `forest`, `sunset` ou `custom`. `colors` est le nuancier : `primary`, `primaryStrong`, `primarySoft`, `secondary`, `secondaryStrong`, `secondarySoft`, `accent`, `accentSoft`, `text`, `textSecondary`, `textOnDark`, `neutral`, `neutralSoft`, `surface`, `surfaceAlt`, `border`, `danger`, `warning` et `success`. `appearance` attribue une de ces couleurs à une partie du rendu. Les frises utilisent les paires `timelineYear` / `timelineYearAlternate`, `timelineQuarter` / `timelineQuarterAlternate`, `timelineMonth` / `timelineMonthAlternate`, `timelineWeek` / `timelineWeekAlternate` et `timelineDay` / `timelineDayAlternate` ; attribuez la même valeur aux deux rôles d’une paire pour désactiver visuellement l’alternance. `timeline` enregistre la taille de police, en pixels, de chaque niveau (`year`, `quarter`, `month`, `week`, `day`) ; elle est limitée de 6 à 48. `timelineFormats` permet de personnaliser un libellé de frise : chaque clé de niveau contient une liste de fragments texte ou de valeurs dynamiques, avec éventuellement `bold` et `italic`. Exemple : `"week": [{ "type": "text", "value": "S", "bold": true }, { "type": "weekNumber", "format": "plain", "bold": true }]`. Les valeurs acceptées sont validées selon le niveau au chargement ; l’éditeur de thème est la manière recommandée de les créer. `grid.primary` et `grid.secondary` définissent chacune la `color`, la `width` (en pixels) et le `style` (`solid`, `dashed` ou `dotted`) d’un quadrillage vertical. Les styles, lanes, jalons, overlays et le fond peuvent eux aussi utiliser un rôle avec `@` : par exemple `"fill": "@secondarySoft"`. Une couleur hexadécimale reste une surcharge indépendante du thème. À l’ouverture, le planning est normalisé vers ces seuls rôles.

### `timeline`

Toutes ces propriétés sont optionnelles. Les valeurs par défaut affichent les années et les mois, avec un quadrillage principal mensuel. Le quadrillage secondaire n’est pas affiché par défaut.

| Champ | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `levels.year` | booléen | `true` | Affiche les années. |
| `levels.quarter` | booléen | `false` | Affiche les trimestres. |
| `levels.month` | booléen | `true` | Affiche les mois. |
| `levels.week` | booléen | `false` | Affiche les semaines. |
| `levels.day` | booléen | `false` | Affiche les jours. |
| `gridPrimaryLevel` | chaîne | `"month"` | Périodicité du quadrillage vertical principal. |
| `gridSecondaryLevel` | chaîne | `""` | Périodicité du quadrillage vertical secondaire ; une chaîne vide le masque. |
| `showTodayLine` | booléen | `true` | Affiche la ligne d’aujourd’hui. |
| `todayLineIncludesTimeline` | booléen | `true` | Lorsque la ligne d’aujourd’hui est affichée, la prolonge sur la frise temporelle. |
| `compactMode` | booléen | `false` | Adapte l’affichage à la période sans modifier les espacements ni les coordonnées enregistrées. Lorsqu’une référence de positionnement est hors période, elle est temporairement remplacée par sa première référence visible ; le plus grand décalage de la chaîne est conservé. Si toute la chaîne est hors période, une ancre virtuelle en haut de lane remplace la référence. |
| `trimEmptyLanes` | booléen | `true` | Mode « Ajuster les lanes au contenu visible » : supprime seulement le vide avant et après le contenu visible d’une lane, et masque les lanes sans objet visible dans la période. Les espacements entre éléments visibles restent inchangés. Exclusif avec `compactMode` depuis l’interface. |
| `backgroundColor` | couleur | `"#ffffff"` | Couleur de fond affichée dans l’éditeur. |
| `backgroundOpacity` | nombre | `0` | Opacité du fond dans les exports SVG et PNG (`0` rend le fond transparent). La couleur reste visible dans l’éditeur pour faciliter le travail. |

### `workCalendar`

`workingDays` est un tableau de numéros de jours JavaScript (`0` pour dimanche, `1` pour lundi, jusqu’à `6` pour samedi) ; sa valeur par défaut est `[1, 2, 3, 4, 5]`. `daysOff` est un tableau d’objets `{ "date": "AAAA-MM-JJ", "label": "…" }`, où `label` est facultatif. `weeklyDaysOffDisplay` et `daysOffDisplay` contiennent chacun `mode` (`none` ou `shade`, avec en plus `hide` pour `weeklyDaysOffDisplay`), `color` (couleur hexadécimale ou rôle de thème tel que `"@neutral"`) et `opacity` (de `0` à `1`).

### `range`

```json
{ "start": "2026-01-01", "end": "2026-12-31" }
```

### `layout`

Toutes ces propriétés sont optionnelles ; les valeurs indiquées sont celles utilisées par défaut.

| Champ | Défaut | Rôle |
| --- | ---: | --- |
| `width` | `1500` | Largeur totale du SVG. |
| `left` | `86` | Marge gauche / zone des libellés de lane. |
| `right` | `16` | Marge droite. |
| `topMonths` | `8` | Marge haute. |
| `yearHeight` | `20` | Hauteur de la frise des années (12 à 120 px). |
| `quarterHeight` | `24` | Hauteur de la frise des trimestres (12 à 120 px). |
| `monthHeight` | `40` | Hauteur de la frise des mois (12 à 120 px). |
| `weekHeight` | `22` | Hauteur de la frise des semaines (12 à 120 px). |
| `dayHeight` | `20` | Hauteur de la frise des jours (12 à 120 px). |
| `timelineTop` | `58` | Position minimale de la frise. |
| `lanesTop` | `160` | Ancien réglage conservé pour compatibilité ; la première lane se place désormais juste sous la timeline, après les éventuels éléments sans lane. |
| `laneGap` | `5` | Espace entre deux lanes. |
| `lanePaddingBottom` | `10` | Espace sous le dernier objet d'une lane. |
| `defaultItemHeight` | `30` | Hauteur par défaut d'un élément. |

`_y` et `_h` ne doivent pas être renseignés : ils sont calculés par l'application à chaque rendu.

## Lanes

```json
{
  "id": "lane-it",
  "key": "it",
  "label": ["IT", "Applications"],
  "labelColor": "#8c9397",
  "backgroundColor": "#ffffff",
  "backgroundOpacity": 0.2,
  "minHeight": 80,
  "paddingTop": 5,
  "paddingBottom": 5,
  "items": [],
  "milestones": []
}
```

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | chaîne | Recommandé | Identifiant unique de la lane. |
| `key` | chaîne | Recommandé | Clé fonctionnelle ; elle sert aussi à générer un `id` si celui-ci est absent. La valeur `"change"` masque le bandeau vertical de la lane. |
| `label` | tableau de chaînes | Recommandé | Une entrée par ligne dans le bandeau vertical. |
| `labelColor` | couleur | Non | Couleur du bandeau vertical. |
| `backgroundColor` | couleur | Non | Couleur de fond de la lane. L'ancien alias `background` est aussi lu. |
| `backgroundOpacity` | nombre | Non | Opacité du fond, défaut `1` lorsqu'un fond est présent. |
| `minHeight` | nombre | Non | Hauteur minimale de la lane ; défaut `80`. |
| `paddingTop` | nombre | Non | Espace minimum entre le haut de la lane et son contenu ; défaut `5`. Un élément en position absolue `0` commence après cet espace. |
| `paddingBottom` | nombre | Non | Espace minimum sous le contenu de la lane ; défaut `5`. |
| `items` | tableau | Non | Éléments temporels de la lane ; défaut `[]`. |
| `milestones` | tableau | Non | Jalons propres à cette lane ; défaut `[]`. |

La hauteur d'une lane est calculée à partir de ses éléments et jalons, sans jamais être inférieure à `minHeight`.

## Éléments de lane (`items`)

Le tableau racine `items` accepte le même format. Ces éléments n'ont pas de lane et sont affichés en haut du planning.

```json
{
  "id": "item-realisation",
  "label": "Réalisation\n& tests",
  "start": "2026-03-02",
  "end": "2026-05-29",
  "yOffset": 35,
  "h": 28,
  "type": "phase",
  "fill": "#c8ece9",
  "textColor": "#101820"
}
```

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `id` | chaîne | Recommandé | Identifiant unique. |
| `label` | chaîne | Recommandé | Libellé ; utilisez `\n` pour un retour à la ligne. |
| `start`, `end` | date | Recommandé* | Début et fin. Ils peuvent être calculés par dépendance (voir plus bas), mais gardez une valeur fixe de secours. |
| `type` | chaîne | Recommandé | Nom d'un style de `itemTypes`. Si le style n'existe pas, l'élément est tout de même rendu avec les valeurs par défaut. |
| `yOffset` | nombre | Non | Décalage depuis le haut de sa zone utile ; dans une lane, celle-ci commence après `paddingTop`. Pour un élément sans lane, elle commence juste sous la timeline (avec l'espacement `laneGap`). Défaut `0`. |
| `h` | nombre | Non | Hauteur. Priorité : valeur de l'élément, puis `itemTypes[type].h`, puis `layout.defaultItemHeight`. |
| `fill`, `fillOpacity`, `stroke`, `strokeWidth`, `strokeDasharray`, `shape`, `cornerRadius`, `bevelSize`, `chevronAngle`, `textColor`, `textClass`, `lineHeight` | divers | Non | Surcharges locales du style partagé. |
| `zOrder` | nombre | Non | Priorité d’affichage dans la même zone : une valeur plus élevée apparaît au premier plan. Il est ajouté automatiquement lorsqu’on utilise les commandes de superposition. |
| `relativeTo`, `yOffsetMode` | chaînes | Non | Positionnement vertical relatif à un autre élément de lane. |
| `dateDependencies`, `dateDurations`, `dateDurationWorkingDays` | objets | Non | Dates calculées à partir d'autres objets ou de la durée. |

Les valeurs possibles de `shape` sont `"chevron"`, `"doubleChevron"` (chevron d’enchaînement avec une encoche au début), `"rect"`, `"roundedRect"` (rectangle à coins arrondis) et `"bevel"` (rectangle à coins biseautés). Avec `"doubleChevron"`, les bords de l’encoche se prolongent légèrement à gauche et sa pointe est décalée de 2 px vers la droite : la pointe de fin du chevron précédent reste visible, sans donner l’impression de passer sous la tâche suivante. `cornerRadius` définit le rayon des coins arrondis, en pixels ; `bevelSize` définit la taille des biseaux, en pixels. `chevronAngle` définit l’angle des pointes des deux formes en chevron, de 30 à 150 degrés (110 par défaut) : il maintient une même inclinaison quelle que soit la hauteur de l’élément. Les valeurs de rayon et de biseau sont ramenées à zéro si elles sont négatives. Toute autre forme donne un rectangle. `strokeDasharray` accepte une valeur SVG telle que `"5 4"`.

### Styles partagés (`itemTypes`)

Les propriétés d'un élément remplacent les propriétés du style de même nom. Exemple :

```json
"itemTypes": {
  "phase": {
    "fill": "#147b75",
    "fillOpacity": 1,
    "stroke": "none",
    "strokeWidth": 0,
    "shape": "rect",
    "h": 28,
    "textColor": "#ffffff",
    "textClass": "item-label",
    "lineHeight": 12
  },
  "task": {
    "fill": "#ffffff",
    "stroke": "#1aa79f",
    "strokeWidth": 1.4,
    "shape": "chevron",
    "h": 30,
    "textClass": "task-label"
  }
}
```

## Jalons

Les jalons globaux se placent dans `milestones` à la racine. Les jalons d'une lane se placent dans `lanes[n].milestones`.

```json
{
  "id": "milestone-go-live",
  "date": "2026-09-01",
  "title": ["Go-live", "phase 1"],
  "sub": ["France"],
  "yOffset": 0,
  "color": "#ef2d20",
  "shape": "diamond",
  "size": 24,
  "showVerticalLine": true,
  "verticalLineIncludesTimeline": true,
  "lineColor": "#ef2d20",
  "lineWidth": 2,
  "lineStyle": "dashed"
}
```

| Type de jalon | Libellé | Champs communs |
| --- | --- | --- |
| Global | `title` : tableau de chaînes | `id`, `date`, `color`, `yOffset`, optionnellement `sub` (tableau de sous-libellés), `shape`, `size` et `zOrder`. |
| Dans une lane | `label` : chaîne (les `\n` sont acceptés) | `id`, `date`, `color`, `yOffset`, optionnellement `shape`, `size` et `zOrder`. |

`shape` peut être `star` (valeur par défaut), `circle`, `square`, `diamond`, `plus` ou `multiply`. `size` est la taille du symbole en pixels, entre 8 et 80 (18 par défaut). Activez `showVerticalLine` pour tracer une ligne verticale sur toute la hauteur du planning à la date du jalon. `verticalLineIncludesTimeline` (par défaut `true`) la prolonge sur la frise temporelle ; sinon elle commence sous celle-ci. `lineColor` (par défaut, la couleur du jalon), `lineWidth` (1 à 12 px, 2 par défaut) et `lineStyle` (`solid`, `dashed` ou `dotted`) en définissent l’apparence.

## Overlays

Un overlay est une bande verticale colorée derrière les lanes.

```json
{
  "id": "overlay-recette",
  "label": "Recette",
  "start": "2026-06-01",
  "end": "2026-06-30",
  "color": "#f59e0b",
  "opacity": 0.18
}
```

`label` est conservé mais n'est pas affiché dans le rendu actuel. `start`, `end`, `color` et `opacity` sont les propriétés utiles.

## Dépendances avancées

Ces mécanismes sont facultatifs. Les références doivent viser un objet ayant un `id` unique : élément, jalon global, jalon de lane ou overlay.

### Dates relatives

`dateDependencies` permet de calculer une date depuis une date d'un autre objet. `dateKey` vaut `"start"`, `"end"` ou `"date"` selon l'objet ciblé ; `offsetDays` est un nombre de jours (négatif accepté). Par défaut, le décalage est exprimé en jours ouvrés : il respecte les jours travaillés et les jours fériés configurés dans `workCalendar`. Définissez `"workingDays": false` pour compter tous les jours calendaires.

```json
{
  "id": "item-tests",
  "label": "Tests",
  "start": "2026-06-01",
  "end": "2026-06-12",
  "type": "task",
  "dateDependencies": {
    "start": { "objectId": "item-realisation", "dateKey": "end", "offsetDays": 1, "workingDays": true }
  }
}
```

Ici `start` est recalculé au jour ouvré suivant la fin de `item-realisation`. La valeur fixe de `start` reste le repli si la cible n'est pas trouvée ou si une boucle est détectée.

`dateDurations` lie les deux bornes d'un élément ou d'un overlay. Il contient une durée en jours sous la clé de la date à calculer. Les jours ouvrés sont utilisés par défaut ; `dateDurationWorkingDays` permet de choisir le mode pour chaque borne (`false` compte tous les jours calendaires) :

```json
"dateDurations": { "end": 10 },
"dateDurationWorkingDays": { "end": true }
```

Dans cet exemple, `end` vaut dix jours après `start`. N'utilisez pas simultanément une dépendance et une durée pour une même clé.

### Position verticale relative (éléments et jalons)

Pour un élément ou un jalon, `relativeTo` doit désigner l'`id` d'un `item` ou d'un jalon de la même lane. `yOffsetMode` accepte :

- `"below"` : sous l'élément de référence ;
- `"center"` : centré verticalement sur lui ;
- `"align"` : aligné sur son haut ;
- `"absolute"` (ou absent) : `yOffset` est mesuré depuis le haut de la zone utile de la lane, après `paddingTop` ; `relativeTo` est alors ignoré.

`yOffset` reste un décalage supplémentaire dans tous les modes. Évitez les références circulaires.

## Procédure d'import

1. Enregistrez le contenu au format UTF-8 avec l'extension `.json`.
2. Dans l'application, cliquez sur **Importer** et choisissez le fichier.
3. Donnez un nom au planning importé lorsque l'application le demande.
4. Cliquez sur **Enregistrer** si vous avez annulé l'étape de nommage ou si vous modifiez ensuite le planning.

Pour obtenir un modèle exact d'un planning existant, utilisez **Exporter → Données**, puis modifiez le fichier téléchargé.
