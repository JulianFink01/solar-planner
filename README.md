# ☀️ Solar Planner

Eine React-Native-App zur Planung von Solardächern: verwalte Dächer und Solarmodultypen, platziere Module im Editor und erhalte eine schnelle Leistungsübersicht.

## ✨ Highlights

- **Dachverwaltung**: Dächer anlegen, bearbeiten und löschen.
- **Solarmodul-Typen**: Module mit Leistung und Abmessungen verwalten.
- **Editor**: automatische und manuelle Modulplatzierung, Abstände und Innenränder.
- **Mehrsprachig**: Deutsch und Englisch.
- **Lokale Speicherung**: Realm als persistente Datenbasis.

## 🧰 Tech-Stack

- **React Native** (0.73)
- **TypeScript**
- **React Navigation**
- **Realm**
- **React Native Paper**

## 🚀 Projekt starten

> Voraussetzung: Node.js **>= 18** sowie eine eingerichtete React-Native-Umgebung (Android Studio/Xcode).

### 1) Abhängigkeiten installieren

```bash
npm install
```

### 2) Metro Bundler starten

```bash
npm start
```

### 3) App ausführen

**Android**
```bash
npm run android
```

**iOS**
```bash
npm run ios
```

## 🧪 Tests & Qualität

```bash
npm test
npm run lint
```

## 📁 Projektstruktur (Auszug)

```text
app/
  componentes/        Navigation & UI-Bausteine
  views/              Screens (Dächer, Module, Editor, …)
  models/             Realm-Schemas
  localization/       DE/EN Übersetzungen
```

## 🌍 Lokalisierung

Übersetzungen liegen unter `app/localization/` und werden über `react-i18next` geladen.

## 🔧 Nützliche Skripte

- `npm start` – Metro Bundler
- `npm run android` – Android App starten
- `npm run ios` – iOS App starten
- `npm test` – Tests ausführen
- `npm run lint` – ESLint

---

Viel Spaß beim Planen! 🌞
