# Lerntagebuch – Wito Website

Dieses Tagebuch dokumentiert alle Änderungen an `index.html`, `style.css` und `script.js` mit Erklärungen für Einsteiger.

---

## 27.05.2026 – Favicon, Logo, Headline & Responsive Schriftgröße

### Was wurde gemacht

Vier Anpassungen an der bestehenden Grundstruktur:

1. **Favicon-Pfad** korrigiert: `brand_assets/…` → `./brand_assets/…` + Fallback-Link ergänzt
2. **Logo im Header** ausgetauscht: Text „Wito" durch das SVG-Logo aus `brand_assets/logos/LOGO.svg` ersetzt
3. **Headline-Zeilenumbruch** entfernt: manuelles `<br>` aus dem `<h1>` gelöscht
4. **`clamp()` für Schriftgröße** angepasst: Wertebereich auf die Spaltenbreite abgestimmt

---

### HTML/CSS/JS Konzept

#### 1. Favicon
```html
<link rel="icon" type="image/svg+xml" href="./brand_assets/logos/FAVICON.svg">
<link rel="shortcut icon" href="./brand_assets/logos/FAVICON.svg">
```
Ein **Favicon** ist das kleine Symbol im Browser-Tab. Es wird über ein `<link>`-Tag im `<head>` eingebunden.

- `rel="icon"` ist der moderne Standard (unterstützt SVG seit 2020 in allen aktuellen Browsern)
- `rel="shortcut icon"` ist der ältere Fallback – ältere Browser und manche E-Mail-Clients kennen nur diesen Namen
- `type="image/svg+xml"` teilt dem Browser mit, welches Dateiformat erwartet wird
- `./` am Anfang des Pfads bedeutet: „starte im selben Ordner wie diese HTML-Datei". Ohne `./` funktioniert es meist auch, aber `./` macht den Pfad eindeutig relativ und vermeidet Probleme bei bestimmten Server-Konfigurationen.

#### 2. Logo als Bild
```html
<a href="/" class="nav__logo" aria-label="Wito – Zurück zur Startseite">
  <img src="brand_assets/logos/LOGO.svg" alt="Wito" height="40">
</a>
```
Statt den Markennamen als Text zu schreiben, wird die fertige SVG-Datei als `<img>` eingebunden.

- `height="40"` setzt die Höhe auf 40 Pixel. Die Breite passt sich automatisch proportional an – das Bild verzerrt also nicht.
- `alt="Wito"` ist der **Alt-Text**: Screenreader für blinde Nutzer lesen ihn vor, und er erscheint auch, wenn das Bild nicht lädt. Pflicht für jedes inhaltstragende Bild.
- Der umschließende `<a>`-Link hat `aria-label`, weil der Alt-Text des Bildes und das Ziel des Links gemeinsam beschrieben werden sollen – für Barrierefreiheit.
- Im CSS wurde `.nav__logo` von einer Text-Klasse (mit `font-family`, `font-size`, `color` …) zu einem **Flex-Container** umgebaut (`display: flex; align-items: center`), damit das Bild vertikal korrekt ausgerichtet ist.

#### 3. Manueller Zeilenumbruch entfernt
```html
<!-- Vorher -->
Der KI-Assistent der<br class="hero__br">
<span class="hero__headline-accent">Zahnarztpraxen</span> entlastet

<!-- Nachher -->
Der KI-Assistent der <span class="hero__headline-accent">Zahnarztpraxen</span> entlastet
```
Ein `<br>` ist ein **harter Zeilenumbruch** – er bricht immer um, egal wie breit der Bildschirm ist. Das führt dazu, dass die Headline auf kleinen Bildschirmen seltsam umbrechen kann (z. B. „der" allein auf einer Zeile).

Ohne `<br>` entscheidet der Browser selbst, wo er umbricht – basierend auf der verfügbaren Breite. Das ist **flexibler und responsiver**. Die `clamp()`-Schriftgröße (siehe unten) steuert dann, dass es auf Desktop trotzdem bei zwei Zeilen bleibt.

#### 4. `clamp()` für Schriftgröße
```css
font-size: clamp(2rem, 3.25vw, 2.75rem);
```
`clamp(minimum, bevorzugt, maximum)` ist eine CSS-Funktion, die drei Werte bekommt:

| Wert | Bedeutet | Konkret |
|------|----------|---------|
| `2rem` | Minimum | Nie kleiner als 32 px (2 × 16 px Basis) |
| `3.25vw` | Bevorzugt | 3,25 % der Viewport-Breite – wächst mit dem Fenster |
| `2.75rem` | Maximum | Nie größer als 44 px |

`vw` = **viewport width** = 1 % der Fensterbreite. Bei 1000 px Fenster sind `3.25vw` also 32,5 px. Bei 1280 px sind es 41,6 px – bleibt unter dem Maximum von 44 px, passt.

---

### Warum so und nicht anders

**Favicon mit `./`:** Ohne den relativen Punkt-Schrägstrich kann es bei manchen lokalen Entwicklungsumgebungen oder Deployments zu „nicht gefunden"-Fehlern kommen. Der explizite Pfad ist robuster.

**SVG als Logo statt Text:** Ein SVG-Logo sieht auf allen Auflösungen scharf aus (Retina, 4K), enthält die offiziellen Markenfarben und Gradienten – das lässt sich mit reinem CSS-Text nicht erreichen. Außerdem: Ändert sich das Logo, muss nur die Datei getauscht werden, nicht der Code.

**`clamp()` statt Media Queries für die Schriftgröße:** Man könnte auch mehrere `@media`-Blöcke schreiben (`font-size: 32px; @media … font-size: 44px`). `clamp()` löst dasselbe mit einer einzigen Zeile und läuft dabei **stufenlos** – kein abrupter Sprung bei einem Breakpoint, sondern eine sanfte Kurve.

**Max-Wert 44 px (2.75rem):** Bei einer Spaltenbreite von ~576 px (Hälfte eines 1280-px-Desktops) passt „Zahnarztpraxen entlastet" genau auf eine Zeile. Ein größerer Wert würde das letzte Wort auf eine dritte Zeile zwingen.

---

### Auswirkung

| Änderung | Visuell | Technisch |
|----------|---------|-----------|
| Favicon | Browser-Tab zeigt Wito-Icon statt Standard | Beide `<link>`-Tags erhöhen Browserkompatibilität |
| SVG-Logo | Markenlogo mit Gradienten statt weißem Text | Bild wird als separater HTTP-Request geladen |
| `<br>` entfernt | Umbruch passiert automatisch und responsiv | Kein Hard-Break mehr im DOM |
| `clamp()` angepasst | Headline bleibt auf Desktop in 2 Zeilen, skaliert auf Mobile | Kleinere Maximalschrift = weniger Risiko für 3. Zeile |

---
