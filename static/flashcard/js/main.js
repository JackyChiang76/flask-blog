const words = [
    { "French": "homme", "English": "man" }, { "French": "femme", "English": "woman" },
    { "French": "jour", "English": "day" }, { "French": "temps", "English": "time" },
    { "French": "chose", "English": "thing" }, { "French": "vie", "English": "life" },
    { "French": "monde", "English": "world" }, { "French": "enfant", "English": "child" },
    { "French": "œil", "English": "eye" }, { "French": "année", "English": "year" },
    { "French": "personne", "English": "person" }, { "French": "père", "English": "father" },
    { "French": "mère", "English": "mother" }, { "French": "fille", "English": "girl" },
    { "French": "garçon", "English": "boy" }, { "French": "frère", "English": "brother" },
    { "French": "sœur", "English": "sister" }, { "French": "ami", "English": "friend" },
    { "French": "famille", "English": "family" }, { "French": "nom", "English": "name" },
    { "French": "pays", "English": "country" }, { "French": "mot", "English": "word" },
    { "French": "amour", "English": "love" }, { "French": "travail", "English": "work" },
    { "French": "problème", "English": "problem" }, { "French": "argent", "English": "money" },
    { "French": "eau", "English": "water" }, { "French": "ville", "English": "city" },
    { "French": "rue", "English": "street" }, { "French": "nuit", "English": "night" },
    { "French": "matin", "English": "morning" }, { "French": "soir", "English": "evening" },
    { "French": "journée", "English": "day" }, { "French": "semaine", "English": "week" },
    { "French": "mois", "English": "month" }, { "French": "heure", "English": "hour" },
    { "French": "minute", "English": "minute" }, { "French": "histoire", "English": "history" },
    { "French": "idée", "English": "idea" }, { "French": "droit", "English": "right" },
    { "French": "place", "English": "place" }, { "French": "livre", "English": "book" },
    { "French": "chambre", "English": "bedroom" }, { "French": "voiture", "English": "car" },
    { "French": "école", "English": "school" }, { "French": "maison", "English": "house" },
    { "French": "porte", "English": "door" }, { "French": "fenêtre", "English": "window" },
    { "French": "lit", "English": "bed" }, { "French": "table", "English": "table" },
    { "French": "chaise", "English": "chair" }, { "French": "papier", "English": "paper" },
    { "French": "stylo", "English": "pen" }, { "French": "cœur", "English": "heart" },
    { "French": "corps", "English": "body" }, { "French": "main", "English": "hand" },
    { "French": "tête", "English": "head" }, { "French": "visage", "English": "face" },
    { "French": "pied", "English": "foot" }, { "French": "bras", "English": "arm" },
    { "French": "dos", "English": "back" }, { "French": "chien", "English": "dog" },
    { "French": "chat", "English": "cat" }, { "French": "oiseau", "English": "bird" },
    { "French": "cheval", "English": "horse" }, { "French": "poisson", "English": "fish" },
    { "French": "arbre", "English": "tree" }, { "French": "fleur", "English": "flower" },
    { "French": "soleil", "English": "sun" }, { "French": "lune", "English": "moon" },
    { "French": "ciel", "English": "sky" }, { "French": "mer", "English": "sea" },
    { "French": "terre", "English": "earth" }, { "French": "feu", "English": "fire" },
    { "French": "pain", "English": "bread" }, { "French": "vin", "English": "wine" },
    { "French": "fromage", "English": "cheese" }, { "French": "lait", "English": "milk" },
    { "French": "viande", "English": "meat" }, { "French": "pomme", "English": "apple" },
    { "French": "café", "English": "coffee" }, { "French": "thé", "English": "tea" },
    { "French": "bureau", "English": "office" }, { "French": "train", "English": "train" },
    { "French": "affaire", "English": "case" }, { "French": "type", "English": "type" },
    { "French": "côté", "English": "side" }, { "French": "pouvoir", "English": "power" },
    { "French": "point", "English": "point" }, { "French": "suite", "English": "sequence" },
    { "French": "loi", "English": "law" }, { "French": "force", "English": "strength" },
    { "French": "guerre", "English": "war" }, { "French": "paix", "English": "peace" },
    { "French": "image", "English": "image" }, { "French": "campagne", "English": "countryside" },
    { "French": "champ", "English": "field" }, { "French": "jardin", "English": "garden" },
    { "French": "mur", "English": "wall" }, { "French": "route", "English": "road" },
    { "French": "avion", "English": "plane" }, { "French": "bateau", "English": "boat" },
    { "French": "velo", "English": "bike" }, { "French": "sac", "English": "bag" },
    { "French": "vetement", "English": "clothing" }, { "French": "chaussure", "English": "shoe" },
    { "French": "chapeau", "English": "hat" }, { "French": "lunettes", "English": "glasses" },
    { "French": "gant", "English": "glove" }, { "French": "diner", "English": "dinner" },
    { "French": "dejeuner", "English": "lunch" }, { "French": "petitdejeuner", "English": "breakfast" },
    { "French": "sel", "English": "salt" }, { "French": "sucre", "English": "sugar" },
    { "French": "huile", "English": "oil" }, { "French": "beurre", "English": "butter" },
    { "French": "oeuf", "English": "egg" }, { "French": "legume", "English": "vegetable" },
    { "French": "fruit", "English": "fruit" }, { "French": "banane", "English": "banana" },
    { "French": "orange", "English": "orange" }, { "French": "citron", "English": "lemon" },
    { "French": "fraise", "English": "strawberry" }, { "French": "pain", "English": "bread" },
    { "French": "gateau", "English": "cake" }, { "French": "biscuite", "English": "cookie" },
    { "French": "plat", "English": "dish" }, { "French": "assiette", "English": "plate" },
    { "French": "verre", "English": "glass" }, { "French": "tasse", "English": "cup" },
    { "French": "fourchette", "English": "fork" }, { "French": "cuillere", "English": "spoon" },
    { "French": "couteau", "English": "knife" }, { "French": "serviette", "English": "napkin" },
    { "French": "ecran", "English": "screen" }, { "French": "clavier", "English": "keyboard" },
    { "French": "souris", "English": "mouse" }, { "French": "telephone", "English": "phone" },
    { "French": "radio", "English": "radio" }, { "French": "musique", "English": "music" },
    { "French": "film", "English": "movie" }, { "French": "theatre", "English": "theater" },
    { "French": "art", "English": "art" }, { "French": "peinture", "English": "painting" },
    { "French": "dessin", "English": "drawing" }, { "French": "sport", "English": "sport" },
    { "French": "match", "English": "game" }, { "French": "joueur", "English": "player" },
    { "French": "equipe", "English": "team" }, { "French": "ballon", "English": "ball" },
    { "French": "ecole", "English": "school" }, { "French": "classe", "English": "class" },
    { "French": "professeur", "English": "teacher" }, { "French": "etudiant", "English": "student" },
    { "French": "cahier", "English": "notebook" }, { "French": "page", "English": "page" },
    { "French": "stylo", "English": "pen" }, { "French": "crayon", "English": "pencil" },
    { "French": "gomme", "English": "eraser" }, { "French": "regle", "English": "ruler" },
    { "French": "salle", "English": "room" }, { "French": "couloir", "English": "hall" },
    { "French": "fenetre", "English": "window" }, { "French": "porte", "English": "door" },
    { "French": "escalier", "English": "stairs" }, { "French": "ascenseur", "English": "elevator" },
    { "French": "jardin", "English": "garden" }, { "French": "parking", "English": "parking" },
    { "French": "hopital", "English": "hospital" }, { "French": "pharmacie", "English": "pharmacy" },
    { "French": "magasin", "English": "shop" }, { "French": "banque", "English": "bank" },
    { "French": "poste", "English": "post" }, { "French": "station", "English": "station" },
    { "French": "gare", "English": "station" }, { "French": "arret", "English": "stop" },
    { "French": "taxi", "English": "taxi" }, { "French": "bus", "English": "bus" },
    { "French": "velo", "English": "bike" }, { "French": "moto", "English": "motorcycle" },
    { "French": "rue", "English": "street" }, { "French": "place", "English": "square" },
    { "French": "quartier", "English": "district" }, { "French": "village", "English": "village" },
    { "French": "capitale", "English": "capital" }
];

let currentIndex = 0;

function lastWord() {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    updateCard();
}

function nextWord() {
    currentIndex = (currentIndex + 1) % words.length;
    updateCard();
}

function updateCard() {
    const card = document.getElementById('card');
    card.classList.remove('flipped');

    setTimeout(() => {
        document.getElementById('french').innerText = words[currentIndex].French;
        document.getElementById('english').innerText = words[currentIndex].English;
    }, 200);
}

document.getElementById('card').addEventListener('click', function() {
    this.classList.toggle('flipped');
});

updateCard();