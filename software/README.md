# Software Architecture

## Overview

The software subsystem is split across three components (see
`docs/architecture.md` for the full system view): `servidor.py` (receives
data from the hardware and writes it to CSV), `geonode_analyzer.py` (the
analytical core and dashboard, described in this document), and a
separate demonstration website. This document covers `geonode_analyzer.py`
specifically.

`geonode_analyzer.py` performs kinematic transformations and spectral
analysis on the data written to `eventos/amostras.csv`, generating
Environmental and Seismic assessments on demand, and provides the Tkinter
graphical interface used to trigger and view those assessments.

---

## Processing pipeline

```text
[eventos/amostras.csv]
   │
   ▼
[Event listing] ──────────────> (Auto-refreshing list, polled every 10s)
   │
   ▼  (operator selects an event + module)
[Kinematic integration] ──────> (Cumulative sum + drift removal)
   │
   ▼
[Spectral transformation] ────> (Fast Fourier Transform — FFT)
   │
   ▼
[Normative interpretation] ───> (NP 2074 / DIN 4150-3 / BS 5228 / ISO 2631 / Mercalli)
   │
   ▼
[Report rendering] ───────────> (Matplotlib report in a new window)
```

Note: timestamp reconstruction (relative device time → real wall-clock
time) happens in `servidor.py`, before the data reaches this file — see
`docs/software.md` for that logic. `geonode_analyzer.py` consumes
timestamps that are already resolved.

---

## Main modules

### 1. Event listing and auto-refresh

- The Tkinter dashboard reads `eventos/amostras.csv` and lists detected
  events, grouped by `evento_id`.
- A background refresh loop (`self.root.after(10000, self.auto_refresh)`)
  re-reads the CSV every 10 seconds without blocking the UI, so newly
  arrived events appear automatically. This refresh applies to the event
  **list** — generating an actual report is a separate, on-demand action
  triggered by the operator (see below), not something the auto-refresh
  loop does on its own.

### 2. Digital signal processing

Implemented with `numpy` and `scipy`, executed when the operator requests
a report for a specific event (not continuously):

- **Kinematic integration** — converts triaxial raw acceleration (m/s²)
  into velocity (mm/s) via cumulative numerical integration
  (`np.cumsum(accel_ms2) * dt`).
- **Drift mitigation** — applies linear detrending (`scipy.signal.detrend`)
  to remove the cumulative drift introduced by numerical integration,
  anchoring the velocity baseline before unit conversion.
- **Spectral analysis** — runs a Fast Fourier Transform (`scipy.fft`) on
  the velocity signal to obtain the amplitude spectrum and the dominant
  frequency, used by the normative interpretation step.

See `docs/software.md` for the exact function and line-by-line breakdown.

### 3. Normative interpretation

Classifies the processed signal according to the operational mode selected
by the operator:

- **Environmental (structural vibration):** evaluates PVS against
  NP 2074:2015 and PPV against DIN 4150-3:2016, using frequency-band and
  structure-class lookup tables (see `docs/standards.md` for the exact
  bands). Also applies the fixed-threshold checks for BS 5228-2 / ISO
  2631-2 (0.15–0.30 mm/s) and BS 6472-1 (1.0 mm/s, rotating machinery).
- **Seismic:** maps Peak Ground Velocity (PGV, vertical axis) to a
  Modified Mercalli Intensity estimate, using the empirical relationship
  from Wald et al. (1999) — see `docs/references.md`.

### 4. Visualization & GUI

An interactive graphical interface built with `Tkinter` and `Matplotlib`.

- **On-demand rendering:** generates the time-domain and frequency-domain
  report plots in memory when the operator requests them, with no
  intermediate files written to disk.
- **Simulated threshold overlay ("Threshold V2.0"):** the operator can
  type a value (default 1.5 m/s²) into a field in the "Signal" report
  view; this draws two dashed horizontal reference lines (±threshold) on
  top of the already-recorded acceleration signal. This is a visual,
  after-the-fact comparison tool — it overlays a candidate detection
  threshold onto data that has already been captured, to help reason
  about what the hardware's trigger level should be. It does not
  retroactively change which events were detected, and it does not
  communicate back to the hardware.

## Known limitations

- Reports are generated on demand per selected event; 
- See `docs/validation.md` for the full list of validated vs. unvalidated
  capabilities.
