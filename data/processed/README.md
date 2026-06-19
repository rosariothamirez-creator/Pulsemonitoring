# Processed Data (Reference Analytical Outputs)

## Overview
This folder contains static, exported reference datasets generated after applying the digital signal processing pipeline to the source files in the `data/raw/` directory.

> **Architectural Note:** The main GeoNode Dashboard computes these transformations *in-memory* (on-the-fly) to render real-time visualizations without causing disk I/O bottlenecks. The static files provided in this folder serve exclusively as mathematical verification benchmarks. They allow peer reviewers to audit our kinematic integrations and spectral calculations using external tools (e.g., MATLAB, Excel) without needing to execute the Python application.

## Baseline Processed Examples
These files directly correspond to their raw counterparts, adding the computed analytical dimensions:

* `calibration_static_drift_processed.csv`: Used to verify the mathematical efficiency of the 'Detrend' algorithm in anchoring the velocity baseline to the zero-axis over time.
* `trigger_impulse_test_processed.csv`: Demonstrates the kinematic conversion from an acceleration impulse into structural velocity (mm/s), validating the mathematical integrity before applying the NP 2074 / DIN 4150-3 dynamic limits.
* `resonance_continuous_wave_processed.csv`: Contains the output arrays of the Fast Fourier Transform (FFT), isolating the spectral amplitude peaks and confirming the algorithm's accuracy in pinpointing the Dominant Frequency.

## Signal Processing Pipeline
The transition from *Raw* to *Processed* state implies the execution of the following analytical operations managed by the `geonode_analyzer.py` engine:

1.  **Kinematic Integration:** Conversion of the source physical dimension (Acceleration, **m/s²**) into the target analytical dimension (Velocity, **mm/s**) via cumulative numerical integration over the relative time delta ($\Delta t$).
2.  **Drift Mitigation (Detrending):** Application of linear least-squares detrending algorithms (via `scipy.signal.detrend`) to eliminate cumulative integration drift caused by hardware sensor offsets.
3.  **Spectral Transformation:** Processing of the time-domain signal through a Fast Fourier Transform (`scipy.fft`) to map amplitude distributions and identify the Dominant Frequency (Hz) of the structural excitation.
