# modellfabrik-webshop

## Client

### Install dependencies

```
npm install
```

### Start client (development, hot-reload)

```
npm run serve
```

### Start client (production)

```
npm run start
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Server

### Install dependencies

```
npm install
```

### Start server

```
npm run start
```

## Implementationshinweise für SPS

In diesem Repo befindet sich ein TIA Projekt, welches einen Datenbaustein enthält. Dieser Baustein soll in die SPS der Fertigungsstation der Modellfabrik eingebunden werden. Unser Server schreibt die gewünschte Bestellung in den Datenbaustein und liest den Boolean `orderCompleted` aus, um herauszufinden, ob die Bestellung abgeschlossen ist.

### Ablauf einer Bestellung

In der Weboberfläche des Servers gibt man eine Bestellung auf. Der Server schreibt die Bestellung in den Datenbaustein der SPS, sobald der boolean `orderCompleted` auf true gesetzt ist. Beim Anlegen des Datenbausteins in TIA wird daher empfohlen das Feld mit `true` zu initialisieren. Der Server schreibt die Bestellungen in der Reihenfolge, wie sie in der Weboberfläche aufgegeben wurden. Ausnahme bilden Bestellungen, welche basierend auf dem aktuellen Lagerstand der SPS in der Fertigungsstation oder dem Hochlager aktuell nicht ausgeführt werden können. Solche Bestellungen werden nie an die SPS übertragen und übersprungen bis die nötigen Materialien in den Lagern vorhanden sind.

Beim übertragen der Bestellung schreibt der Server in die folgenden Felder des Datenbausteins:

```
//Bestellungs ID, wird mit jeder Bestellung um 1 hochgezählt
orderID

//wird von true auf false gesetzt
orderCompleted

//wird auf den Defaultwert 01.01.1970 gesetzt
timeOrderCompleted

//Höhe der Elemente des Turms A
heightA1
heightA2
heightA3
heightA4
heightA5

//Höhe der Elemente des Turms B
heightB1
heightB2
heightB3
heightB4
heightB5
```

Die SPS kann anhand des `orderCompleted` Feldes erkennen, ob eine neue Bestellung angekommen ist. Wenn das Feld auf `false` gesetzt ist, wurde eine neue Bestellung übertragen.

Die `height` Felder geben die Höhe der Turmbausteine in aufsteigender Reihenfolge an. `height1` ist immer der unterste Baustein ist. Wenn ein Turm weniger als 5 Bausteine benutzt, werden die restlichen `height` Felder vom Server auf 0 gesetzt. Das höchste Bit bestimmt die Farbe des Bausteins 0 = Silber, 1=Blau.

Sobald die SPS die Bestellung ausgeführt hat und bereit für eine neue Bestellung ist, setzt sie das `orderCompleted` Feld auf `true`. Der Server überträgt daraufhin eine neue Bestellung.

### Lagerstand

In regelmäßigen Zeitabständen (aktuell 10 sek) liest der Server den aktuellen Lagerbestand aus dem Datenbaustein der Fertigungsstation.

```
//Lagerbestand in der Fertigungsstation
productionStock15mmSilver
productionStock18mmSilver
productionStock22mmSilver
productionStock15mmBlue
productionStock18mmBlue
productionStock22mmBlue
```

Der Lagerbestand des Hochregals wird ebenfalls aus einem entsprechenden Datenbaustein gelesen.

Die SPS sollte die Lagerbestände möglichst aktuell halten, da der Server anhand der Lagerbestände entscheidet, welche Bestellung als nächstes zur SPS übertragen wird.
