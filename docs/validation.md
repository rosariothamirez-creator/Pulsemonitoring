# Validation

This document records what has been tested, how, and what remains
unvalidated. It is intentionally explicit about limitations — the goal is
an accurate record, not a polished claim.

## What has been tested

### Signal acquisition
- The accelerometer reliably samples at 475 Hz over the Pico W's I2C bus.
- Events are correctly grouped by `evento_id` and persisted to CSV with
  timestamp, axis, and acceleration columns.

### Processing pipeline
- Acceleration-to-velocity integration (`cumsum` + `detrend` + unit
  conversion) was verified against real recorded events (hammer impacts,
  dropped object tests) and produces physically plausible velocity curves
  (zero-crossing baseline, no runaway drift).
- FFT computation correctly identifies a dominant frequency consistent
  with the visual periodicity of the time-domain signal.

### Environmental module
- All four standards (NP 2074, DIN 4150-3, BS 5228-2, ISO 2631-2) were
  exercised end-to-end with real test events and correctly produced
  ALERT/SAFE verdicts with the expected limit comparison.
- **Important caveat on test results:** the real test events used for
  validation involved impacts generated very close to the sensor (hammer
  strikes, dropped objects directly adjacent to the accelerometer). This
  produced PPV/PVS values far above the regulatory limits in every test
  (e.g. 129–156 mm/s vs. limits of 0.3–3.0 mm/s). These results validate
  that the detection and classification logic works correctly — they are
  **not representative of real-world vibration levels at regulated
  distances** and should not be read as "the system always alerts."

### Seismic module
- PGV computation and the Mercalli intensity conversion were verified on
  the same close-proximity test events, yielding a PGV of 143.25 mm/s and
  an estimated Intensity VI ("Strong"). As above, this is a proximity
  effect of the test setup, not a real seismic event.

## What has NOT been validated

### Epicenter trilateration
- The multi-node trilateration logic (P-wave delay to distance to
  epicenter position) exists conceptually in the codebase but currently
  uses simulated/randomized node data, not real timestamps from multiple
  physical PULSE units in the field.
- Status: roadmap / proof-of-concept, not a validated capability. It
  requires at least 3 synchronized PULSE nodes deployed simultaneously,
  which has not been tested.

### Reference instrument comparison
- No comparison has been made yet against a certified seismograph or
  calibrated vibration meter. All validation to date is internal
  consistency (does the math behave as expected), not external
  ground-truth accuracy.

### Distance/sensitivity calibration
- The system has not been tested at the range of distances and vibration
  magnitudes typical of real construction/mining sites. Threshold
  behavior at low-amplitude, far-field vibration remains unverified.



## Summary table

| Capability | Status |
|---|---|
| High-Frequency Acquisition & Dynamic $\Delta t$ | Validated |
| Acceleration to velocity conversion | Validated |
| FFT / dominant frequency | Validated |
| Environmental classification (4 standards) | Validated (logic); only tested at close range |
| Seismic Mercalli classification | Validated (logic); only tested at close range |
| Epicenter trilateration | Not validated, conceptual/roadmap |
| Reference instrument comparison | Not done |
| Field-distance calibration | Not done |
