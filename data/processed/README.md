# Processed Data (Analytical Outputs)

## Overview
This folder stores the deterministic outputs generated after executing the digital signal processing pipeline on the corresponding files in the `data/raw/` directory.

## Signal Processing Pipeline
The transition from Raw to Processed state implies the execution of the following analytical operations managed by the system software:
1. **Kinematic Integration:** Conversion of the source physical dimension (Acceleration, m/s²) into the target analytical dimension required by civil engineering standards (Velocity, mm/s) via cumulative numerical integration.
2. **Drift Mitigation (Detrending):** Application of linear least-squares detrending algorithms to eliminate cumulative integration drift and anchor the velocity baseline to the zero-axis.
3. **Spectral Transformation:** Processing of the time-domain signal through a Fast Fourier Transform (FFT) to map amplitude distributions and identify the Dominant Frequency (Hz) of the structural excitation.

## Data Schema
Processed files expand the raw structure by adding calculated kinematic fields (`vx_mms`, `vy_mms`, `vz_mms`) in millimeters per second (mm/s), alongside the computed frequency spectral arrays.
