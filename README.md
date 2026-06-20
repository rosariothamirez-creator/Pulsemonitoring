# PULSE – Vibration Monitoring and Seismic Detection System

## Overview
PULSE is an open-source vibration monitoring and seismic detection system designed for urban, industrial, and mining environments. 

The system leverages a decoupled architecture, combining a MicroPython-based hardware acquisition node with a Python-powered Digital Signal Processing (DSP) engine, to acquire, clean, and evaluate triaxial kinematic data. It strictly evaluates signals against established civil engineering vibration standards and empirical seismological models.

The project aims to provide a low-cost, portable, and mathematically rigorous solution for structural compliance auditing and seismic hazard detection.

---

## Operating Modes

### 1. Environmental & Structural Mode
Evaluates localized, high-frequency transient vibrations to prevent structural damage and ensure human comfort. The interpretation engine computes the Peak Particle Velocity (PPV) or Peak Vector Sum (PVS) and correlates it with the signal's Dominant Frequency (extracted via FFT). 

Compliance is dynamically evaluated against the following normative frameworks:
* **NP 2074:2015 (Portugal):** Tri-orthogonal evaluation for Sensitive, Standard, and Reinforced structures.
* **DIN 4150-3:2016 (Germany):** Single-axis peak evaluation for Historical, Residential, and Industrial buildings.
* **BS 5228-2 / ISO 2631-2:** Occupational thresholding for impulsive detonations and continuous background noise.
* **BS 6472-1:** Continuous harmonic evaluation for rotating machinery.

### 2. Seismic & Macroscopic Hazard Mode
Triggers during low-frequency, high-amplitude events, shifting the analytical focus to regional seismology. 
* **Criterion Applied:** Isolates the Peak Ground Velocity (PGV) on the vertical Z-axis (representing Rayleigh surface waves).
* **Scale Translation:** Applies the empirical logarithmic conversion derived by Wald et al. (1999) to translate kinematic velocity into the Modified Mercalli Intensity (MMI) scale, returning a scientific hazard classification (Grades I through IX+).

---

## System Architecture & Workflow

The pipeline avoids continuous streaming bottlenecks by utilizing batched event transmission and a centralized datastore:

1. **Hardware Node:** Triaxial MEMS Accelerometer samples data via I2C.
2. **Firmware Gateway:** Raspberry Pi Pico W detects the trigger threshold and buffers the event.
3. **Ingestion Server:** A lightweight Flask server (`servidor.py`) receives the payload via HTTP POST and reconstructs the real-time clock.
4. **Central Datastore:** Data is persisted in a shared CSV ledger.
5. **DSP Engine:** `geonode_analyzer.py` applies rectangular numerical integration and linear detrending to convert acceleration into a clean velocity signal.
6. **Interpretation & GUI:** The normative engines calculate thresholds, and the Tkinter/Matplotlib dashboard renders the Time-Domain Seismogram and Frequency-Domain FFT in-memory.

---

## Repository Structure

* `/hardware` — Physical components, schematics, and enclosure design.
* `/software` — The core codebase, subdivided into acquisition (`servidor.py`), processing, and interpretation modules (`geonode_analyzer.py`).
* `/docs` — Technical documentation covering the architecture, project decisions, and normative limits.
* `/data` — Raw dataset archives and processed visual validation reports.

---

## Technology Stack

* **Embedded Hardware:** Raspberry Pi Pico W, MicroPython, I2C MEMS Accelerometer.
* **Backend Server:** Python 3, Flask.
* **DSP & Mathematics:** SciPy, NumPy, Pandas.
* **Visualization & GUI:** Matplotlib, Tkinter, HTML/JS (Demonstration Client).

---

## Future Developments

* **Multi-Node Monitoring Network:** Deployment of synchronized physical nodes to validate the currently simulated P-wave epicenter trilateration logic.
* **Formal Hardware Calibration:** Execution of a controlled static-rest calibration test to quantify intrinsic sensor offset independently of the algorithmic detrending.
* **Full ISO 2631-2 Implementation:** Transitioning from fixed PPV thresholds to full frequency-weighted acceleration curves for human comfort assessment.

---

## Authors
**Afonso Geraldes; Catalin Calin; Colin Pontes; Daméin Kosta; Diogo Vieira; Edmila Zanga; Lucas Manso; Martim Pereira; Pedro Gama; Thamirez do Rosário**
Developed as part of the Integrated Project in Mining and Energy Resources Engineering at **Instituto Superior Técnico (IST)**.
