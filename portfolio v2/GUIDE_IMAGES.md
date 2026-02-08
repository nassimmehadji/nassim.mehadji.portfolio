# 📸 Guide pour ajouter tes images et vidéos

## Structure des dossiers recommandée

```
portfolio/
├── index.html
├── projets.html
├── ...
├── images/          ← Crée ce dossier
│   ├── canneo.jpg
│   ├── valmore.jpg
│   ├── chaufelec.jpg
│   └── bouge-ton-talent.jpg
└── videos/          ← Optionnel
    └── bouge-ton-talent.mp4
```

## Comment ajouter une image à un projet

### Étape 1 : Prépare tes images
- Fais des captures d'écran de tes projets
- Enregistre-les dans un dossier `images/` à la racine
- Nomme-les clairement : `canneo.jpg`, `valmore.jpg`, etc.
- Format recommandé : **JPG** ou **PNG**
- Taille optimale : **1600x1000px** (ratio 16:10)

### Étape 2 : Remplace les placeholders

Dans `projets.html`, trouve les blocs avec :
```html
<div class="project-media-placeholder">
    <i class="fa-solid fa-image"></i>
    <p>Ajoute une capture d'écran...</p>
</div>
```

Remplace par :
```html
<img src="images/canneo.jpg" alt="Site Canneo">
```

## Exemples complets

### Pour le projet Canneo :
```html
<div class="project-media">
    <img src="images/canneo.jpg" alt="Site Canneo - Canne connectée">
</div>
```

### Pour le projet Valmoré :
```html
<div class="project-media">
    <img src="images/valmore.jpg" alt="Site Valmoré - E-commerce montres de luxe">
</div>
```

### Pour le projet Chaufelec :
```html
<div class="project-media">
    <img src="images/chaufelec.jpg" alt="Site Chaufelec - Chauffage et électricité">
</div>
```

### Pour Bouge Ton Talent (avec vidéo) :
```html
<div class="project-media">
    <video controls>
        <source src="videos/bouge-ton-talent.mp4" type="video/mp4">
        Votre navigateur ne supporte pas la vidéo.
    </video>
</div>
```

### OU avec une image :
```html
<div class="project-media">
    <img src="images/bouge-ton-talent.jpg" alt="Projet Bouge Ton Talent">
</div>
```

## Optimisation des images

### Avant de les ajouter :
1. **Redimensionne** : 1600x1000px ou 1920x1200px max
2. **Compresse** : Utilise [TinyPNG](https://tinypng.com) ou [Squoosh](https://squoosh.app)
3. **Format** : JPG pour les photos, PNG pour les captures avec texte

### Outils gratuits :
- **Redimensionner** : [Birme](https://www.birme.net)
- **Compresser** : [TinyPNG](https://tinypng.com)
- **Éditer** : [Photopea](https://www.photopea.com) (gratuit, comme Photoshop)

## Ajouter une image d'arrière-plan

Si tu veux une image de fond sur la page d'accueil :

```html
<section class="hero-full" style="background-image: url('images/hero-bg.jpg'); background-size: cover; background-position: center;">
```

## Vidéos : bonnes pratiques

### Format recommandé :
- **MP4** (le plus compatible)
- **Codec** : H.264
- **Résolution** : 1920x1080px max
- **Taille** : < 10 MB

### Compresser une vidéo :
- [Handbrake](https://handbrake.fr) (gratuit, desktop)
- [Clideo](https://clideo.com/compress-video) (en ligne)

### Code pour vidéo en autoplay silencieux :
```html
<video autoplay muted loop playsinline>
    <source src="videos/demo.mp4" type="video/mp4">
</video>
```

## Checklist finale ✅

- [ ] Créer le dossier `images/` à la racine
- [ ] Ajouter tes captures d'écran optimisées
- [ ] Remplacer les placeholders dans `projets.html`
- [ ] Vérifier que les chemins sont corrects (`images/nomfichier.jpg`)
- [ ] Tester en ouvrant `projets.html` dans un navigateur

## Astuces

### Pour faire de belles captures d'écran :
1. Utilise **Firefox** ou **Chrome** en plein écran
2. Masque les barres de navigation (F11)
3. Utilise l'extension **Awesome Screenshot** pour capturer toute la page
4. Ou utilise [Screely](https://screely.com) pour ajouter un mockup de navigateur

### Alternative : mockups de navigateur
Tu peux ajouter des bordures de navigateur à tes captures avec :
- [Screely](https://screely.com)
- [Screenshot.rocks](https://screenshot.rocks)

---

**Note** : Les placeholders resteront visibles jusqu'à ce que tu ajoutes tes vraies images. C'est normal et c'est pour te guider !
