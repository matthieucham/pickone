Modèle de données
-

Firestore donc NoSQL orienté documents

Entités
--

Utilisateurs
---

Infos complémentaires liées aux utilisateurs

/users: ID = auth uid
+ name


Liste de choix
---

Les utilisateurs peuvent enregistrer des listes d'items qui sont proposés à une élection

/lists: ID = random
+ name String
+ author String user.uid
+ items Array


Election
---

une élection = le choix de quelque chose, où l'on invite ses amis à participer

/picks: ID = random
+ author String user.uid
+ title String
+ description String
+ mode String enum random | majority
+ limit Timestamp
+ choices Array liste des choix possibles
+ openToSuggest Boolean
+ result String résultat du vote, vide au début
+ votes : subcollection ID = user.uid
++ name String name du user qui a voté
++ choices Array

/invites ?

l'auteur peut choisir: 
- tout le monde peut voter du moment qu'il connait la clé
ou
- le vote n'est ouverts qu'aux utilisateurs choisis
