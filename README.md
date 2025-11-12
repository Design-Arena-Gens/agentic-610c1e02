# Sentinel Guardian Ops

Plateforme Next.js prête pour Vercel qui orchestre une IA autonome chargée de surveiller et traiter les tickets du panneau d’administration Safe Guardian. L’application propose une vue d’ensemble des métriques temps réel, la gestion de la file d’attente et un moteur de réponse automatique configurable.

## ✨ Fonctionnalités clefs
- Tableau de bord temps réel : métriques SLA, précision, débit et historique des évènements.
- File intelligente : tri par priorité, contexte client détaillé, temps d’attente calculé.
- Agent autonome : génération de réponses contextualisées, plan d’actions structurés, traçabilité complète.
- API agnostique : connecteurs configurables via variables d’environnement, mode maquette local pour tests.
- Compatible Vercel : build Next.js 14, React Server Components, Tailwind CSS, React Query.

## 🚀 Démarrage
```bash
npm install
npm run dev
# puis ouvrir http://localhost:3000
```

### Build et analyse
```bash
npm run build   # build production + lint + type-check
npm run lint    # lint seul
```

## ⚙️ Configuration
Les variables peuvent être définies dans `.env.local` (ou via Vercel) :

| Variable | Description |
|----------|-------------|
| `PANEL_BASE_URL` | URL de base du panneau Safe Guardian (défaut : `https://safe-guardian-ai-1a4c12be.base44.app`) |
| `PANEL_REQUESTS_ENDPOINT` | Endpoint relatif pour récupérer les tickets (`/adminpanel/api/requests` par défaut) |
| `PANEL_RESPONSE_ENDPOINT` | Endpoint relatif pour envoyer les résolutions (`/adminpanel/api/respond` par défaut) |
| `PANEL_API_TOKEN` | Jeton bearer si l’API distante en requiert un |

Sans configuration distante, l’application bascule automatiquement sur des données maquettes persistées en mémoire pour permettre les tests.

## 🧠 Architecture
- **UI** : Next.js + Tailwind, composants server/client, React Query pour le polling.
- **Agent** : moteur maison (`lib/agent.ts`) s’appuyant sur une base de connaissances sectorielle et un calcul de confiance.
- **Connecteur** : `lib/panel-client.ts` gère la récupération et l’injection des tickets, avec fallback maquette.
- **État global** : `lib/state.ts` conserve métriques et flux d’évènements (persistance en mémoire côté serveur).

## 🛡️ Notes déploiement
- Tester localement (`npm run build`) avant `vercel deploy`.
- Prévoir les variables d’environnement ci-dessus dans Vercel.
- Le mode maquette reste disponible sur l’environnement de production si l’API distante est injoignable.

---
Projet généré automatiquement pour automatiser le support Safe Guardian. Ajustez la base de connaissances et les connecteurs selon vos processus.*** End Patch
