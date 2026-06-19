# Digital Signal Processing (DSP) Engine

## Overview
The Processing module is the mathematical core of the GeoNode architecture. It acts as the critical bridge between raw hardware telemetry and normative evaluation. Its primary purpose is to transform unconditioned physical measurements (Acceleration) into mathematically viable, strictly defined analytical dimensions (Velocity and Frequency) without introducing algorithmic drift.

## Processing Pipeline & Responsibilities

The module executes a sequential, high-precision mathematical pipeline using the `scipy` and `numpy` stacks:

1. **Drift Mitigation & Signal Conditioning (Detrending):**
   * Raw MEMS accelerometers inherently present DC offsets and low-frequency noise. Before any transformation occurs, the module applies linear least-squares detrending algorithms (`scipy.signal.detrend`) to anchor the signal baseline to the true zero-axis. This is a mandatory step to prevent catastrophic cumulative error (drift) during subsequent integrations.

2. **Kinematic Integration:**
   * Hardware sensors strictly capture **Acceleration (m/s²)**. However, civil structural damage and human comfort standards mandate evaluation based on **Velocity (mm/s)**.
   * The module executes discrete cumulative numerical integration (via the trapezoidal rule, e.g., `scipy.integrate.cumtrapz`) over the relative time delta ($\Delta t$) to perform this physical domain translation dynamically.

3. **Spectral Transformation (FFT):**
   * Converts the integrated time-domain signal into the frequency-domain.
   * Executes a Fast Fourier Transform (`scipy.fft`) to map the amplitude distribution and isolate the resonance characteristics of the measured event.

## Extracted Analytical Parameters
Rather than generic features, this module explicitly computes the vectors required by the downstream Interpretation modules:
* **Triaxial Velocity Vectors ($V_x, V_y, V_z$):** The conditioned, integrated time-series data for all spatial axes (converted to mm/s).
* **Dominant Frequency (Hz):** The specific spectral peak carrying the highest energy payload, crucial for frequency-dependent normative evaluation.
* **Peak Anchors:** Preparation of the raw max/min arrays for downstream PVS (Peak Vector Sum) and PGV (Peak Ground Velocity) calculations.

## Data Flow
* **Input:** Raw Triaxial Acceleration Data (m/s²) and High-Precision Timestamps.
* **Output:** Detrended Kinematic Velocity Arrays (mm/s) and Spectral Frequency Maps (Hz) ready for structural/seismic interpretation.
