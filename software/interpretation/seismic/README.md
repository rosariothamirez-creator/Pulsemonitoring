# Seismic Module

## Overview

This module (`event_detection.py`) is the seismic evaluation layer of the
PULSE architecture. It correlates the velocity vectors extracted from the
Digital Signal Processing (DSP) pipeline (see `software/processing/`)
with the Peak Ground Velocity (PGV) of an event, and converts that value
into a Modified Mercalli Intensity (MMI) estimate using an empirical
seismological relationship.

## Evaluated parameters

* **Peak Ground Velocity — PGV (mm/s)** — computed by `calcular_pgv()`,
  which supports two methods:
  * `vetor_3d` — the Euclidean norm of the three axes,
    `√(vx² + vy² + vz²)`, taking the maximum over time.
  * `eixo_isolado` — the maximum absolute value across the three axes
    individually, `max(|vx|, |vy|, |vz|)`.
  * Which of the two methods `geonode_analyzer.py` uses by default has
    not been confirmed yet — see Open Items below.
* **Modified Mercalli Intensity (MMI)** — derived from PGV via the
  empirical relationship described below.

## Implemented method

### Wald et al. (1999) empirical relationship

`equacao_wald_mercalli()` converts PGV (received in mm/s) to MMI:

1. Convert mm/s to cm/s (`pgv_cm_s = pgv_mm_s / 10.0`), as required by the
   original empirical formula.
2. If `pgv_cm_s <= 0.1`, return MMI = 1.0 directly (guards against
   `log(0)` for residual/near-zero signals).
3. Otherwise, compute `mmi = 3.47 * log10(pgv_cm_s) + 2.35`.
4. Clamp the result to the physical range of the scale:
   `max(1.0, min(10.0, mmi))`.

### Intensity classification

`classificar_mercalli()` rounds the MMI value to the nearest integer
degree and maps it to a Roman numeral and a phenomenological description:

| Degree | Roman | Description |
|---|---|---|
| 1 | I | Instrumental (Não sentido) |
| 2 | II | Ligeiro (Sentido em repouso) |
| 3 | III | Ligeiro (Sentido no interior) |
| 4 | IV | Moderado (Janelas tremem) |
| 5 | V | Forte (Sentido no exterior) |
| 6 | VI | Bastante Forte (Danos em estuque) |
| 7 | VII | Muito Forte (Danos ligeiros estruturais) |
| 8 | VIII | Ruinoso (Queda de muros) |
| 9 | IX | Destrutivo (Danos severos generalizados) |
| 10 | X+ | Desastroso (Colapso eminente) |

## Outputs

For each processed event, the seismic module returns:

1. **PGV (mm/s)** — the computed Peak Ground Velocity for the event.
2. **MMI value** — the exact (non-rounded) intensity value from the Wald
   equation, clamped to [1.0, 10.0].
3. **Mercalli degree and description** — the rounded Roman-numeral degree
   and its phenomenological description, used in the generated report
   (see example in `data/processed/grafico_sismograma.jpg`).

## Open items

* **`event_detection.py` is not fully reviewed yet.** The version seen so
  far ends mid-function (the `return` statement of `classificar_mercalli`
  has not been confirmed), and it is not yet known whether epicenter
  trilateration logic lives in this file or only in
  `geonode_analyzer.py`. This README will be updated once the full file
  is reviewed.
* **Default PGV method:** it has not been confirmed whether
  `geonode_analyzer.py` calls `calcular_pgv()` with `vetor_3d` or
  `eixo_isolado` by default, or whether this is configurable per event.
* **Epicenter trilateration:** as documented in `docs/validation.md`, the
  trilateration logic seen in `geonode_analyzer.py` uses
  simulated/randomized node positions, not real multi-sensor timestamps.
  Status: roadmap / proof-of-concept, not a validated capability. Whether
  this logic is duplicated or relocated in `event_detection.py` is one of
  the items to confirm above.

## Related documentation

* `docs/standards.md` — note: PGV/Mercalli is documented separately from
  the four environmental standards, as it answers a different question
  (seismic intensity vs. structural vibration compliance).
* `docs/references.md` — full citation for Wald et al. (1999).
* `docs/validation.md` — validated vs. unvalidated capabilities, including
  the epicenter trilateration caveat.
