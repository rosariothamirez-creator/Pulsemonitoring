# Environmental & Structural Module

## Overview

This module (`standards_check.py`) is the normative evaluation layer of
the PULSE architecture. It correlates the kinematic vectors and dominant
frequency extracted from the Digital Signal Processing (DSP) pipeline
(see `software/processing/`) against the velocity limits defined by four
vibration standards, to assess structural integrity risk and occupational
exposure for a given event.

## Evaluated parameters

* **Dominant Frequency (Hz)** — extracted via Fast Fourier Transform
  (FFT), used to select the applicable frequency band for the
  frequency-dependent standards (NP 2074, DIN 4150-3).
* **Peak Particle Velocity — PPV (mm/s)** — the maximum absolute velocity
  recorded on a single isolated axis: `PPV = max(|vx|, |vy|, |vz|)`.
* **Peak Vector Sum — PVS (mm/s)** — the resultant 3D vector magnitude:
  `PVS = √(vx² + vy² + vz²)`.

## Implemented standards

The module implements the threshold logic of four standards. Two
(NP 2074, DIN 4150-3) use full frequency-band × structure-class lookup
tables; the other two (BS 5228-2 / ISO 2631-2, and BS 6472-1) use fixed
reference thresholds.

### 1. NP 2074:2015 (Portugal)
* **Method:** PVS evaluation (tri-orthogonal vector sum).
* **Structure classes:** Sensitive, Standard ("Corrente"), Reinforced
  ("Reforçada").
* **Frequency bands:** `[0, 10]` Hz, `(10, 40]` Hz, `(40, +∞)` Hz.
* Each combination of frequency band and structure class maps to a
  specific velocity limit; PVS is compared against that limit.

### 2. DIN 4150-3:2016 (Germany)
* **Method:** PPV evaluation (single isolated axis).
* **Structure classes:** Sensitive/Historical, Residential, Industrial.
* **Frequency bands:** `[0, 10]` Hz, `(10, 50]` Hz, `(50, +∞)` Hz.
* Same band × class lookup approach as NP 2074, with its own limit table.

### 3. BS 5228-2 / ISO 2631-2 — Environmental / Occupational
* **Method:** PPV evaluation, fixed thresholds (not frequency-dependent
  in the current implementation).
* **Thresholds:** 0.15 mm/s for continuous background vibration; 0.30
  mm/s for transient/impulsive vibration (e.g. blasting), typical in
  mining and heavy civil works contexts.

### 4. BS 6472-1 — Rotating machinery
* **Method:** PPV evaluation, fixed threshold, evaluated independently of
  structural resonance.
* **Threshold:** 1.0 mm/s, applied when the vibration source is
  classified as rotating machinery rather than blasting/impact.

> Note: ISO 2631-2 technically specifies frequency-weighted acceleration
> for human comfort assessment, not raw PPV in mm/s. The current
> implementation uses the simplified PPV-based threshold above; full
> frequency weighting is listed as future work — see `docs/validation.md`.

## Decision logic

1. Compute the relevant metric (PPV or PVS) for the event.
2. Determine the dominant frequency via FFT.
3. Look up the velocity limit for the selected standard, frequency band
   (where applicable), and structure class.
4. Compare: if the measured value exceeds the limit, classify as
   **ALERTA**; otherwise **ESTRUTURA SEGURA**.

## Outputs

For each processed event, `standards_check.py` returns:

1. **Dynamic threshold limit** — the velocity limit (mm/s) selected for
   the event's frequency band and structure class (where applicable).
2. **Compliance state** — `ALERTA` or `ESTRUTURA SEGURA`, based on the
   comparison above.
3. **Normative reference** — the standard applied, included in the report
   for traceability (see example reports in `data/processed/`).

## Related documentation

* `docs/standards.md` — full standards reference, shared across the
  project.
* `docs/validation.md` — what has and has not been validated, including
  the caveat on test conditions (close-proximity impacts).
