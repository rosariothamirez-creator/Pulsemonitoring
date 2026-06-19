# Environmental & Structural Module

## Overview
This module (`standards_check.py`) constitutes the normative gateway of the GeoNode architecture. It is responsible for correlating the kinematic vectors and spectral frequencies extracted from the Digital Signal Processing (DSP) pipeline with dynamic legal thresholds. Its primary goal is to assess structural integrity risks and human exposure limits based on high-frequency, localized vibration events.

## Evaluated Parameters
The evaluation logic relies on a multi-variable correlation matrix:
* **Dominant Frequency (Hz):** Extracted via Fast Fourier Transform (FFT) to determine the structural resonance spectrum.
* **Peak Particle Velocity - PPV (mm/s):** The maximum absolute velocity recorded on a single isolated spatial axis.
* **Peak Vector Sum - PVS (mm/s):** The True Vector Sum computed from the instantaneous tri-orthogonal coordinates (V = √(Vx² + Vy² + Vz²)).

## Implemented Frameworks
The module programmatically implements the boundary curves of the following standards, adapting the maximum allowable velocities based on the event's frequency band:

1. **NP 2074:2015 (Portuguese Standard):**
   * *Method:* PVS Evaluation.
   * *Classes:* Sensitive, Standard (Corrente), and Reinforced (Reforçada) structures.
   * *Frequency Tiers:* Applies dynamic step limits across three bands: **≤ 10 Hz**, **10 - 40 Hz**, and **> 40 Hz**.

2. **DIN 4150-3:2016 (German Standard):**
   * *Method:* PPV Evaluation.
   * *Classes:* Historical/Sensitive, Residential, and Industrial structures.
   * *Frequency Tiers:* Applies dynamic step limits across three bands: **≤ 10 Hz**, **10 - 50 Hz**, and **> 50 Hz**.

3. **BS 6472-1 / ISO 2631-2:**
   * *Method:* PPV Evaluation focused on human comfort parameters (Rotating Machinery).
   * *Threshold:* Static evaluation independent of structural resonance.

4. **Occupational & Environmental Control:**
   * *Static Thresholds:* Continuous background vibrations (0.15 mm/s) and transient/impulsive detonations (0.30 mm/s) typical in mining and heavy civil works.

## Outputs
For each processed event, `standards_check.py` evaluates the data and returns:
1. **Dynamic Threshold Limit:** The exact allowable velocity limit (in mm/s) calculated dynamically based on the input frequency tier and selected structural class.
2. **Compliance State:** A boolean and descriptive state indicating whether the threshold was exceeded (`ALERTA / ESTRUTURA SEGURA`).
3. **Normative Reference:** The textual reference of the standard applied to ensure full traceability in the final generated report.
