# Génération de Planning visuel avec un fichier HTML simple

Fichiers :
- `index.html` : structure de la page
- `planning.js` : calcul et rendu SVG
- `styles.css` : styles

## Lancer le planning

Il suffit de **double-cliquer sur `index.html`**. Aucun serveur local ni Python n'est nécessaire.

## Gérer les plannings

L’application s’ouvre toujours sur un **planning vide** lorsqu’aucun planning n’est chargé. Les données de démonstration ne font plus partie de l’application.

La barre d’outils regroupe les actions de gestion des plannings dans le navigateur utilisé :

- **Ouvrir** réunit **Nouveau**, **Charger** et **Importer** ;
- le nom du planning ouvert apparaît en haut à gauche ; utilisez le crayon pour le renommer ;
- **Planning courant** réunit **Enregistrer**, qui mémorise les modifications du planning actif (un nom est demandé pour un planning qui n’est pas encore enregistré), puis **Supprimer**, qui efface le planning actuellement ouvert de la mémoire de ce navigateur. Les fichiers JSON exportés ne sont pas concernés.

**Importer** ouvre un fichier JSON, demande un nom, puis l’ajoute à la liste des plannings. L’export **Données** reste le moyen de déplacer ou d’archiver un planning hors du navigateur.

Le format complet d’un fichier importable est documenté dans [FORMAT_SAUVEGARDE.md](FORMAT_SAUVEGARDE.md).

## Ajouter un objet

Le bouton **+ Ajouter** ouvre un menu unique pour créer une lane, un élément, un jalon global ou un overlay. L’objet créé est immédiatement sélectionné afin de le nommer et de régler ses dates dans le panneau latéral.

Pour le cas le plus courant, un **double-clic dans une zone vide d’une lane** crée un élément à la date et à la hauteur cliquées. Depuis le menu, un élément est créé sans lane et s’affiche en haut du planning. Son panneau d’édition permet ensuite de l’affecter à une lane, ou de le laisser sans lane.

## Supprimer un objet

Chaque panneau d’édition comporte un bouton **Supprimer**. Une confirmation détaille le contenu supprimé d’une lane et les dépendances concernées. Les objets qui dépendent d’un objet supprimé sont automatiquement rebranchés sur sa référence de base, avec les offsets cumulés. Une valeur fixe n’est utilisée que lorsqu’il n’existe plus de référence de base survivante.

## Frises et quadrillage

La barre d'outils permet d'afficher ou masquer les années, trimestres, mois et semaines. Ils s'affichent toujours dans cet ordre. Le menu « Quadrillage vertical » ne propose que les frises visibles et détermine la périodicité des lignes verticales. Dans « Langue des libellés », choisissez le français ou l’anglais : les mois, trimestres et semaines s’adaptent (par exemple `T1` / `S32` en français et `Q1` / `W32` en anglais).

Les données sont contenues dans les plannings enregistrés dans le navigateur ou dans les fichiers JSON importés/exportés.

## Types et éléments

Les éléments peuvent être placés dans le tableau racine `items`, sans lane : ils s’affichent toujours en haut du planning. Chaque lane contient également son propre tableau `items` ; il n'y a plus de distinction entre phases et tâches.

Les styles réutilisables sont définis dans `planningData.itemTypes`. Un élément choisit son style avec `type` ; un type peut définir `fill`, `fillOpacity`, `stroke`, `strokeWidth`, `strokeDasharray`, `shape` (`chevron` ou `rect`), `h`, `textColor` et `textClass`.

## Thèmes de couleurs

Le menu **Thème** propose des palettes prêtes à l’emploi et le bouton **Personnaliser** donne accès aux rôles de couleur (principale, déclinaisons claire/foncée, accent, texte, grille, etc.). Le thème fait partie des données du planning : il est donc conservé par l’enregistrement local et par les exports JSON.

Les styles partagés peuvent référencer un rôle du thème avec une valeur telle que `"@primary"`, `"@primarySoft"` ou `"@accent"`. Ces styles suivent alors tout changement de palette. Une valeur hexadécimale, par exemple `"#e11d48"`, est volontairement une **surcharge locale** : elle est conservée au changement de thème. Dans l’éditeur de style, « Fond lié au thème » permet de lier le fond d’un style partagé à l’un de ces rôles ; le sélecteur de couleur classique permet de le délier et de personnaliser cette couleur.

Chaque élément peut définir `h` ou `yOffset` lorsqu'il a besoin d'une taille ou d'une position particulière. Sinon, il reprend `h` de son type, puis `layout.defaultItemHeight`.

## Hauteur et position des lanes

Il ne faut pas renseigner `y` ni `h` sur les lanes. La hauteur est calculée à partir du point le plus bas de ses éléments (`yOffset + h`) puis `lanePaddingBottom` est ajouté. La lane suivante commence `laneGap` pixels plus bas (5 px actuellement).
