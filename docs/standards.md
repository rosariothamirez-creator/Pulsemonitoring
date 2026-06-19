# Standards

PULSE's environmental module implements four vibration standards. Each
standard defines a different metric, frequency dependency, and structure
sensitivity class. This document specifies exactly how each is computed in
the codebase.

## Common metrics

| Symbol | Name | Definition |
|---|---|---|
| **PPV** | Peak Particle Velocity | `max(|vx|, |vy|, |vz|)` — the largest single-axis peak velocity |
| **PVS** | Peak Vector Sum | `sqrt(vx² + vy² + vz²)` — the resultant 3D vector magnitude |
| **PGV** | Peak Ground Velocity | `max(|vz|)` — vertical-axis peak velocity, used in the seismic module |

All velocities are expressed in **mm/s**, obtained from the acceleration
signal via integration and unit conversion (see `software.md`).

---

## NP 2074:2015 (Portugal)

- **Metric used:** PVS (tri-orthogonal vector sum).
- **Frequency bands:** ≤ 10 Hz, ≤ 40 Hz, > 40 Hz.
- **Structure classes:** Sensitive, Standard ("Corrente"), Reinforced.
- **Logic:** the dominant frequency (from FFT) selects the frequency band;
  the band and structure class together select the velocity limit; PVS is
  compared against that limit.

## DIN 4150-3:2016 (Germany)

- **Metric used:** PPV (single isolated axis).
- **Frequency bands:** ≤ 10 Hz, ≤ 50 Hz, > 50 Hz.
- **Structure classes:** Sensitive, Residential, Industrial.
- **Logic:** same band/class lookup approach as NP 2074, but using PPV
  instead of PVS and a different band/limit table.

## BS 5228-2 (United Kingdom)

- **Metric used:** PPV.
- **Scope:** environmental/occupational vibration control on construction
  sites.
- **Limits implemented:** 0.30 mm/s for impulsive vibration (e.g. blasting),
  0.15 mm/s for continuous vibration. These are fixed reference thresholds,
  not frequency-dependent in the current implementation.

## ISO 2631-2 (International)

- **Metric used:** PPV, grouped with BS 5228 under the
  "Environmental/Occupational" category in the current implementation.
- **Scope:** human exposure and comfort assessment, complementing the
  structural limits of the other three standards.
- **Note:** ISO 2631 technically specifies frequency-weighted acceleration
  (not raw PPV in mm/s) for human comfort assessment. The current
  implementation uses a simplified PPV-based threshold; full frequency
  weighting is listed as future work in `validation.md`.

## BS 6472-1 (rotating machinery, supplementary)

- **Metric used:** PPV.
- **Limit implemented:** fixed at 1.0 mm/s, applied when the vibration
  source is classified as rotating machinery rather than blasting/impact.

---

## Decision logic (applies to all four standards)

1. Compute the relevant metric (PPV or PVS) for the event.
2. Determine the dominant frequency via FFT.
3. Look up the velocity limit for the given standard, frequency band, and
   structure class.
4. Compare: if `metric > limit`, classify as **ALERT**; otherwise **SAFE**.
5. Report the standard reference, the band used, and the measured value
   alongside the verdict.

## Known simplification

The current implementation treats BS 5228-2 and ISO 2631-2 with fixed,
non-frequency-dependent thresholds. NP 2074 and DIN 4150-3 are the only two
standards with full frequency-band × structure-class lookup tables. This is
documented as a deliberate scope decision for the prototype phase — see
`project_decisions.md`.
