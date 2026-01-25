# Ad Hoc OTA Distribution – /app/release

Dieses Verzeichnis enthält **alle Artefakte**, die für die **kabel-lose (Over-the-Air) Installation**
einer iOS-App per **Ad-Hoc Deployment** benötigt werden.

Die Verteilung erfolgt über den offiziellen iOS-Mechanismus **itms-services** und ist **ausschließlich**
für Geräte möglich, deren **UDID im Ad-Hoc Provisioning Profile** registriert ist.

---

## 📁 Verzeichnisstruktur

```
/release
 ├── SolarTeck.ipa
 ├── manifest.plist
 └── README.md
```

---

## 📦 Dateien im Detail

### `SolarTeck.ipa`
- Das **Ad-Hoc signierte iOS-Build**
- Erstellt über:
  - Xcode → *Product* → *Archive*
  - *Distribute App* → **Ad Hoc**
- Signiert mit:
  - Apple Distribution Certificate
  - Ad-Hoc Provisioning Profile

⚠️ **Wichtig**
- App-Store- oder Development-Builds funktionieren **nicht** für diese Verteilung
- Die enthaltene App läuft **nur** auf den im Profil hinterlegten Geräten

---

### `manifest.plist`
- Steuerdatei für die **OTA-Installation**
- Wird von iOS beim Installationsaufruf gelesen
- Verweist direkt auf die `.ipa`

Wesentliche Felder:
- `assets → software-package → url`
  - Öffentliche **HTTPS-URL** zur `.ipa`
- `metadata → bundle-identifier`
  - Muss **exakt** der Bundle-ID der App entsprechen
- `metadata → bundle-version`
  - App-Version
- `metadata → title`
  - Anzeigename der App

⚠️ **Technische Anforderungen**
- Ausschließlich **HTTPS**
- Keine Redirects
- Keine Authentifizierung
- Keine Login-Seiten

---

## 🚀 Installation auf dem iPad (ohne Kabel)

1. Auf dem iPad **Safari** öffnen
2. Installationslink aufrufen:

```
itms-services://?action=download-manifest&url=https://raw.githubusercontent.com/JulianFink01/solar-planner/main/release/manifest.plist
```
3. Installation bestätigen
4. App erscheint auf dem Home Screen

Falls erforderlich:
- **Einstellungen → Allgemein → VPN & Geräteverwaltung**
- Entwicklerprofil vertrauen

---

## ❗ Typische Fehler & Ursachen

| Problem | Ursache |
|------|--------|
| App kann nicht installiert werden | UDID nicht im Profil |
| Integrity could not be verified | Falsches Signing / ungültiges Profil |
| Download startet nicht | Kein HTTPS / Redirect |
| Installation bricht ab | Bundle-ID stimmt nicht |

---

## ✅ Best Practices

- Für jede Version einen eigenen Ordner (`/release/v1.0.0`)
- Alte Builds entfernen oder klar kennzeichnen
- `manifest.plist` **immer** zur `.ipa` passend halten
- Für regelmäßige Verteilung TestFlight in Betracht ziehen


