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

## 27.05.2026 – Logo-Link von `/` zu `#hero` geändert

### Was wurde gemacht

Der `href`-Wert des Logo-Links in der Navigation wurde von `/` auf `#hero` geändert.

```html
<!-- Vorher -->
<a href="/" class="nav__logo" …>

<!-- Nachher -->
<a href="#hero" class="nav__logo" …>
```

### HTML/CSS/JS Konzept

Ein `<a>`-Tag braucht immer ein `href`-Attribut, das beschreibt, **wohin** der Klick führt. Es gibt zwei grundlegende Arten:

- **Absoluter/Relativer Pfad** (`/`, `./seite.html`) – lädt eine andere Seite oder Datei. `/` bedeutet „Wurzelverzeichnis des Servers" – im Browser lokal geöffnet führt das direkt ins Mac-Dateisystem (`/Users/…`), was nicht gewünscht ist.
- **Anker-Link** (`#hero`) – springt zu einem Element auf *derselben* Seite, dessen `id` genau diesem Namen entspricht. Im HTML existiert `<section … id="hero">`, deshalb funktioniert `#hero` als Sprungziel.

Der Smooth-Scroll in `script.js` greift genau diese `#`-Links ab und scrollt sanft zum Ziel statt hart zu springen.

### Warum so und nicht anders

`/` ist für Webserver gedacht, die eine `index.html` an der Root ausliefern. Lokal im Browser entspricht `/` dem Dateisystem-Root des Rechners – kein sinnvolles Ziel. `#hero` ist präziser: Es scrollt zur Hero-Section, egal ob die Seite lokal oder auf einem Server läuft.

### Auswirkung

| Vorher | Nachher |
|--------|---------|
| Klick auf Logo öffnet Mac-Dateisystem-Root | Klick auf Logo scrollt sanft zur Hero-Section |
| Funktioniert nur korrekt auf einem Webserver | Funktioniert lokal und auf jedem Server |

---

## 27.05.2026 – Features-Sektion mit 3 Karten gebaut

### Was wurde gemacht

Eine neue Section `id="features"` wurde in `index.html` direkt unterhalb der Hero-Section eingefügt. Dazu kamen alle zugehörigen Styles in `style.css`.

**Aufbau der Section:**
- Abschnitts-Badge (Text: „Features")
- Überschrift `<h2>` + Subheadline
- Grid mit 3 Feature-Karten: Foto-Analyse, Triage-Chat, Direkte Buchung
- Jede Karte: Icon-Container, Titel `<h3>`, Beschreibungstext
- `data-reveal`-Attribute für gestaffelten Scroll-Reveal

---

### HTML/CSS/JS Konzept

#### Semantisches HTML: `<section>` und `<article>`

```html
<section id="features" aria-labelledby="features-headline">
  <article class="feature-card">…</article>
</section>
```

- `<section>` gruppiert thematisch zusammengehörige Inhalte. Das `id`-Attribut macht sie per Anker-Link anspringbar (`href="#features"`).
- `aria-labelledby="features-headline"` verbindet die Section mit ihrer Überschrift – Screenreader sagen dann „Region: Alles was deine Praxis braucht".
- `<article>` ist für eigenständige Inhaltseinheiten gedacht (hier: jede Feature-Karte könnte theoretisch für sich stehen).
- `<h2>` statt `<h1>`: Die Seite hat genau eine `<h1>` (Hero). Alle weiteren Haupt-Überschriften bekommen `<h2>`. Das ergibt eine korrekte **Überschriften-Hierarchie** (h1 → h2 → h3), die für Barrierefreiheit wichtig ist.

#### CSS Grid: Responsive ohne Media Queries

```css
/* Mobile: 1 Spalte (Standard) */
.features__grid {
  display: grid;
  gap: 1.125rem;
}

/* Desktop: 3 Spalten */
@media (min-width: 1024px) {
  .features__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

`display: grid` aktiviert CSS Grid. Ohne `grid-template-columns` legt der Browser automatisch eine Spalte an. Mit `repeat(3, 1fr)` entstehen drei gleich breite Spalten – `1fr` bedeutet „1 Bruchteil des verfügbaren Platzes".

#### Inline SVG Icons

```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.75" …>
  <path d="…"/>
</svg>
```

Das `stroke="currentColor"` ist der entscheidende Trick: Der SVG erbt die CSS-Textfarbe (`color`) des umgebenden Elements. Dadurch genügt eine Zeile CSS, um die Farbe anzupassen:

```css
.feature-card__icon {
  color: var(--c-primary); /* Icon wird grün */
}
```

Kein externes Icon-Script nötig – die SVG-Pfade sind direkt im HTML. Nachteil: mehr Code; Vorteil: kein extra HTTP-Request, keine Abhängigkeit.

#### Scroll-Reveal: gestaffelte Verzögerung

```html
<div class="features__header"    data-reveal></div>
<article class="feature-card"    data-reveal data-reveal-delay="1"></article>
<article class="feature-card"    data-reveal data-reveal-delay="2"></article>
<article class="feature-card"    data-reveal data-reveal-delay="3"></article>
```

```css
[data-reveal] { opacity: 0; transform: translateY(16px); … }
[data-reveal].is-visible { opacity: 1; transform: translateY(0); }
[data-reveal-delay="1"] { transition-delay: 100ms; }
[data-reveal-delay="2"] { transition-delay: 200ms; }
[data-reveal-delay="3"] { transition-delay: 300ms; }
```

Der `IntersectionObserver` in `script.js` beobachtet alle `[data-reveal]`-Elemente. Sobald eines in den sichtbaren Bereich scrollt, wird `.is-visible` hinzugefügt – das startet die CSS-Transition. Durch die `transition-delay`-Werte erscheinen die drei Karten 100ms versetzt nacheinander: **Staffel-Effekt**.

#### Wiederverwendbare Klasse `.section-badge`

Der Hero hatte `.hero__badge` als eigene Klasse. Für alle weiteren Sektionen wurde `.section-badge` angelegt – gleiche Optik, aber ohne pulsierenden Punkt (der nur im Hero Sinn macht als Statusindikator).

---

### Warum so und nicht anders

**`<article>` für die Karten:** Technisch würde auch `<div>` funktionieren. `<article>` ist semantisch korrekter, weil jede Karte ein in sich geschlossenes Inhaltsstück beschreibt. Das verbessert das Verständnis von Screenreadern und Suchmaschinen.

**`grid-template-columns: repeat(3, 1fr)` statt fixer Breiten:** Mit `repeat(3, 1fr)` passen sich die Spalten automatisch an die Container-Breite an. Bei `width: 300px` pro Karte müsste man für jede Bildschirmgröße nachrechnen.

**Icon-Wrapper statt nacktem SVG:** Der grüne Icon-Container (`background-color: rgba(217, 237, 146, 0.1)`) gibt den Karten eine visuelle Struktur und Orientierungspunkt. Außerdem erlaubt der Wrapper einen eigenen Hover-Effekt, ohne das SVG selbst anzufassen.

**`data-reveal` statt CSS `animation`:** CSS `animation` läuft sofort beim Laden, auch wenn das Element außerhalb des sichtbaren Bereichs liegt. `data-reveal` + Intersection Observer wartet, bis das Element wirklich sichtbar ist – das fühlt sich natürlicher an und schont die Performance.

---

### Auswirkung

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Seiteninhalt | Nur Hero, dann Ende | Features-Section mit 3 Karten |
| Navigation `#features`-Link | Scrollt ins Leere | Springt zur richtigen Section |
| Mobile (375px) | — | Karten untereinander, 1 Spalte |
| Desktop (1024px+) | — | Karten nebeneinander, 3 Spalten |
| Beim Einscrolltieren | — | Karten erscheinen gestaffelt von unten |

---

## 27.05.2026 – Kennzahlen-Leiste mit Counter-Animation gebaut

### Was wurde gemacht

Zwischen Hero und Features wurde eine horizontale Kennzahlen-Leiste eingefügt. Sie zeigt drei Werte: `98` (% Patientenzufriedenheit), `3` (× weniger Telefonanrufe) und `24/7` (Buchungen möglich). Die ersten zwei Zahlen zählen per Animation von 0 auf ihren Endwert hoch, sobald die Leiste in den Viewport scrollt.

**Änderungen:**
- `index.html`: Neue `<section class="stats">` zwischen Hero und Features
- `style.css`: Styles für `.stats`, `.stats__item`, `.stats__value`, `.stats__label`
- `script.js`: Counter-Animations-Block mit eigenem `IntersectionObserver`

---

### HTML/CSS/JS Konzept

#### Was ist ein IntersectionObserver?

Früher musste man beim Scrollen bei jedem einzelnen Scroll-Ereignis manuell prüfen: „Ist dieses Element gerade sichtbar?" Das passierte mit `window.addEventListener('scroll', …)` und dann `element.getBoundingClientRect()`. Problem: Die Scroll-Funktion feuert manchmal hundertmal pro Sekunde – das macht den Browser langsam.

Der `IntersectionObserver` ist die moderne Lösung. Er beobachtet Elemente **passiv** und ruft dich nur an, wenn sich der Sichtbarkeitsstatus wirklich ändert:

```javascript
const observer = new IntersectionObserver(
  function (entries, obs) {         // wird aufgerufen wenn sich was ändert
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {   // Element ist jetzt sichtbar
        machIrgendwas();
        obs.unobserve(entry.target); // nicht mehr beobachten
      }
    });
  },
  { threshold: 0.4 }  // erst auslösen wenn 40% des Elements sichtbar sind
);

observer.observe(meinElement); // Beobachtung starten
```

`threshold: 0.4` heißt: „Löse erst aus, wenn 40 % des Elements im Viewport sind." Würde man `0` nehmen, feuert es bereits wenn ein einzelner Pixel sichtbar ist.

`obs.unobserve(entry.target)` stoppt die Beobachtung nach dem ersten Auslösen – die Counter-Animation soll nur einmal laufen, nicht bei jedem erneuten Einscrolten.

#### Counter-Animation mit `requestAnimationFrame`

```javascript
function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10); // Zielwert aus data-counter="98"
  const duration = 1400;                            // Laufzeit in ms
  const startTime = performance.now();              // Startzeitpunkt

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 bis 1
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(step);    // nächster Frame
  }

  requestAnimationFrame(step);
}
```

`requestAnimationFrame` (rAF) synchronisiert den Code mit dem Bildschirm-Refresh (meistens 60 Mal/Sekunde). Das ergibt ein geschmeidiges Bild, weil der Browser den DOM genau dann aktualisiert, wenn er sowieso neu zeichnet.

`performance.now()` liefert einen hochpräzisen Zeitstempel in Millisekunden. Damit berechnet man, wie weit die Animation fortgeschritten ist (`elapsed / duration`), unabhängig davon, wie schnell der Rechner ist.

#### Ease-Out-Funktion

```javascript
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
```

`t` ist ein Wert zwischen 0 und 1 (Fortschritt der Animation). Ohne Easing würde der Counter linear zählen: gleichmäßig, etwas langweilig. Ease-Out macht den Anfang schnell und das Ende langsam – das wirkt natürlicher und gibt dem Zielwert ein Gewicht.

Bei `t = 0`: `easeOut(0) = 0` → Startwert 0  
Bei `t = 0.5`: `easeOut(0.5) ≈ 0.875` → schon fast am Ziel  
Bei `t = 1`: `easeOut(1) = 1` → Endwert erreicht

#### Vertikale Trennlinien mit CSS

```css
.stats__item:not(:last-child) {
  border-right: 1px solid var(--c-border);
}
```

`:not(:last-child)` ist ein CSS-Selektor der alle Elemente trifft **außer dem letzten**. So bekommt nur die erste und zweite Kennzahl eine rechte Trennlinie – die dritte nicht, weil sonst am äußeren Rand ein überflüssiger Strich entstehen würde.

#### Warum kein `data-reveal` auf dieser Section?

`data-reveal` blendet Elemente beim Einscrollten von unten ein. Diese Section hat aber eine eigene, komplexere Eingangs-Logik (die Counter-Animation). Beides zusammen würde kollidieren: Das Element wäre zunächst unsichtbar (`opacity: 0`) und die Counter würden trotzdem schon laufen. Daher hat die Stats-Section einen eigenen `IntersectionObserver` mit `threshold: 0.4` – der Auslöser ist bewusst höher gesetzt, damit die Zahlen erst zählen wenn die Leiste vollständig zu sehen ist.

---

### Warum so und nicht anders

**`data-counter="98"` als HTML-Attribut statt JavaScript-Objekt:** Die Zielwerte direkt am Element zu speichern hält den JS-Code generisch – `animateCounter` muss nicht wissen, welche Zahlen existieren. Man könnte später eine vierte Kennzahl hinzufügen, ohne eine Zeile JS anzufassen.

**`parseInt(el.dataset.counter, 10)`:** Das zweite Argument `10` erzwingt die Dezimal-Basis. Ohne es würde `parseInt("08")` in älteren Browsern als Oktal-Zahl interpretiert und 0 zurückgeben – ein klassischer Fallstrick.

**`24/7` bleibt statisch:** Ein Slash lässt sich nicht als Zahl animieren. Das Element hat schlicht kein `data-counter`-Attribut, der Code überspringt es automatisch per `querySelectorAll('[data-counter]')`.

---

### Auswirkung

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Zwischen Hero und Features | Direkter Übergang | Visuelle Pause mit 3 Vertrauenszahlen |
| Zahlen beim Einscrollten | — | Zählen in 1,4 Sekunden von 0 hoch |
| 24/7 | — | Bleibt statisch, keine Animation |
| Wiederholtes Scrollen | — | Counter läuft nur einmal (unobserve) |

---

## 27.05.2026 – Counter-Trigger: erst nach erstem Scroll auslösen

### Was wurde gemacht

Der `IntersectionObserver` für die Kennzahlen-Counter wurde so angepasst, dass er **nicht sofort beim Laden der Seite** startet, sondern erst nachdem der Nutzer zum ersten Mal scrollt.

```javascript
// Vorher: Observer startet sofort
observer.observe(section);

// Nachher: Observer startet erst beim ersten Scroll
window.addEventListener('scroll', function () {
  observer.observe(section);
}, { passive: true, once: true });
```

### HTML/CSS/JS Konzept

#### Warum hat der Observer vorher sofort ausgelöst?

`IntersectionObserver.observe()` prüft beim Aufruf **sofort**, ob das beobachtete Element sichtbar ist. Ist es das (oder liegt es nah genug am Viewport), feuert der Callback direkt – auch wenn der Nutzer noch gar nicht gescrollt hat.

Da die Stats-Section direkt unter der Hero-Section liegt (die den Viewport füllt), kann sie je nach Fensterhöhe und Zoom-Level bereits beim Laden sichtbar sein oder zumindest sofort beim kleinsten Layout-Shift die threshold von 40 % erreichen.

#### Die Lösung: verzögerter Observer-Start

```javascript
window.addEventListener('scroll', function () {
  observer.observe(section);
}, { passive: true, once: true });
```

Zwei wichtige Optionen:

- **`once: true`** — Der Event-Listener löscht sich nach dem ersten Aufruf selbst. Ohne das würde bei jedem einzelnen Scroll-Pixel `observer.observe(section)` erneut aufgerufen (auch wenn das nach dem ersten Mal nichts mehr tut, ist es unnötig).

- **`passive: true`** — Teilt dem Browser mit, dass dieser Handler niemals `event.preventDefault()` aufruft. Das erlaubt dem Browser, das Scrollen flüssiger zu verarbeiten, ohne auf den Handler warten zu müssen.

#### Was passiert beim ersten Scroll genau?

1. `observer.observe(section)` wird aufgerufen
2. Der Observer prüft sofort: „Ist die Section schon sichtbar?"
   - **Ja** → Callback feuert direkt, Counter starten
   - **Nein** → Counter starten erst wenn der Nutzer weit genug scrollt (threshold 0.4)
3. Nach der Animation: `unobserve` — der Observer wird nie wieder ausgelöst

Das ist das gewünschte Verhalten: Der Nutzer **erlebt** die Animation durch seine eigene Scroll-Geste.

### Warum so und nicht anders

Eine Alternative wäre ein `hasScrolled`-Flag gewesen:
```javascript
let hasScrolled = false;
window.addEventListener('scroll', () => { hasScrolled = true; });
// Im Observer: if (entry.isIntersecting && hasScrolled) { … }
```

Das funktioniert auch, ist aber komplizierter: Man muss zwei Bedingungen synchron halten und separat prüfen, ob die Section beim ersten Scroll bereits sichtbar war. Die `once: true`-Variante ist eleganter, weil der Observer selbst die gesamte Logik enthält.

### Auswirkung

| Szenario | Vorher | Nachher |
|----------|--------|---------|
| Seite laden, nicht scrollen | Counter zählen sofort | Counter bleiben bei 0 |
| Seite laden, dann scrollen | Counter bereits gelaufen | Counter zählen beim Einscrollten |
| Section direkt im Viewport | Sofortige Animation | Animation startet beim ersten Scroll |

---
