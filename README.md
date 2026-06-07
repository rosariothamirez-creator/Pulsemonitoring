# PULSE – Vibration Monitoring and Seismic Detection System

## Overview

PULSE is an open-source vibration monitoring and seismic detection system designed for urban, industrial and mining environments.

The system uses an accelerometer to acquire vibration data, processes the acquired signals and evaluates them according to environmental vibration standards or seismic event detection criteria.

The project aims to provide a low-cost, portable and scalable solution for vibration monitoring and analysis.

---

## Objectives

- Monitor environmental vibrations
- Detect potential seismic events
- Assess vibration levels according to technical standards
- Support structural safety assessment
- Provide a low-cost and portable monitoring solution

---

## Operating Modes

### Environmental Mode

Environmental vibration levels are evaluated according to established standards, including:

- NP 2074
- DIN 4150
- (preencher as restantes)

The system compares measured parameters with the limits defined by the selected standard and determines compliance.

### Seismic Mode

The system analyzes vibration signals and identifies potential seismic events based on signal characteristics and extracted parameters.
(Preencher com o criterio usado)
---

## System Workflow

Accelerometer
↓
ADC
↓
CSV Data
↓
Acquisition
↓
Processing
↓
Interpretation
↓
Visualization

---

## Repository Structure

### hardware
Physical components, schematics and enclosure design.

### software
Signal acquisition, processing, interpretation and visualization modules.

### docs
Technical documentation, standards and project decisions.

### data
Raw and processed datasets.

---

## Technologies

- Python
- Raspberry Pi
- Accelerometer
- CSV Data Processing
- Signal Processing Techniques

---

## Future Developments

- IoT integration
- Real-time monitoring dashboard
- Multi-node monitoring network
- Cloud-based data storage

---

## Authors

Developed as part of an Integrated Project in Mining and Energy Resources Engineering at Instituto Superior Tecnico.
