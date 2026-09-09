# Introit — Brand

## The name

An **introit** is the entrance chant that opens the Mass: the first words the assembly
hears and sees. That is precisely the job of this software — it is what goes up on the
screen when worship begins.

It also happens to carry "intro" inside it, so people who have never opened a missal
still remember it and spell it right on the first try. That combination — exact
liturgical meaning for the people who know, plain recall for everyone else — is why it
was chosen over `oremus`, `graduale`, and `kyrie`.

Pronounced *IN-tro-it*.

## Positioning

> Introit is presentation software for churches that runs in a browser and works with
> the internet unplugged.

Not a worship-media marketplace. Not a subscription. A tool that a volunteer can open
on a borrowed laptop ten minutes before Mass and drive without training.

## Voice

Plain, unhurried, concrete. The operator is usually a volunteer under time pressure in
a dim room, so the interface speaks in nouns and verbs, never in slogans. No
exclamation marks. No "seamless", "effortless", "elevate", "unleash". Where a number
exists, use the number.

Indonesian and English are both first-class. Liturgical terms stay in their received
form — *Kyrie*, *Gloria*, *Bapa Kami* — never translated into marketing language.

## Palette

Presentation software lives in dark rooms. The interface is dark by default, and the
accent is drawn from liturgical gold — candlelight rather than a neon highlighter.

| Token           | Hex       | Use                                              |
| --------------- | --------- | ------------------------------------------------ |
| `ink`           | `#0A0B0E` | App background, the darkest surface               |
| `panel`         | `#131519` | Panels, rails, cards                              |
| `panel-raised`  | `#1B1E24` | Hover, popovers, inputs                           |
| `line`          | `#262A32` | Borders, dividers                                 |
| `muted`         | `#8A9099` | Secondary text, labels                            |
| `text`          | `#E7E9EC` | Primary text                                      |
| `gold`          | `#D4A24C` | Primary accent, selection, focus                  |
| `gold-bright`   | `#E9BC66` | Hover on gold                                     |
| `live`          | `#C2413A` | Live state only — never decorative                |
| `preview`       | `#4A7FB5` | Preview state                                     |

`live` red is reserved. If red appears anywhere that is not currently going to the
audience screen, that is a bug — the operator must be able to read the room state from
across a dark loft in half a second.

## Typography

- **Display** — Instrument Serif. Wordmark and landing headings. Carries the
  liturgical weight without tipping into pastiche.
- **Interface** — Inter. Everything inside the studio. Tight, legible at 12–13px in a
  dark room.
- **Meta** — JetBrains Mono. Slide indices, timecodes, keyboard hints, verse tags.

## The mark

A Romanesque arch — the threshold of the nave, which is where an introit is sung — with
a beam of light widening upward inside it. The beam doubles as a projector throw and as
a stylised **I**.

It is one closed shape plus one trapezoid, so it survives being rendered at 16px in a
browser tab and still reads as a doorway, not a blob. Gold beam on ink, or ink beam on
gold for reversed contexts. Never a gradient, never more than two colours.
