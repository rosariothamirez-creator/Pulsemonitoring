# Raw Data (Verification Benchmarks)

## Overview
This folder contains static, immutable baseline datasets acquired directly from the triaxial acceleration monitoring system. 

NOTE: To maintain repository efficiency and comply with software engineering best practices, continuous production logs generated during real-time monitoring are excluded from version control via `.gitignore`. The datasets stored here serve exclusively as historical calibration benchmarks and unit testing inputs for the signal processing pipeline.

## Data Schema & Specifications
All files are structured in Comma-Separated Values (CSV) format with the following column matrix:
1. `evento_id`: Unique integer identifier for the seismic or vibration trigger.
2. `data_hora_evento`: Temporal reference point recorded at the instance of execution.
3. `t_ms`: Continuous relative time increment since trigger initialization, measured in milliseconds (ms).
4. `ax_ms2`, `ay_ms2`, `az_ms2`: Raw linear acceleration values mapped across the X, Y, and Z orthogonal axes, measured in meters per second squared (m/s²).

## Baseline Examples
- `environmental_test_01.csv`: Baseline ambient noise measurement (e.g., structural background micro-tremors).
- `seismic_test_01.csv`: High-transient impulse simulation used to validate threshold acceleration triggers.
