# Bonnes pratiques de développement

- Conserver les libellés et l’interface en français.
- Réutiliser les composants et fonctions d’interface existants avant d’en créer de nouveaux.
- Pour toute couleur éditable par l’utilisateur, utiliser par défaut `colorPicker(...)`. Ce sélecteur permet de choisir un rôle du thème ou une couleur personnalisée et conserve le lien avec le thème lorsque l’utilisateur choisit une couleur de la palette.
- Ne recourir à un champ HTML `input[type="color"]` seul que lorsqu’une couleur personnalisée est explicitement requise et qu’un rôle du thème ne doit pas pouvoir être sélectionné.
- Les nouvelles données persistées doivent être normalisées dans `normalise(...)` afin que les anciens plannings restent compatibles.
- Mettre à jour `FORMAT_SAUVEGARDE.md` pour toute modification du format JSON exporté ou importé.
- Vérifier au minimum la syntaxe JavaScript (`node --check planning.js`) après une modification de `planning.js`.
