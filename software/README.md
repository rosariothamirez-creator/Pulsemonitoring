# Software

## Overview

The software subsystem processes vibration measurements acquired by the hardware subsystem and generates environmental and seismic assessments.

The software architecture follows a modular pipeline approach, allowing each stage to be independently developed, tested and improved.

---

## Processing Pipeline

CSV Data
->
Acquisition
->
Processing
->
Interpretation
->
Visualization

---

## Main Modules

### Acquisition

Reads and validates CSV files containing vibration measurements.

### Processing

Filters and conditions vibration signals and extracts relevant parameters.

### Interpretation

Analyzes processed data according to environmental standards or seismic detection criteria, depending on tthe chosen module.

### Visualization

Generates plots and reports to support analysis and decision-making.
