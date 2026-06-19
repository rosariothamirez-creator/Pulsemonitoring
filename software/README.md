# Software Architecture

## Overview
The software subsystem (`geonode_analyzer.py`) acts as the analytical core of the project. It executes real-time kinematic transformations and spectral analysis on the physical measurements acquired by the hardware subsystem, generating deterministic assessments for structural integrity and seismology.

The architecture is built upon a modular, event-driven pipeline. This ensures high cohesion and low coupling, allowing discrete stages—from data ingestion to normative evaluation—to be independently audited, optimized, and tested.

---

## Processing Pipeline

```text
[Raw Sensor Data (m/s²)] 
   │
   ▼
[Data Ingestion] ───────> (Timestamp Reconstruction & Live Polling)
   │
   ▼
[Digital Signal Processing] ──> (Kinematic Integration & Least-Squares Detrending)
   │
   ▼
[Spectral Transformation] ────> (Fast Fourier Transform - FFT)
   │
   ▼
[Normative Interpretation] ───> (NP 2074 / DIN 4150-3 / Mercalli Mapping)
   │
   ▼
[Interactive Dashboard] ──────> (On-Demand Rendering & UI) 
```
 

## Main Modules

### 1. Acquisition & Ingestion Engine
Handles the asynchronous reading of the continuous CSV data stream.
* **Live Feed Polling:** Implements a non-blocking background loop that scans for new hardware triggers without halting the main thread.
* **Temporal Reconstruction:** Intercepts relative hardware uptime payloads (MM:SS.f) and fuses them with the system's absolute clock, reconstructing high-precision timestamps (down to the millisecond) while avoiding Base-60 math errors.

### 2. Digital Signal Processing (DSP)
Transforms the raw physical data into mathematically viable dimensions using the `scipy` and `numpy` stacks.
* **Kinematic Integration:** Converts triaxial raw acceleration (m/s²) into structural velocity (mm/s) via cumulative numerical integration.
* **Drift Mitigation:** Applies linear detrending filters to eliminate cumulative algorithmic drift and hardware offset, anchoring the baseline to the zero-axis.
* **Spectral Analysis:** Executes a Fast Fourier Transform (FFT) to convert time-domain signals into frequency-domain spectra, isolating the Dominant Frequency (Hz) of the structural excitation.

### 3. Normative Interpretation
Contextualizes the processed arrays against a comprehensive suite of established civil engineering, environmental, and seismological frameworks depending on the selected operational mode:
* **Structural Vibration (PVS & PPV):** Evaluates frequency-dependent kinematic limits dictated by the Portuguese standard **NP 2074** and the German standard **DIN 4150-3** to assess potential structural damage.
* **Human Comfort & Occupational Exposure:** Applies specific thresholds for rotating machinery (**BS 6472-1** / ISO 2631-2) and strict environmental control limits (e.g., 0.15 mm/s for continuous ambient vibrations and 0.30 mm/s for impulsive detonations).
* **Seismological Module:** Maps the Peak Ground Velocity (PGV) directly to the scientific **Modified Mercalli Intensity Scale** (based on Wald et al., 1999), providing immediate macroscopic hazard assessments.

### 4. Visualization & GUI
Provides an interactive, low-latency graphical interface built with `Tkinter` and `Matplotlib`.
* **On-Demand Rendering:** Generates complex, multi-plot analytical reports (Sismograms, FFT Spectra, Kinematic curves) purely in-memory. This architectural decision prevents disk I/O bottlenecks and ensures real-time responsiveness.
* **Dynamic Thresholding:** Allows the operator to inject simulated threshold boundaries directly into the raw data visualization to validate hardware trigger efficacy visually.
