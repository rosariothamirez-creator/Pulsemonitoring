# Software

## Stack

| Component | Technology |
|---|---|
| Firmware | MicroPython (Raspberry Pi Pico W) |
| Server | Python 3, Flask |
| Processing / analysis / dashboard | Python 3, NumPy, SciPy, Pandas, Matplotlib, Tkinter |
| Website (demonstration) | HTML, JavaScript |
| Data interchange | CSV (single shared file) |

PULSE's software is made of exactly three components: `servidor.py` (the
receiving server), `geonode_analyzer.py` (the processing engine and
Tkinter dashboard), and a separate website.

## servidor.py — receiving server

A minimal Flask application with a single responsibility: accept event
batches from the Pico W over HTTP and persist them to CSV.

- **Endpoint:** `POST /eventos`, listening on `0.0.0.0:5000`.
- **Input:** a JSON payload containing a base timestamp/time anchor and a
  list of events, each with its own list of samples (acceleration per
  axis, relative time in ms).
- **Timestamp reconstruction:** the Pico W only tracks milliseconds since
  boot; the server computes each event's real wall-clock time from the
  base anchor plus the relative offset.
- **Output:** appends rows to `eventos/amostras.csv` with columns
  `evento_id, data_hora_evento, t_ms, ax_ms2, ay_ms2, az_ms2, dx_ms2,
  dy_ms2, dz_ms2`.
- **Note on `dx/dy/dz` columns:** reserved in the schema but not populated
  by the current firmware (the hardware has no secondary
  sensor). They default to empty values and are not consumed anywhere
  downstream.

## geonode_analyzer.py — processing engine and dashboard

### Processing pipeline

The core transformation converts raw acceleration into a velocity signal
ready for standards comparison:

```python
def converter_aceleracao_para_velocidade(accel_ms2, dt):
    """ Integra a aceleração (m/s²) para obter velocidade (mm/s) removendo o drift. """
    vel_m_s = np.cumsum(accel_ms2) * dt
    vel_m_s_limpa = detrend(vel_m_s)
    return vel_m_s_limpa * 1000.0
```

Three steps, in order:

1. **Integration** — `np.cumsum(accel_ms2) * dt` performs a cumulative-sum
   numerical integration of acceleration over time, per axis, yielding
   velocity in m/s.
2. **Drift removal** — `scipy.signal.detrend` removes the low-frequency
   drift that accumulates naturally from numerical integration of an
   accelerometer signal. Without this step, the computed velocity would
   wander over time instead of returning to a zero baseline between
   events.
3. **Unit conversion** — multiplying by `1000.0` converts m/s to mm/s, the
   unit used by all four vibration standards (PPV/PVS).

### Frequency analysis

`compute_fft` applies `scipy.fft` to the velocity signal to obtain the
amplitude spectrum and the dominant frequency (`argmax |X(f)|`), used to
select the correct frequency band when looking up standard thresholds
(see `standards.md`).

### Interpretation modules

- **Environmental**: applies the standards comparison logic described in
  `standards.md` and returns an ALERT/SAFE classification per event.
- **Seismic**: computes PGV from the vertical axis and converts it to a
  Modified Mercalli Intensity estimate using the empirical relationship
  `IMM = 3.47 · log10(PGV_cm/s) + 2.35` (Wald et al., 1999 — see
  `references.md`). Epicenter trilateration logic exists conceptually but
  is not validated with real multi-sensor data (see `validation.md`).

### Dashboard (Tkinter)

`geonode_analyzer.py` also implements the graphical interface: it reads
`eventos/amostras.csv`, lists detected events grouped by `evento_id`, and
lets the user choose a module (Signal / Environmental / Seismic) to
generate the corresponding matplotlib report in a separate window. This is
the only interface that performs real signal processing — it is not a
static viewer.

## Website

A separate HTML/JavaScript front-end built specifically for live
demonstrations and presentations.

- Connects to `servidor.py` over HTTP: whenever a new event is detected,
  the website fetches data from the server and renders the 3-axis
  (X, Y, Z) waveform in the browser.
- **Open item — route not yet confirmed:** `servidor.py` as documented
  here exposes only `POST /eventos` (used by the Pico W to push data in).
  No GET route for the website to pull data is visible in the reviewed
  version. This needs to be reconciled once the website's source code is
  reviewed — either a GET route exists elsewhere, or the server file
  reviewed is incomplete. Update this section once confirmed.
- Exists alongside, not instead of, the dashboard: the two are independent
  front-ends and are not interchangeable in functionality (the website
  does not perform the signal processing itself — that remains the
  responsibility of `geonode_analyzer.py`).

## Known limitations (software)

- Reports in `geonode_analyzer.py` are generated on demand (post-processing
  of stored events), not continuously streamed.
- BS 5228-2 / ISO 2631-2 use fixed thresholds rather than full
  frequency-weighted curves (see `standards.md`).
