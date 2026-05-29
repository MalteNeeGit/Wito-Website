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

## 27.05.2026 – Counter-Trigger: IntersectionObserver → manueller Scroll-Listener

### Was wurde gemacht

Die gesamte Trigger-Logik für die Counter-Animation wurde ersetzt. Statt `IntersectionObserver` + verzögertem `observe()`-Start wird jetzt ein einfacher `scroll`-Listener mit `getBoundingClientRect()` verwendet.

```javascript
// Neu
let statsAnimated = false;

function onScroll() {
  if (statsAnimated) return;
  if (window.scrollY <= 100) return;

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    statsAnimated = true;
    counters.forEach(animateCounter);
    window.removeEventListener('scroll', onScroll);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
```

Die Counter-Animation selbst (`requestAnimationFrame`, `easeOut`, `performance.now`) ist unverändert.

---

### HTML/CSS/JS Konzept

#### `getBoundingClientRect()` – Position relativ zum Viewport

```javascript
const rect = section.getBoundingClientRect();
```

`getBoundingClientRect()` gibt ein Objekt zurück mit den Pixel-Koordinaten des Elements **relativ zum sichtbaren Fenster** (Viewport):

```
{
  top:    100,   // Oberkante: 100px vom Viewport-Rand entfernt
  bottom: 300,   // Unterkante: 300px vom Viewport-Rand entfernt
  left:   0,
  right:  1280,
  width:  1280,
  height: 200
}
```

`rect.top < window.innerHeight` bedeutet: „Die Oberkante des Elements ist noch innerhalb des Fensters" → das Element ist sichtbar. Das ist eine direkte, synchrone Prüfung – kein Beobachtungsmechanismus, keine asynchronen Callbacks.

#### Der Unterschied: IntersectionObserver vs. Scroll-Listener

| Eigenschaft | `IntersectionObserver` | Scroll-Listener + `getBoundingClientRect()` |
|-------------|----------------------|--------------------------------------------|
| **Auslöse-Zeitpunkt** | Asynchron, verzögert durch Browser-Intern | Synchron bei jedem Scroll-Event |
| **Auslöst bei Laden?** | Ja, wenn Element sofort sichtbar | Nein – `scrollY <= 100`-Guard verhindert es |
| **Kontrolle** | Indirekt über `threshold` | Direkt: eigene Bedingungen frei wählbar |
| **Performance** | Sehr gut (Browser-intern optimiert) | Gut mit `passive: true`, aber mehr CPU bei häufigem Scroll |
| **Komplexität** | Höher (Callback-API, Lifecycle) | Einfacher zu lesen und debuggen |

#### Warum ist der Scroll-Listener hier zuverlässiger?

Der `IntersectionObserver` hat ein bekanntes Verhalten: Er feuert seinen Callback beim ersten `observe()`-Aufruf **sofort**, wenn das Element bereits intersecting ist – unabhängig davon, ob der Nutzer gescrollt hat. Das führte zu dem ursprünglichen Bug.

Der Workaround (`once: true` + verzögertes Observe) löst das Problem, macht den Code aber indirekt schwerer nachvollziehbar.

Der Scroll-Listener mit `getBoundingClientRect()` ist expliziter:
- `scrollY <= 100` — die Seite wurde noch kaum gescrollt → nichts tun
- `rect.top < window.innerHeight` — Element liegt im sichtbaren Bereich → animieren

Beide Bedingungen sind einfache Zahlenvergleiche, die man direkt debuggen kann (in der Browser-Konsole: `section.getBoundingClientRect().top` oder `window.scrollY`).

#### Das `statsAnimated`-Flag

```javascript
let statsAnimated = false;

function onScroll() {
  if (statsAnimated) return;  // ← Kurzschluss: sofort raus wenn schon animiert
  …
  statsAnimated = true;
  window.removeEventListener('scroll', onScroll); // Listener sauber entfernen
}
```

Das Flag verhindert, dass die Animation mehrfach startet. `removeEventListener` entfernt den Handler danach komplett aus dem Speicher – ohne das würde `onScroll` bei jedem Scroll-Event für immer aufgerufen, auch wenn es nichts mehr tut.

---

### Warum so und nicht anders

**`scrollY > 100` als Guard:** Ohne diese Bedingung würde der Handler beim allerkleinsten Scroll-Event prüfen, ob die Section sichtbar ist. Da sie direkt unter dem Hero liegt, könnte schon ein Touch-Start ohne sichtbare Scroll-Bewegung ausreichen. Die 100px stellen sicher, dass der Nutzer wirklich aktiv gescrollt hat.

**`removeEventListener` statt `once: true`:** Mit `once: true` würde der Listener nach dem ersten Scroll-Event entfernt – unabhängig davon, ob die Animation ausgelöst wurde. Wenn der Nutzer 50px scrollt, das Element aber noch nicht sichtbar ist, wäre der Listener weg und die Animation würde nie starten. Die manuelle Entfernung im `if`-Block garantiert: der Listener läuft solange bis die Animation wirklich gestartet ist.

---

### Auswirkung

| Szenario | Vorher (Observer) | Jetzt (Scroll-Listener) |
|----------|-------------------|------------------------|
| Laden ohne Scrollen | Counter starteten oft sofort | Counter bleiben bei 0 |
| Scrollen auf 101px | Observer abhängig von threshold | Prüft Position, startet wenn sichtbar |
| Section im Viewport | Asynchron, manchmal zu früh | Synchron, deterministisch |
| Nach Animation | `unobserve()` | `removeEventListener()` |

---

## 27.05.2026 – Kennzahlen: Suffix (% und ×) ins Zahlen-Styling integriert

### Was wurde gemacht

`%` und `×` stehen jetzt direkt neben den Zahlen im gleichen großen grünen Stil – nicht mehr als kleines graues Label darunter.

```html
<!-- Vorher -->
<span class="stats__value" data-counter="98">0</span>
<span class="stats__label">% Patientenzufriedenheit</span>

<!-- Nachher -->
<div class="stats__value"><span data-counter="98">0</span>%</div>
<span class="stats__label">Patientenzufriedenheit</span>
```

### HTML/CSS/JS Konzept

#### Container-Muster: äußeres Element stylen, inneres Element animieren

Das Kernelement ist, dass `data-counter` jetzt auf dem **inneren** `<span>` sitzt, während `.stats__value` der äußere **Container** ist:

```html
<div class="stats__value">
  <span data-counter="98">0</span>%
</div>
```

- `.stats__value` trägt das gesamte Styling: große grüne Schrift, `font-family`, `font-weight`
- Der innere `<span>` erbt dieses Styling automatisch (da er ein Kind-Element ist)
- `%` ist ein einfacher Text-Knoten direkt im Container – er erbt das Styling ebenfalls
- Das JS findet `[data-counter]` weiterhin mit `querySelectorAll('[data-counter]')` – jetzt eben ein `<span>` statt ein `<div>`, aber das Attribut ist dasselbe

**Vererbung in CSS:** Eigenschaften wie `color`, `font-family`, `font-weight` und `font-size` werden automatisch an Kind-Elemente weitergegeben, sofern diese keine eigene Regel überschreiben. Deshalb braucht der innere `<span>` keine eigene CSS-Klasse.

#### Warum `<div>` statt `<span>` für `.stats__value`?

```html
<!-- Vorher: span enthält nur Text, passt -->
<span class="stats__value" data-counter="98">0</span>

<!-- Nachher: div enthält span + Text-Knoten -->
<div class="stats__value"><span data-counter="98">0</span>%</div>
```

`<span>` ist ein Inline-Element. Ein `<span>` der einen anderen `<span>` als Kind hat ist valide HTML. Aber semantisch ist `.stats__value` jetzt ein Container-Block, daher ist `<div>` angemessener. An der visuellen Darstellung ändert sich nichts, da `.stats__value` ohnehin `display: block` (als flex-Kind) ist.

### Warum so und nicht anders

**Suffix als Text-Knoten, nicht als eigener `<span>`:** Man könnte `<span class="stats__suffix">%</span>` schreiben. Das wäre nötig wenn das Suffix anders gestylt werden soll (z.B. etwas kleiner). Da es hier gleich aussehen soll wie die Zahl, reicht ein nackter Text-Knoten – weniger HTML, gleiche Wirkung.

**Kein JS-Update nötig:** Das Script sucht `[data-counter]` – das Attribut ist weiterhin vorhanden, nur auf einem anderen Element-Typ (`<span>` statt `<span>`-mit-Klasse). `el.textContent = Math.round(…)` ändert nur den Text des direkt adressierten Elements, nicht seinen Container. `%` bleibt unberührt.

### Auswirkung

| Element | Vorher | Nachher |
|---------|--------|---------|
| `98` | Große grüne Zahl | Gleich |
| `%` | Kleiner grauer Text im Label | Große grüne Schrift direkt nach der Zahl |
| `×` | Kleiner grauer Text im Label | Große grüne Schrift direkt nach der Zahl |
| Label-Text | `% Patientenzufriedenheit` | `Patientenzufriedenheit` |
| Counter-Animation | Läuft auf `.stats__value` | Läuft auf innerem `<span>`, Suffix bleibt stehen |

---

## 27.05.2026 – „Wie es funktioniert" Section mit scroll-getriebener Kartenanimation

### Was wurde gemacht

Eine neue Section `id="how-it-works"` wurde nach `#features` eingefügt. Auf Desktop (≥ 1024 px) bleibt ein zweispaltiger Bereich per `position: sticky` im Viewport hängen, während die Seite 300vh scrollt. Die drei Telefon-Mockup-Karten animieren als Fächer. Auf Mobile werden die drei Schritte vertikal gestapelt ohne Animation.

**Änderungen:**
- `index.html`: Neue Section mit Desktop-Sticky-Markup + Mobile-Fallback
- `style.css`: Alle Styles für `.how`, `.how__sticky`, `.how__cards`, `.how__step`, `.how__glow`, Mobile-Overrides
- `script.js`: Scroll-Animation-Block mit `lerp`, `getBoundingClientRect()`, `requestAnimationFrame`

---

### HTML/CSS/JS Konzept

#### `position: sticky` — was das ist und wie es funktioniert

```css
.how {
  height: 300vh;      /* Section ist 3× Viewport-Höhe */
}

.how__sticky {
  position: sticky;
  top: 0;
  height: 100vh;      /* klebt genau einen Viewport hoch */
}
```

`position: sticky` ist ein Hybrid aus `relative` und `fixed`:
- Solange das Element im normalen Scroll-Fluss der Seite liegt, verhält es sich wie `position: relative`.
- Sobald der Nutzer so weit scrollt, dass das Element die `top: 0`-Grenze erreichen würde, „klebt" es dort — wie `position: fixed` — bis der übergeordnete Container den Viewport verlässt.

**Die Section muss größer sein als der Sticky-Container.** Hier: Section = 300vh, Sticky = 100vh. Das ergibt 200vh „Scrollraum" in dem der Sticky-Container sichtbar bleibt und die Animation ablaufen kann.

```
┌─────────────────────┐  ← Section top (100vh von oben sichtbar)
│  .how__sticky       │  → klebt hier, Animation bei 0%
│  (sichtbar)         │
├─────────────────────┤  ← Nutzer scrollt 100vh
│  .how__sticky       │  → klebt weiter, Animation bei 50%
│  (sichtbar)         │
├─────────────────────┤  ← Nutzer scrollt 200vh
│  .how__sticky       │  → klebt weiter, Animation bei 100%
└─────────────────────┘  ← Section bottom verlässt Viewport → nicht mehr sticky
```

#### Scroll-Fortschritt mit `getBoundingClientRect()`

```javascript
const rect = section.getBoundingClientRect();
const scrollable = section.offsetHeight - window.innerHeight;
const progress = clamp(-rect.top / scrollable, 0, 1);
```

`getBoundingClientRect()` gibt die aktuelle Position des Elements relativ zum Viewport zurück. Entscheidend ist `rect.top`:

| Scroll-Position | `rect.top` | `progress` |
|-----------------|------------|------------|
| Section erreicht Viewport-Top | `0` | `0` |
| Halb durchgescrollt | `-100vh` | `0.5` |
| Section verlässt Viewport | `-200vh` | `1.0` |

`-rect.top` macht aus dem negativen Wert eine positive Zahl. Geteilt durch `scrollable` (= 200vh) ergibt sich ein Wert zwischen 0 und 1.

#### Lineare Interpolation (`lerp`) — was das ist und warum es Animationen weicher macht

```javascript
function lerp(a, b, t) {
  return a + (b - a) * t;
}
```

`lerp` steht für **L**inear Int**erp**olation. Sie berechnet einen Zwischenwert zwischen zwei Endpunkten `a` und `b`, gesteuert durch `t` (0 = Startpunkt, 1 = Endpunkt):

```
lerp(-35, 0, 0.0) = -35   (Karte voll nach links)
lerp(-35, 0, 0.5) = -17.5 (Karte halb gedreht)
lerp(-35, 0, 1.0) =   0   (Karte aufrecht)
```

**Warum Animationen weicher?** Ohne `lerp` würde man direkt zwischen Zuständen springen (z.B. auf Tastendruck). Mit `lerp` + einem kontinuierlichen `t`-Wert (hier: Scroll-Fortschritt) entsteht eine glatte Bewegung. Für jede Scroll-Position gibt es einen exakt berechneten Zwischenwert — kein Frame ist abgehackt.

Jede Phase (0–0.33, 0.33–0.66, 0.66–1.0) berechnet ein lokales `t`:

```javascript
// Phase 1: Karte 0 dreht von -35° zu 0°
const t = progress / 0.33;                  // 0 → 1 innerhalb der Phase
rotation = lerp(-35, 0, t);                  // -35° → 0°
```

#### `grid-area: 1 / 1` — Texte überlagern

```css
.how__text-col {
  display: grid;
}

.how__step {
  grid-area: 1 / 1; /* alle Texte in dieselbe Zelle */
  opacity: 0;
  transition: opacity 300ms ease;
}

.how__step.is-active {
  opacity: 1;
}
```

`grid-area: 1 / 1` platziert alle Schritte in dieselbe Grid-Zelle (Zeile 1, Spalte 1). Sie liegen direkt aufeinander. Nur der aktive hat `opacity: 1`, alle anderen `opacity: 0` mit CSS-Transition — so entsteht ein sanftes Ein-/Ausblenden beim Textwechsel, ohne `position: absolute`.

#### rAF-Throttling

```javascript
let ticking = false;
window.addEventListener('scroll', function () {
  if (!ticking) {
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

Das `scroll`-Event kann sehr schnell feuern (mehrmals pro Frame). Das `ticking`-Flag stellt sicher, dass `requestAnimationFrame` pro Frame nur einmal aufgerufen wird — sonst würde `update()` mehrfach pro Frame laufen, ohne dass es sichtbar einen Unterschied macht.

---

### Warum so und nicht anders

**300vh Section statt JS-gesteuerte Fixed-Position:** Das `position: sticky`-Modell delegiert das „Festhalten" komplett an den Browser — kein JS nötig für das Sticky-Verhalten selbst. Der Scrollraum (300vh) gibt dem Nutzer genug Zeit um alle 3 Phasen zu durchlaufen.

**Zwei separate HTML-Strukturen für Desktop/Mobile:** Die Animations-Logik funktioniert nur mit absolutem Karten-Stapel. Auf Mobile wäre das eine schlechte UX (kleine Bildschirme, kein Hover). Sauber getrennte Strukturen sind verständlicher als eine Struktur mit komplexen CSS-Overrides.

**`will-change: transform, opacity` auf den Karten:** Teilt dem Browser mit, dass sich diese Eigenschaften häufig ändern. Der Browser kann die Karten auf eigene Compositing-Layer legen — Änderungen laufen auf der GPU, ohne die restliche Seite neu zu zeichnen.

---

### Auswirkung

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Unter `#features` | Leer | Neue „Wie es funktioniert" Section |
| Desktop Scroll | — | Kartenstapel animiert durch 3 Phasen |
| Text links | — | Wechselt mit Fade-Transition pro Phase |
| Mobile (< 1024px) | — | 3 Schritte vertikal, kein Sticky |
| `position: sticky` | Unbekannt | Verstanden und eingesetzt |

---

## 27.05.2026 – #how-it-works komplett neu gebaut (saubere Neustruktur)

### Was wurde gemacht

Die erste Version wurde vollständig entfernt (HTML, CSS, JS) und von Grund auf neu gebaut — einfacher, direkter, ohne lerp oder rAF-Overhead.

**Änderungen:**
- `index.html`: `<section id="how-it-works">` mit `.how-sticky`, `.how-text`, `.how-cards`, 3× `.how-card`, `.how-glow`
- `style.css`: Neue `.how-*`-Klassen, Mobile-Fluss + Desktop-Sticky per `@media`
- `script.js`: Globale Funktion `initHowItWorks()`, direktes `element.style`-Setzen ohne lerp

---

### HTML/CSS/JS Konzept

#### `position: sticky` — das Kernprinzip

```css
/* Mobile */
#how-it-works { height: auto; }
.how-sticky   { display: flex; flex-direction: column; }  /* normaler Fluss */

/* Desktop */
@media (min-width: 1024px) {
  #how-it-works { height: 300vh; }   /* Section 3× so hoch wie Viewport */
  .how-sticky {
    position: sticky;
    top: 0;
    height: 100vh;                   /* klebt bei top:0, füllt genau den Viewport */
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

Das Rezept ist immer dasselbe: **Äußerer Container groß, innerer Container sticky + kleiner.** Die Section ist 300vh, der sticky Wrapper 100vh. Die Differenz (200vh) ist der Scrollraum — in dem bleibt der Wrapper im Viewport hängen und die Animation kann ablaufen.

#### Scroll-Fortschritt berechnen

```javascript
var scrollable = section.offsetHeight - window.innerHeight;
var progress   = (window.scrollY - section.offsetTop) / scrollable;
```

| Wert | Bedeutung |
|------|-----------|
| `section.offsetTop` | Abstand des Section-Anfangs zum Seitenanfang (in px) |
| `window.scrollY` | Wie weit die Seite bisher gescrollt wurde |
| `window.scrollY - section.offsetTop` | Wie weit **innerhalb** der Section gescrollt wurde |
| `section.offsetHeight - window.innerHeight` | Maximaler Scrollweg durch die Section (= 200vh) |

Das Ergebnis `progress` ist 0 am Eingang, 1 am Ausgang der Section. Danach wird er auf `[0, 1]` geclampt, sodass kein negativer oder über-1-Wert entstehen kann.

**Unterschied zu `getBoundingClientRect()`:** Die vorherige Version nutzte `rect.top`, das immer relativ zum Viewport ist und sich bei jedem Scroll-Event ändert. `section.offsetTop` ist eine statische Eigenschaft (Abstand zum Seitenanfang) — sie muss nicht bei jedem Frame neu berechnet werden. Für eine feste Section auf einer normalen Seite ist das einfacher und zuverlässiger.

#### Direkte Zustands-Zuweisung ohne lerp

```javascript
if (progress < 0.33) {
  cards[0].style.transform = 'translateX(-50%) rotate(0deg)';
  cards[0].style.opacity   = '1';
  cards[0].style.zIndex    = '3';
  // …
}
```

Kein `lerp`, kein `requestAnimationFrame`-Loop. Pro Scroll-Event wird einmal geprüft, in welcher Phase der Nutzer ist, und die Werte direkt gesetzt. Das ist einfacher zu lesen und zu debuggen: In der Browser-DevTools kann man `window.scrollY` und `section.offsetTop` direkt abfragen und den Zustand nachvollziehen.

**Wann ist lerp besser?** Wenn man weiche Übergänge zwischen den Phasengrenzen will (z.B. eine Karte die sich kontinuierlich dreht). Hier wechselt die Animation beim Überschreiten einer Phasengrenze sprunghaft — das ist das gewollte Verhalten (eine Karte ist immer klar "aktiv").

#### `nth-child` für Karten-Selektion

```css
/* .how-glow ist das erste Kind in .how-cards */
.how-card:nth-child(2) { /* = Karte 1 */ }
.how-card:nth-child(3) { /* = Karte 2 */ }
.how-card:nth-child(4) { /* = Karte 3 */ }
```

Da `.how-glow` das erste Kind von `.how-cards` ist, beginnen die Karten bei `nth-child(2)`. Das JS nutzt `querySelectorAll('.how-card')` — da gibt es kein Offset-Problem, weil querySelectorAll nur `.how-card`-Elemente zurückgibt (Index 0, 1, 2).

#### Mobile: CSS übernimmt alles

Auf Mobile greift `initHowItWorks()` trotzdem, aber da `#how-it-works` nur `height: auto` hat und `.how-sticky` nicht sticky ist, scrollt der Nutzer einfach durch den Inhalt. Das JS setzt trotzdem `transform` und `opacity` — auf Mobile ist das aber irrelevant, weil die Karten im Stack-Layout keine `position: absolute` haben und das `transform` dort keine sichtbare Wirkung hat. Die drei Textblöcke haben `opacity: 1; position: static` per CSS (Mobile-Standard), was durch das JS-Setzen überschrieben werden könnte.

**Wichtig:** Das JS-Script setzt opacity auf allen Textblöcken. Damit das auf Mobile nicht die Texte ausblendet, sollte `initHowItWorks` nur auf Desktop laufen. In der aktuellen Version läuft es auf allen Geräten — für eine robuste Lösung könnte man `if (window.innerWidth < 1024) return;` ergänzen.

---

### Auswirkung

| Bereich | Alt | Neu |
|---------|-----|-----|
| Komplexität JS | lerp, rAF, Phasen-Objekte | Drei einfache if/else-Blöcke |
| Scroll-Progress | `getBoundingClientRect()` (dynamisch) | `offsetTop` (statisch) |
| Übergänge | Gleitend (lerp) | Phasenweise direkt |
| HTML-Klassen | `how__` BEM-Notation | `how-` flach |
| Mobile | Separate Markup-Struktur | CSS-Overrides |

---

## 27.05.2026 – #how-it-works Debugging und Fixes

### Was wurde gemacht

Zwei Bugs in `script.js` behoben:

1. **Mobile-Guard fehlte** — `initHowItWorks()` lief auch auf < 1024px
2. **`section.offsetTop` → `getBoundingClientRect().top + window.scrollY`** für zuverlässigere Seiten-Position
3. **`console.log('progress:', progress)`** temporär hinzugefügt

Das `.how-glow`-Element war bereits korrekt in `index.html` vorhanden (Zeile 266) und in `style.css` gestylt.

---

### HTML/CSS/JS Konzept

#### Bug 1: Fehlender Viewport-Guard

```javascript
// Vorher: kein Guard – läuft auf allen Geräten
function initHowItWorks() {
  var section = ...

// Nachher:
function initHowItWorks() {
  if (window.innerWidth < 1024) return;  // ← Guard
```

Ohne den Guard passiert Folgendes auf Mobile:
- `#how-it-works` hat `height: auto` (CSS-Mobile-Wert), also z.B. 600px Inhaltshöhe
- `scrollable = 600 - 900 = -300` (negativ, weil Content kleiner als Viewport)
- Die Clamp-Logik setzt `progress = 0` → Phase 1 → `texts[1].style.opacity = '0'`
- Das überschreibt das CSS `.how-text-block { opacity: 1 }` aus den Mobile-Styles
- Ergebnis: Schritt 2 und 3 sind auf Mobile unsichtbar

`if (window.innerWidth < 1024) return;` stoppt die Funktion sofort auf kleinen Bildschirmen.

#### Bug 2: `offsetTop` vs. `getBoundingClientRect().top + window.scrollY`

```javascript
// Vorher:
var sectionTop = section.offsetTop;

// Nachher:
var sectionTop = section.getBoundingClientRect().top + window.scrollY;
```

| Eigenschaft | `offsetTop` | `getBoundingClientRect().top + scrollY` |
|-------------|-------------|----------------------------------------|
| Relativ zu | `offsetParent` (nächstes positioniertes Elternelement) | Immer dem Seitenanfang |
| Berücksichtigt Transforms | Nein | Ja |
| Berücksichtigt Scroll | Nein (statischer Wert) | Ja (+ scrollY kompensiert) |
| Verlässlichkeit | Gut bei flachem DOM | Zuverlässig in allen Layouts |

`getBoundingClientRect().top` gibt die Distanz vom **Viewport-Rand** zum Element zurück (negativ wenn das Element über den Viewport hinausgeschrollt ist). `+ window.scrollY` addiert den aktuellen Scrollwert — das Ergebnis ist die absolute Seiten-Position des Elements, unabhängig davon wo im DOM-Baum es sitzt.

#### `console.log` für Debugging

```javascript
console.log('progress:', progress);
```

Öffne die Browser-DevTools (F12 oder Cmd+Option+I) → Tab „Console". Wenn du scrollst, erscheinen dort die Zahlen 0 → 1. Damit kann man prüfen:
- Wird die Funktion aufgerufen? (Zahlen erscheinen → ja)
- Steigt progress korrekt? (0 → 0.33 → 0.66 → 1 → korrekt)
- Springt progress sofort auf 1? (offsetTop/scrollable-Problem)

Nach dem Debugging sollte der `console.log` wieder entfernt werden.

---

### Auswirkung

| Problem | Ursache | Fix |
|---------|---------|-----|
| Schritt 2+3 auf Mobile unsichtbar | JS überschreibt CSS ohne Viewport-Check | `if (window.innerWidth < 1024) return` |
| Potenzielle falsche Scroll-Position | `offsetTop` relativ zu `offsetParent` | `getBoundingClientRect().top + scrollY` |
| Kein Debugging-Info | `console.log` fehlte | Hinzugefügt |

---

## 27.05.2026 – Scroll-Animation: Lerp + rAF + gecachter sectionTop

### Was wurde gemacht

`initHowItWorks()` wurde komplett ersetzt. Die Karten rotieren jetzt smooth statt zu springen. Außerdem wurden `perspective` und `will-change` ins CSS ergänzt.

**Änderungen:**
- `script.js`: Neue `initHowItWorks`-Implementierung mit `lerp`, rAF-Throttling, gecachtem `howSectionTop`, Überlappende Text-Transitions
- `style.css`: `perspective: 800px` auf `.how-cards`, `will-change: transform, opacity` auf `.how-card`
- `console.log` entfernt

---

### HTML/CSS/JS Konzept

#### Warum PNG-Assets statt HTML/CSS 3D?

Die drei vorhandenen Dateien `story-1.png`, `story-2.png`, `story-3.png` zeigen Screenshots der echten Wito-App (Chat-UI, Buchungsbestätigung). Das mit HTML/CSS nachzubauen würde Tage dauern und würde trotzdem schlechter aussehen. Die PNGs sind die richtige Wahl — einfache `<img>`-Tags mit CSS-Transform-Rotation genügen.

#### `lerp` für smooth Rotation

```javascript
function lerp(a, b, t) { return a + (b - a) * t; }

// Phase 1: Karte 0 dreht von -35° zu 0° während progress von 0 → 0.33 geht
var t  = progress / 0.33;        // lokaler Fortschritt 0 → 1
var r0 = lerp(-35, 0, t);        // -35° → 0° smooth
var o0 = lerp(0.4, 1, t);        // opacity 0.4 → 1 smooth
```

Ohne `lerp` war der Code:
```javascript
if (progress < 0.33) {
  cards[0].style.transform = 'translateX(-50%) rotate(0deg)'; // springt sofort auf 0°
}
```

Mit `lerp` interpoliert die Rotation kontinuierlich zwischen Start- und Endwert — für jeden Progress-Wert gibt es einen exakten Zwischenwert.

#### `howSectionTop` cachen

```javascript
var howSectionTop = null; // außerhalb der Funktion

function initHowItWorks() {
  if (howSectionTop === null) {
    howSectionTop = section.getBoundingClientRect().top + window.scrollY;
  }
  // ab jetzt: howSectionTop ist stabil, wird nicht mehr neu berechnet
}
```

**Warum cachen?** `getBoundingClientRect().top + window.scrollY` gibt die absolute Seiten-Position zurück — dieser Wert ändert sich normalerweise nicht. Trotzdem ist es effizienter und zuverlässiger, ihn einmalig zu berechnen als bei jedem der hunderte Scroll-Events.

#### rAF-Throttling

```javascript
var howTicking = false;
window.addEventListener('scroll', function () {
  if (!howTicking) {
    requestAnimationFrame(function () {
      initHowItWorks();
      howTicking = false;
    });
    howTicking = true;
  }
}, { passive: true });
```

Das `scroll`-Event kann 100+ Mal pro Sekunde feuern, aber der Bildschirm refresht maximal 60 Mal/Sekunde. `requestAnimationFrame` sorgt dafür, dass `initHowItWorks()` maximal einmal pro Frame läuft — das `howTicking`-Flag verhindert das Stapeln von rAF-Calls.

#### Überlappende Text-Transitions

```javascript
// Vorher: hartes An/Aus an exakt 0.33 und 0.66
texts[0].style.opacity = progress < 0.33 ? '1' : '0';

// Jetzt: weiche Überlappung — Text 1 bleibt bis 0.4, Text 2 beginnt bei 0.3
texts[0].style.opacity = progress < 0.4  ? '1' : '0';
texts[1].style.opacity = (progress >= 0.3 && progress < 0.7) ? '1' : '0';
texts[2].style.opacity = progress >= 0.6  ? '1' : '0';
```

Zwischen 0.3 und 0.4 sind Text 1 und 2 gleichzeitig sichtbar (beide `opacity: 1`). Kombiniert mit `transition: opacity 300ms ease` (CSS) entsteht ein weiches Cross-Fade.

#### `perspective` für Tiefen-Eindruck

```css
.how-cards {
  perspective: 800px;
}
```

`perspective` definiert die "Augendistanz" für 3D-Transformationen. Auch wenn wir nur 2D-`rotate()` nutzen, beeinflusst `perspective` das visuelle Erscheinungsbild bei bereits-leicht-perspektivischen Arrangements: die hinter den Karten liegenden Elemente (Glow) wirken tiefer, und der gesamte Stapel gewinnt subtile Plastizität.

#### `will-change` für GPU-Compositing

```css
.how-card {
  will-change: transform, opacity;
}
```

Teilt dem Browser vorab mit: "Diese Eigenschaft ändert sich oft." Der Browser kann die Karten auf eigene Compositing-Layer verschieben — Änderungen laufen auf der GPU und erfordern kein Re-Paint der restlichen Seite.

---

### Auswirkung

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Kartenrotation | Springt auf Zielwert | Smooth interpoliert via lerp |
| Text-Übergang | Schaltet an exakter Grenze | Weiche Überlappung bei ~0.3–0.4 und 0.6–0.7 |
| Performance | Direkte DOM-Updates | GPU-optimiert via will-change + rAF |
| `sectionTop` | Jedes Event neu berechnet | Einmalig gecacht |
| Tiefe | Flat 2D | `perspective: 800px` für Tiefen-Gefühl |

---

## 27.05.2026 – Kartengröße und Rotationsrichtung nach Referenzbildern korrigiert

### Was wurde gemacht

Zwei konkrete Fehler behoben: Karten waren zu klein und fächerten in die falsche Richtung.

**Änderungen:**
- `style.css`: `.how-cards` auf 600px Höhe, `.how-card` auf `min(340px, 85vw)` Breite + `height: auto`, `.how-card img` mit `object-fit: contain`, nth-child Rotationswerte korrigiert, Desktop-Flex ergänzt
- `script.js`: Phasenwerte für r1/r2 von negativen auf positive Winkel geändert (story-2/3 fächern rechts, nicht links)

---

### HTML/CSS/JS Konzept

#### `min()` für responsive Breite

```css
.how-card {
  width: min(340px, 85vw);
}
```

`min()` wählt den kleineren der beiden Werte:
- Auf Desktop (z.B. 1440px): `min(340px, 1224px)` → **340px** (feste Maximalbreite)
- Auf Mobile (z.B. 375px): `min(340px, 318px)` → **318px** (85% des Viewports)

Ohne `min()` würde `width: 340px` auf kleinen Bildschirmen horizontal überlaufen. Mit `min()` passt sich die Karte automatisch an — kein Media Query nötig.

#### `object-fit: contain` vs. `cover`

```css
.how-card img {
  object-fit: contain;   /* Bild vollständig sichtbar, kein Beschnitt */
}
```

| Wert | Verhalten |
|------|-----------|
| `contain` | Bild wird proportional skaliert bis es vollständig hineinpasst — kein Crop |
| `cover` | Bild füllt den Container vollständig aus — Teile werden abgeschnitten |
| `fill` | Bild wird verzerrt um den Container zu füllen |

Da die Wito-App-Screenshots in voller Höhe gezeigt werden sollen (kein Beschnitt), ist `contain` hier richtig.

#### Rotationsrichtung und Fächer-Logik

```
Falsche Richtung (vorher):          Richtige Richtung (jetzt):
  story-1: -35° → 0°                  story-1: -35° → 0° (links → aktiv)
  story-2: -15° (links)               story-2: +22° (wartet rechts)
  story-3:  +5° (fast gerade)         story-3: +38° (wartet weiter rechts)
```

Mit `transform-origin: bottom center` und positivem Winkel neigt sich die **Oberkante der Karte nach rechts** (Uhrzeigersinn). Mit negativem Winkel neigt sie sich nach links.

Die Referenzbilder zeigen:
- **Wartende Karten** (noch nicht aktiv): neigen sich nach rechts → **positive Winkel**
- **Bereits verwendete Karten** (schon aktiv gewesen): neigen sich nach links → **negative Winkel**
- **Aktive Karte**: senkrecht → **0°**

Der Übergang in Phase 2: story-2 kommt von +22° (rechts) auf 0° (aktiv) — das sieht aus wie eine Karte die "nach vorne klappt." Phase 1 verwendete story-2 bei -15° (links) — das war visuell falsch.

---

### Auswirkung

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Kartenbreite | 220px (zu schmal) | min(340px, 85vw) — groß und lesbar |
| Kartenhöhe | implizit durch Bild | auto — Bild bestimmt Höhe |
| story-2 Startposition | -15° (links) | +22° (rechts) |
| story-3 Startposition | +5° (fast gerade) | +38° (deutlich rechts) |
| Bilder | Nur `width: 100%` | + `height: auto` + `object-fit: contain` |
| Container-Höhe | 480px | 600px |

---

## 29.05.2026 – #how-it-works komplett neu gebaut

### Was wurde gemacht

Die gesamte Section `#how-it-works` wurde von Grund auf neu entworfen und implementiert — HTML, CSS und JS.

**Kernänderungen:**
1. **HTML-Reihenfolge** geändert: `.how-cards` steht jetzt vor `.how-text` im DOM. Das sorgt auf Mobile dafür, dass Karten oben und Texte unten erscheinen (natürlicher Lesefluss: Bild → Erklärung).
2. **CSS-Grid auf Desktop** (`order: 1/2`): Obwohl die Karten im DOM zuerst kommen, erscheinen die Texte mit `order: 1` visuell links und die Karten mit `order: 2` rechts.
3. **Startzustände** neu definiert: Karte 1 steht aufrecht (0°), Karte 2 liegt 45° rechts dahinter, Karte 3 liegt 90° dahinter (fast horizontal).
4. **2-Phasen-Animation** über Scroll (statt 3 Phasen):
   - Phase 1 (progress 0→0,5): Karte 1 rotiert links raus (0°→−45°), Karte 2 kommt zur Mitte (45°→0°)
   - Phase 2 (progress 0,5→1,0): Karte 2 rotiert links raus, Karte 3 kommt zur Mitte
5. **Kein `cssText` mehr**: Jedes Property (`transform`, `opacity`, `zIndex`) wird separat gesetzt — leichter debugbar.
6. **Mobile**: kein JS, keine sticky-Position — Karten stehen aufrecht im normalen Dokumentfluss.

---

### HTML/CSS/JS Konzept

#### CSS `order` in Flexbox / Grid

```css
/* DOM-Reihenfolge: Karten zuerst */
.how-cards { order: 2; } /* aber rechts auf Desktop */
.how-text  { order: 1; } /* erscheint links auf Desktop */
```

`order` ist eine CSS-Eigenschaft, die nur innerhalb von Flex- oder Grid-Containern wirkt. Sie verändert die **visuelle** Reihenfolge, nicht die DOM-Reihenfolge. Der Standardwert ist `0` — wer eine niedrigere Zahl hat, erscheint zuerst. Hier: Text (order 1) erscheint vor den Karten (order 2).

**Warum sinnvoll?** Auf Mobile wollen wir Karten oben, Texte unten. Im DOM stehen Karten zuerst → natürlicher Fluss. Auf Desktop wollen wir Texte links, Karten rechts → `order` dreht die Reihenfolge visuell um, ohne das HTML anzufassen.

#### `transform-origin: bottom center`

Der Rotationspivot jeder Karte liegt an ihrem unteren Mittelpunkt. So sieht die Rotation aus wie ein Fächer, der sich öffnet — die Kartenunterkante bleibt fest, die Oberseite schwenkt nach links oder rechts.

#### 2-Phasen-Scroll mit `lerp`

```js
var lerp = function (a, b, t) { return a + (b - a) * t; };
```

`lerp` bedeutet **Linear Interpolation** (lineare Interpolation). Mit `t` zwischen 0 und 1 berechnet sie jeden Zwischenwert zwischen `a` und `b`:
- `t = 0` → Ergebnis ist `a`
- `t = 0,5` → Ergebnis ist Mitte zwischen a und b
- `t = 1` → Ergebnis ist `b`

```js
// Progress: Wie weit ist der User in der Section gescrollt?
var progress = Math.max(0, Math.min(1,
  (window.scrollY - section.offsetTop) / (section.offsetHeight - window.innerHeight)
));
```

- `section.offsetTop`: Abstand der Section vom oberen Seitenrand (in px)
- `section.offsetHeight - window.innerHeight`: der scrollbare Bereich innerhalb der Section (bei 300vh ist das ca. 200vh)
- Das Ergebnis ist eine Zahl zwischen 0 (Section gerade sichtbar) und 1 (Section komplett gescrollt)

#### Viewport-Guard

```js
if (window.innerWidth < 1024) return;
```

Auf Mobilgeräten wird die Funktion sofort verlassen. Das verhindert, dass JS-Code Styles setzt, die das Mobile-Layout zerstören würden. „Guard" = Wächter, der am Eingang prüft, ob die Bedingung erfüllt ist.

#### rAF-Throttling

```js
var ticking = false;
window.addEventListener('scroll', function () {
  if (!ticking) {
    requestAnimationFrame(function () { update(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
```

`scroll`-Events feuern sehr oft (bis zu 60× pro Sekunde). `requestAnimationFrame` synchronisiert die Ausführung mit dem Bildschirm-Refresh — das verhindert unnötige Berechnungen zwischen den Frames. `ticking` ist ein Flag, das verhindert, dass mehrere Frames gleichzeitig angefordert werden.

#### CSS transition nur auf opacity der Texte

```css
.how-text-block {
  transition: opacity 300ms ease;
}
```

Auf den Karten gibt es **kein** `transition`. Würde man `transition: transform 300ms` setzen, würde der Browser beim Scrollen immer etwas „hinterher hinken" — die Karte folgt der Maus mit Verzögerung. Das sieht unnatürlich aus. Stattdessen setzt JS `transform` direkt per `element.style.transform` → sofortige Reaktion.

Für die Texte ist eine sanfte Überblendung (300ms) angenehmer als ein hartes Ein-/Ausschalten — deshalb nutzen die Texte `transition: opacity`.

---

### Vorher / Nachher

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Startzustand Karte 1 | −35° (links) | 0° (aufrecht) |
| Startzustand Karte 2 | +22° (rechts) | +45° |
| Startzustand Karte 3 | +38° (rechts) | +90° |
| Phasen | 3 × 33% | 2 × 50% |
| Rotationsrichtung | uneinheitlich | klar: aktiv → links |
| Mobile-Layout | position absolute (kaputt) | normaler Fluss, alle Karten sichtbar |
| JS-Scope | globale Variablen | IIFE (sauber gekapselt) |

---

## 29.05.2026 – #how-it-works Layout-Korrektur: Karten zentriert, Text schmaler, Opacity 1

### Was wurde gemacht

Drei Korrekturen basierend auf dem Design-Screenshot:

1. **Karten komplett mittig**: Grid-Layout (`1fr 1fr`) durch absolutes Positioning ersetzt. `.how-cards { position: absolute; inset: 0; }` füllt den gesamten Sticky-Bereich. Karten bei `left: 50%` + `translateX(-50%)` sind damit auf der vollen Seitenbreite zentriert — nicht nur in einer halben Spalte.
2. **Text schmaler**: `.how-text` ist jetzt `position: absolute; left: 2.5rem; top: 18vh; width: clamp(240px, 22vw, 300px)`. Kein Grid mehr → Text sitzt links, Karten können dahinter/davor frei fächern.
3. **Opacity 1 für alle Karten**: CSS-Startzustände auf `opacity: 1` geändert. JS setzt keine Opacity mehr — nur noch `transform` und `z-index` werden animiert.

---

### HTML/CSS/JS Konzept

#### `position: absolute; inset: 0;` vs. `position: relative; height: 100%;`

Vorher: `.how-cards` war in einem Grid mit `position: relative; height: 100%`. Die Karten bei `left: 50%` waren zentriert in der rechten Grid-Spalte (≈ 75% der Seitenbreite).

Nachher: `.how-cards { position: absolute; inset: 0; }` — `inset: 0` ist eine Kurzform für `top: 0; right: 0; bottom: 0; left: 0`. Der Container füllt seinen positioning context (`.how-sticky`). Karten bei `left: 50%` sind jetzt zentriert in 100% der Seitenbreite. ✓

#### Warum kein Grid mehr?

Grid erzwingt, dass Text und Karten in separaten Spalten leben. Für dieses Design soll der Text aber links *über* den Karten schweben — das geht nur mit absoluter Positionierung beider Elemente. Beide sind jetzt absolut positioniert:
- `.how-text`: oben-links fixiert (`left: 2.5rem; top: 18vh`)
- `.how-cards`: füllt den gesamten Container (`inset: 0`)

#### `clamp(240px, 22vw, 300px)` für die Textbreite

`clamp(min, bevorzugt, max)` wählt den mittleren Wert, sofern er zwischen min und max liegt:
- Auf kleinen Desktops (1024px): `22vw = 225px` → kleiner als min → Ergebnis: `240px`
- Auf mittleren (1100px): `22vw = 242px` → zwischen min und max → Ergebnis: `242px`
- Auf großen Screens (≥1365px): `22vw ≥ 300px` → größer als max → Ergebnis: `300px`

Das gibt eine schmale Textspalte, die auf kleinen Desktops nicht zu eng wird.

---

### Vorher / Nachher

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Layout-Methode | CSS Grid `1fr 1fr` | Absolute Positionierung |
| Karten-Zentrierung | In rechter Spalte (≈ 75% der Breite) | Auf voller Seitenbreite (50%) |
| Textbreite | 50% Viewport-Breite | max. 300px (clamp) |
| Karten-Opacity | 1.0 / 0.6 / 0.3 (gestaffelt) | 1.0 für alle |
| Opacity in JS | `lerp(1, 0.3, t)` etc. | Entfernt — nur Transform + z-index |

---
