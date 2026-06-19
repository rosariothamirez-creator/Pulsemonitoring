# Raw Data

## Overview

This folder is intended to hold raw CSV exports from the prototype's
acquisition pipeline — the same data written by `servidor.py` to
`eventos/amostras.csv` (see `docs/architecture.md`). No raw CSV file has
been committed yet; this README documents the schema and the testing
context so the format is clear once files are added.

## Data schema

All files follow the same column structure as `eventos/amostras.csv`:

| Column | Description |
|---|---|
| `evento_id` | Sequential integer identifying the vibration event (assigned by `servidor.py`) |
| `data_hora_evento` | Reconstructed wall-clock timestamp of the event |
| `t_ms` | Time elapsed since the start of the event, in milliseconds |
| `ax_ms2`, `ay_ms2`, `az_ms2` | Raw acceleration along the X, Y, and Z axes, in m/s² |
| `dx_ms2`, `dy_ms2`, `dz_ms2` | Reserved columns, not currently populated (no secondary sensor in the current hardware — see `docs/software.md`) |

## Testing context (current status)

The events used during development to validate the processing pipeline
(see `docs/validation.md`) were generated through **informal manual
tests** — hammer strikes and dropped objects close to the sensor — not a
formal, instrumented laboratory calibration procedure (e.g. there was no
controlled static-rest baseline measurement to quantify intrinsic sensor
offset/drift independently of `scipy.signal.detrend`'s correction).

This means:
- The drift-removal step (`detrend`) has been validated qualitatively
  (the resulting velocity signal returns to a stable baseline rather than
  drifting indefinitely), but the sensor's intrinsic offset has not been
  characterized in isolation.
- The PPV/PVS/PGV values produced by these tests are not representative
  of real-world field distances — see the caveat in
  `docs/validation.md` and `data/processed/README.md`.

## Adding real data

Once a raw CSV export from an actual test session is available, add it
here and update this README with:
- The file name and a one-line description of what the test represents
  (e.g. "hammer strike, ~10 cm from sensor, 2026-06-XX").
- Whether it was used as input to any of the report images in
  `data/processed/`.

## Future work

A controlled static-rest calibration test (sensor at rest, no induced
vibration, recorded over a few minutes) would let the team quantify the
accelerometer's intrinsic offset independently of the software-side
drift correction. This is listed as future work in
`docs/validation.md` and is not yet part of the dataset.
