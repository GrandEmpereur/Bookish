# 📚 Bookish - Plateforme Sociale de Lecture

<div align="center">
  <img src="public/cover/Ios.jpg" alt="Bookish Logo" width="200" style="padding: 30px 0;"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-7.0-blue)](https://capacitorjs.com/)
  [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
</div>

## 🎯 Introduction

**Bookish** est une plateforme sociale dédiée à la lecture qui permet aux utilisateurs de découvrir, discuter, partager et organiser leurs lectures dans une communauté passionnée de littérature.

Ce projet a été développé dans le cadre de l'axe **Coding & Digital Innovation** de la promotion 2023-2025 à l'**IIM Digital School**, avec pour objectif de créer une application complète alliant développement web moderne et expérience utilisateur optimale.

## ✨ Fonctionnalités Principales

### 📖 Gestion de Bibliothèque

- **Bibliothèque personnelle** : Créez et organisez votre collection de livres
- **Suivi de lecture** : Marquez vos livres comme lus, en cours ou à lire
- **Notes et critiques** : Rédigez vos propres critiques et notes de lecture
- **Objectifs de lecture** : Fixez-vous des défis et suivez vos progrès

### 👥 Aspect Social

- **Feed communautaire** : Découvrez les activités de vos amis lecteurs
- **Clubs de lecture** : Rejoignez ou créez des clubs thématiques
- **Discussions** : Participez à des conversations autour de vos livres favoris
- **Système de suivi** : Suivez d'autres lecteurs et leurs recommandations

### 🔍 Découverte

- **Recherche avancée** : Trouvez des livres par genre, auteur, popularité
- **Recommandations personnalisées** : Algorithme intelligent basé sur vos goûts
- **Classements** : Explorez les tendances et les best-sellers
- **Notifications** : Restez informé des nouveautés et activités

### 📊 Analytics & Profil

- **Statistiques de lecture** : Visualisez vos habitudes et progrès
- **Profil personnalisable** : Présentez votre passion pour la lecture
- **Badges et récompenses** : Système de gamification motivant

## 🛠️ Stack Technique

### Frontend

- **Framework** : Next.js 15 avec App Router
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **État** : React Context + React Query
- **Animations** : Framer Motion

### Backend

- **API** : AdonisJS (API REST)
- **Runtime** : Node.js 20
- **Base de données** : Supabase (PostgreSQL)
- **Containerisation** : Docker

### Mobile

- **Framework Hybride** : Capacitor
- **Plateforme** : iOS uniquement
- **Distribution** : iOS App Store

### DevOps & Outils

- **Hébergement** : Vercel (Frontend) + Heroku (Backend)
- **Package Manager** : Bun
- **Contrôle de version** : Git
- **CI/CD** : GitHub Actions
- **Monitoring** : Sentry
- **Analytics** : Vercel Analytics
- **Tests** : Jest (tests unitaires)
- **Qualité de code** : ESLint + Prettier

## 🚀 Installation et Développement

### Prérequis

- Node.js 20+
- Bun (package manager)
- Git
- Docker (pour le backend)

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/bookish.git
cd bookish

# Installer les dépendances avec Bun
bun install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les variables nécessaires dans .env.local

# Lancer le serveur de développement
bun dev
```

### Développement Mobile (iOS)

```bash
# Construire l'application
bun run build

# Synchroniser avec Capacitor
bunx cap sync

# Lancer sur iOS (nécessite Xcode)
bunx cap run ios
```

### Scripts Disponibles

```bash
bun dev          # Serveur de développement
bun build        # Build de production
bun start        # Serveur de production
bun lint         # Linting avec ESLint
bun test         # Tests unitaires avec Jest
bun format       # Formatage avec Prettier
```

## 📁 Structure du Projet

```
Bookish/
├── .env.example
├── .gitignore
├── README.md
├── bun.lock
├── capacitor.config.ts
├── components.json
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
    ├── Bookish-Logo-2.svg
    ├── Bookish.svg
    ├── Bookish2.svg
    ├── file.svg
    ├── globe.svg
    ├── icons
    │   ├── Icons black-1.svg
    │   └── bell.svg
    ├── img
    │   ├── Page de confirmation.pdf
    │   ├── img_cate.png
    │   ├── logo_green.png
    │   ├── meal.jpg
    │   ├── memoji1.jpeg
    │   ├── memoji2.jpg
    │   ├── memoji3.png
    │   ├── onboarding
    │   │   ├── presentation1.png
    │   │   ├── presentation2.png
    │   │   └── presentation3.png
    │   └── onbordingRegisterSetp
    │   │   ├── Book_Lover.png
    │   │   ├── Bookshelves_design.png
    │   │   └── Notebook_Design.png
    ├── leaderboard.svg
    ├── manifest 2.json
    ├── manifest.json
    ├── next.svg
    ├── onboarding
    │   ├── step1.jpg
    │   ├── step2.png
    │   └── step3.png
    ├── underline.svg
    ├── vercel.svg
    └── window.svg
├── sentry.edge.config.ts
├── sentry.server.config.ts
├── src
    ├── app
    │   ├── (app)
    │   │   ├── clubs
    │   │   │   ├── [clubId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── create
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── feed
    │   │   │   ├── [postId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── create
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx
    │   │   ├── library
    │   │   │   ├── [id]
    │   │   │   │   ├── add-book
    │   │   │   │   │   └── page.tsx
    │   │   │   │   ├── edit
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── create
    │   │   │   │   └── page.tsx
    │   │   │   └── page.tsx
    │   │   ├── notifications
    │   │   │   └── page.tsx
    │   │   ├── privacy
    │   │   │   └── page.tsx
    │   │   ├── profile
    │   │   │   ├── [userId]
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── settings
    │   │   │   │   └── page.tsx
    │   │   │   └── suivie
    │   │   │   │   ├── classements
    │   │   │   │       └── page.tsx
    │   │   │   │   ├── objectifs
    │   │   │   │       └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   └── search
    │   │   │   └── page.tsx
    │   ├── api
    │   │   └── sentry-example-api
    │   │   │   └── route.ts
    │   ├── auth
    │   │   ├── forgot-password
    │   │   │   ├── page.tsx
    │   │   │   ├── reset
    │   │   │   │   └── page.tsx
    │   │   │   └── verify
    │   │   │   │   └── page.tsx
    │   │   ├── login
    │   │   │   └── page.tsx
    │   │   └── register
    │   │   │   ├── genres
    │   │   │       └── page.tsx
    │   │   │   ├── habits
    │   │   │       └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── purpose
    │   │   │       └── page.tsx
    │   │   │   └── verification
    │   │   │       └── page.tsx
    │   ├── global-error.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── onboarding
    │   │   └── page.tsx
    │   └── page.tsx
    ├── components
    │   ├── book-list-detail.tsx
    │   ├── book
    │   │   └── book-list-detail.tsx
    │   ├── club
    │   │   └── club-details.tsx
    │   ├── comments
    │   │   └── comments-section.tsx
    │   ├── layout
    │   │   ├── bottom-bar.tsx
    │   │   └── top-bar.tsx
    │   ├── leaderboard
    │   │   └── LeaderboardComponent.tsx
    │   ├── library
    │   │   ├── search-dialog.tsx
    │   │   └── search-drawer.tsx
    │   ├── post
    │   │   └── post-details.tsx
    │   ├── ui
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── camera-selector.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── floating-action-button.tsx
    │   │   ├── form.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    │   └── user
    │   │   └── user-details.tsx
    ├── config
    │   ├── mock-data.ts
    │   └── navigation.ts
    ├── contexts
    │   └── auth-context.tsx
    ├── hooks
    │   ├── use-api.ts
    │   ├── use-auth-guard.ts
    │   ├── use-camera.ts
    │   ├── use-debounce.ts
    │   └── use-mobile.ts
    ├── instrumentation-client.ts
    ├── instrumentation.ts
    ├── lib
    │   ├── api-client.ts
    │   ├── utils.ts
    │   └── validations
    │   │   ├── auth.ts
    │   │   ├── book-list.ts
    │   │   ├── club.ts
    │   │   ├── message.ts
    │   │   ├── notification.ts
    │   │   ├── post.ts
    │   │   └── user.ts
    ├── services
    │   ├── auth.service.ts
    │   ├── book-list.service.ts
    │   ├── book.service.ts
    │   ├── club.service.ts
    │   ├── comment.service.ts
    │   ├── favorite.service.ts
    │   ├── like.service.ts
    │   ├── message.service.ts
    │   ├── notification.service.ts
    │   ├── post.service.ts
    │   ├── search.service.ts
    │   └── user.service.ts
    └── types
    │   ├── api.ts
    │   ├── authTypes.ts
    │   ├── bookListTypes.ts
    │   ├── bookTypes.ts
    │   ├── clubTypes.ts
    │   ├── messagerieTypes.ts
    │   ├── notificationTypes.ts
    │   ├── postTypes.ts
    │   ├── searchTypes.ts
    │   └── userTypes.ts
└── tsconfig.json
```

## 👥 Équipe de Développement

### Maîtrise d'Œuvre

- **Benjamin AMRAM** - Product Owner
- **Sizley ANTILE** - Chef de projet
- **Alya BEN AHMED** - Scrum Master

### Équipe Technique

- **Patrick BARTOSIK** - Dev Leader & Développeur Backend
- **Youssef CHARAFEDDINE** - Développeur Frontend
- **Enas ELMERSHATI** - UI/UX Designer & Développeur Frontend
- **Cédric JAMME** - Développeur Frontend
- **Mylène M'ZALI** - UI/UX Designer
- **Ricardo TCHAMGOUE** - Développeur Frontend

### Encadrement Pédagogique

- **Allan GERME** - Responsable de projet
- **Clément HAMEAU** - Responsable de projet
- **Arnaud PALIN SAINTE AGATHE** - Responsable Technique

## 🎨 Design System

Notre application utilise un design system cohérent basé sur :

- **Palette de couleurs** : Tons chauds inspirés des bibliothèques classiques
- **Typographie** : Fonts lisibles optimisées pour la lecture
- **Composants** : Bibliothèque shadcn/ui personnalisée
- **Responsive** : Design adaptatif mobile-first
- **Accessibilité** : Respect des standards WCAG 2.1

## 🔒 Sécurité et Confidentialité

- **Authentification sécurisée** : sessions & cookies
- **Protection des données** : Conformité RGPD
- **Validation des entrées** : Sanitisation côté client et serveur
- **HTTPS** : Communication chiffrée en production
- **Gestion des cookies** : Suppression complète lors de la déconnexion

## 📱 Applications Mobiles

L'application est disponible sur :

- **iOS** : App Store (com.patrick.bookish)
- **Web** : [bookish.bartosik.fr](https://bookish.bartosik.fr)

## 🚀 Déploiement

### Environnement de Production

- **URL** : https://bookish.bartosik.fr
- **CDN** : Vercel Edge Network
- **SSL** : Certificat automatique
- **Monitoring** : Uptime et performance 24/7

### Processus de Déploiement

1. Push sur la branche `main`
2. CI/CD automatique via GitHub Actions
3. Tests automatisés
4. Build et déploiement sur Vercel
5. Synchronisation mobile via Capacitor

## 📊 Métriques et Objectifs

### Objectifs Techniques

- ✅ Performance : Score Lighthouse > 90
- ✅ Accessibilité : WCAG 2.1 AA
- ✅ SEO : Optimisation complète
- ✅ Mobile : PWA avec installation
- ✅ Offline : Fonctionnalités hors ligne

### Métriques Utilisateur

- **Temps de chargement** : < 2 secondes
- **Taux de conversion** : Inscription > 15%
- **Engagement** : Session > 5 minutes
- **Rétention** : 30 jours > 40%

## 🤝 Contribution

Ce projet étant un projet académique de l'IIM Digital School, les contributions sont actuellement limitées à l'équipe de développement mentionnée ci-dessus.

### Standards de Code

- **Linting** : ESLint + Prettier
- **Conventions** : Conventional Commits
- **Tests** : Jest (tests unitaires)
- **CI/CD** : GitHub Actions
- **Documentation** : JSDoc pour les fonctions complexes

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

Pour toute question concernant le projet :

- **Email** : contact@bartosik.fr
- **Repository** : [GitHub Bookish](https://github.com/patrickbartosik/bookish)
- **Documentation** : [Wiki du projet](https://github.com/patrickbartosik/bookish/wiki)

---

<div align="center">
  <p><strong>Développé avec ❤️ par l'équipe Bookish - IIM Digital School 2023-2025</strong></p>
  <p><em>"Parce que chaque livre mérite d'être partagé"</em></p>
</div>
