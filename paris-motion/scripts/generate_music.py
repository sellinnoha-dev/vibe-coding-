#!/usr/bin/env python3
"""
Génère la musique originale (60 s) et les effets sonores de la vidéo, entièrement par synthèse.
Aucun échantillon externe : la musique est libre de droits puisqu'elle est créée ici.

Sorties :
  public/audio/musique.wav        musique instrumentale, stéréo 44,1 kHz
  public/audio/sfx/shimmer.wav    scintillement (apparition de titres / lumières)
  public/audio/sfx/chime.wav      petite cloche (apparition des monuments)
  public/audio/sfx/whoosh.wav     souffle doux (transitions)

Usage : python3 scripts/generate_music.py
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
ROOT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


NOTE = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}


def n(name, octave):
    return NOTE[name] + 12 * (octave + 1)


# Progression d'accords : chaque changement tombe sur un changement de scène (6, 17, 29, 41, 52 s).
# (début, fin, basse, notes de la nappe)
CHORDS = [
    (0.0, 6.0, n('D', 2), [n('D', 3), n('A', 3), n('C#', 4), n('E', 4), n('F#', 4)]),       # Scène 1 : Dmaj9
    (6.0, 11.5, n('B', 1), [n('B', 2), n('F#', 3), n('A', 3), n('C#', 4), n('D', 4)]),      # Scène 2 : Bm9
    (11.5, 17.0, n('G', 1), [n('G', 2), n('D', 3), n('F#', 3), n('A', 3), n('B', 3)]),      #           Gmaj9
    (17.0, 23.0, n('F#', 1), [n('F#', 2), n('A', 3), n('C#', 4), n('D', 4), n('E', 4)]),    # Scène 3 : D/F#
    (23.0, 29.0, n('E', 1), [n('E', 2), n('B', 2), n('D', 3), n('F#', 3), n('G', 3)]),      #           Em9
    (29.0, 35.0, n('G', 1), [n('G', 2), n('B', 2), n('D', 3), n('F#', 3), n('A', 3)]),      # Scène 4 : Gmaj9
    (35.0, 38.0, n('A', 1), [n('A', 2), n('D', 3), n('E', 3), n('G', 3), n('B', 3)]),       #           A9sus4
    (38.0, 41.0, n('A', 1), [n('A', 2), n('C#', 3), n('E', 3), n('G', 3), n('B', 3)]),      #           A9
    (41.0, 46.5, n('B', 1), [n('B', 2), n('D', 3), n('F#', 3), n('A', 3), n('C#', 4)]),     # Scène 5 : Bm9
    (46.5, 52.0, n('G', 1), [n('G', 2), n('B', 2), n('D', 3), n('F#', 3), n('A', 3)]),      #           Gmaj9
    (52.0, 54.5, n('E', 1), [n('E', 2), n('B', 2), n('D', 3), n('F#', 3), n('G', 3)]),      # Scène 6 : Em9
    (54.5, 56.5, n('A', 1), [n('A', 2), n('C#', 3), n('E', 3), n('G', 3), n('B', 3)]),      #           A9
    (56.5, 60.0, n('D', 2), [n('D', 3), n('A', 3), n('C#', 4), n('E', 4), n('F#', 4)]),     #           Dmaj9 (résolution)
]

t_all = np.arange(N) / SR


def env_adsr(length, a, r):
    e = np.ones(length)
    ai = int(a * SR)
    ri = int(r * SR)
    if ai > 0:
        e[:ai] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, ai))
    if ri > 0:
        e[-ri:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, ri))
    return e


def add(buf, start_s, sig):
    i = int(start_s * SR)
    if i < 0:
        sig = sig[-i:]
        i = 0
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


# ---------------------------------------------------------------- Nappe (pad)
def pad_note(freq, length_s, detune):
    L = int(length_s * SR)
    t = np.arange(L) / SR
    out = np.zeros(L)
    for d in (-detune, 0, detune):
        f = freq * 2 ** (d / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        for h in range(1, 7):
            out += np.sin(2 * np.pi * f * h * t + ph * h) / h ** 1.6
    vib = 1 + 0.15 * np.sin(2 * np.pi * 0.17 * t + rng.uniform(0, 6))
    return out * vib / 3


padL = np.zeros(N)
padR = np.zeros(N)
for (a, b, bass, notes) in CHORDS:
    length = b - a + 1.6
    e = env_adsr(int(length * SR), 1.3, 1.8)
    for k, m in enumerate(notes):
        padL_ = pad_note(midi(m), length, 7) * e
        padR_ = pad_note(midi(m), length, 9) * e
        add(padL, a - 0.3, padL_ * 0.06)
        add(padR, a - 0.3, padR_ * 0.06)

# Adoucissement de la nappe (passe-bas)
sos = butter(2, 2200, 'low', fs=SR, output='sos')
padL = sosfilt(sos, padL)
padR = sosfilt(sos, padR)

# ---------------------------------------------------------------- Basse douce
bass = np.zeros(N)
for (a, b, root, _) in CHORDS:
    if a < 6.0:
        continue
    length = b - a + 0.8
    L = int(length * SR)
    t = np.arange(L) / SR
    sig = np.sin(2 * np.pi * midi(root) * t) + 0.25 * np.sin(2 * np.pi * midi(root) * 2 * t)
    add(bass, a, sig * env_adsr(L, 0.25, 0.9) * 0.16)


# ---------------------------------------------------------------- Piano doux (arpèges)
def piano(freq, dur=2.6, vel=1.0):
    L = int(dur * SR)
    t = np.arange(L) / SR
    sig = np.zeros(L)
    for h, amp in [(1, 1.0), (2, 0.42), (3, 0.18), (4, 0.09), (5, 0.05)]:
        inharm = h * (1 + 0.0004 * h * h)
        decay = np.exp(-t * (1.6 + 0.9 * h))
        sig += amp * np.sin(2 * np.pi * freq * inharm * t) * decay
    attack = np.minimum(1, t / 0.004)
    hammer = rng.normal(0, 1, L) * np.exp(-t * 90) * 0.04
    return (sig * attack + hammer) * vel


pianoL = np.zeros(N)
pianoR = np.zeros(N)


def chord_at(time):
    for c in CHORDS:
        if c[0] <= time < c[1]:
            return c
    return CHORDS[-1]


# Densité des arpèges par scène : (début, fin, pas en secondes, octave de décalage, vélocité)
SECTIONS = [
    (1.0, 6.0, 1.0, 12, 0.55),
    (6.0, 17.0, 0.5, 12, 0.6),
    (17.0, 29.0, 0.5, 12, 0.62),
    (29.0, 41.0, 0.5, 24, 0.45),   # le soir : plus aigu, plus délicat
    (41.0, 52.0, 0.25, 12, 0.42),  # la culture : plus vivant
    (52.0, 56.5, 0.5, 12, 0.5),
]
pattern = [0, 2, 3, 4, 1, 3, 2, 4]
for (a, b, step, octv, vel) in SECTIONS:
    k = 0
    tt = a
    while tt < b - 1e-6:
        _, _, _, notes = chord_at(tt + 1e-3)
        idx = pattern[k % len(pattern)]
        m = notes[idx] + octv
        if step == 0.25 and k % 4 == 3:
            k += 1
            tt += step
            continue
        v = vel * (1.0 if k % 2 == 0 else 0.78) * rng.uniform(0.9, 1.05)
        pan = 0.5 + 0.35 * np.sin(k * 0.9)
        sig = piano(midi(m), 2.4, v)
        add(pianoL, tt, sig * (1 - pan) * 0.22)
        add(pianoR, tt, sig * pan * 0.22)
        k += 1
        tt += step

# Accord final arpégé lentement, qui résonne jusqu'au fondu.
for i, m in enumerate([n('D', 4), n('A', 4), n('C#', 5), n('E', 5), n('F#', 5), n('A', 5)]):
    sig = piano(midi(m), 4.5, 0.5)
    add(pianoL, 56.5 + i * 0.22, sig * 0.2 * (0.7 if i % 2 else 0.3))
    add(pianoR, 56.5 + i * 0.22, sig * 0.2 * (0.3 if i % 2 else 0.7))

# ---------------------------------------------------------------- Pulsation discrète (scènes 3 à 5)
perc = np.zeros(N)
for beat in np.arange(17.0, 52.0, 1.0):
    L = int(0.35 * SR)
    t = np.arange(L) / SR
    freq = 95 * np.exp(-t * 18) + 45
    kick = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 11)
    add(perc, beat, kick * (0.10 if beat % 2 == 1 else 0.06))
hp = butter(2, 6000, 'high', fs=SR, output='sos')
for tick in np.arange(17.5, 52.0, 1.0):
    L = int(0.12 * SR)
    t = np.arange(L) / SR
    sh = sosfilt(hp, rng.normal(0, 1, L)) * np.exp(-t * 40)
    add(perc, tick, sh * 0.025)

# ---------------------------------------------------------------- Mixage + réverbération
L = padL * 1.0 + pianoL + bass + perc
R = padR * 1.0 + pianoR + bass + perc


def reverb_ir(seconds=2.8, seed=1):
    g = np.random.default_rng(seed)
    Ln = int(seconds * SR)
    t = np.arange(Ln) / SR
    ir = g.normal(0, 1, Ln) * np.exp(-t * 3.2)
    ir = sosfilt(butter(1, 5000, 'low', fs=SR, output='sos'), ir)
    return ir / np.sqrt(np.sum(ir ** 2))


wetL = fftconvolve(L, reverb_ir(seed=1))[:N]
wetR = fftconvolve(R, reverb_ir(seed=2))[:N]
L = L * 0.78 + wetL * 0.32
R = R * 0.78 + wetR * 0.32

# Fondus d'entrée et de sortie (aucune coupure brutale)
fade = np.ones(N)
fi = int(1.2 * SR)
fo = int(3.2 * SR)
fade[:fi] = np.linspace(0, 1, fi) ** 2
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
L *= fade
R *= fade

peak = max(np.abs(L).max(), np.abs(R).max())
gain = 10 ** (-3 / 20) / peak
stereo = np.stack([L, R], axis=1) * gain

os.makedirs(os.path.join(ROOT, 'sfx'), exist_ok=True)
wavfile.write(os.path.join(ROOT, 'musique.wav'), SR, (stereo * 32767).astype(np.int16))
rms = 20 * np.log10(np.sqrt(np.mean(stereo ** 2)))
print(f'musique.wav : {DUR:.1f} s, crête -3 dBFS, niveau moyen {rms:.1f} dBFS')


# ---------------------------------------------------------------- Effets sonores
def save_sfx(name, sig):
    sig = sig / np.abs(sig).max() * 10 ** (-4 / 20)
    st = np.stack([sig, sig], axis=1) if sig.ndim == 1 else sig
    wavfile.write(os.path.join(ROOT, 'sfx', f'{name}.wav'), SR, (st * 32767).astype(np.int16))
    print(f'sfx/{name}.wav : {len(sig) / SR:.1f} s')


def with_reverb(sig, amount=0.45):
    wet = fftconvolve(sig, reverb_ir(2.0, 5))[: len(sig)]
    return sig * (1 - amount) + wet * amount


# Scintillement : petite cascade de notes aiguës (Dmaj9).
Ls = int(3.0 * SR)
shimmer = np.zeros(Ls)
for i, m in enumerate([n('D', 6), n('F#', 6), n('A', 6), n('C#', 7), n('E', 7)]):
    t = np.arange(Ls) / SR
    f = midi(m)
    s_ = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 2.2) * np.minimum(1, t / 0.01)
    shimmer[int(i * 0.07 * SR):] += s_[: Ls - int(i * 0.07 * SR)] * 0.6
save_sfx('shimmer', with_reverb(shimmer, 0.5))

# Cloche douce (partiels légèrement inharmoniques).
t = np.arange(int(2.6 * SR)) / SR
f = midi(n('A', 5))
chime = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in [(1, 1, 2.0), (2.76, 0.35, 3.5), (5.4, 0.15, 6)])
chime *= np.minimum(1, t / 0.006)
save_sfx('chime', with_reverb(chime, 0.4))

# Souffle : bruit filtré dont le filtre s'ouvre puis se referme.
Lw = int(1.6 * SR)
noise = rng.normal(0, 1, Lw)
t = np.arange(Lw) / SR
cut = 300 + 2600 * np.sin(np.pi * np.clip(t / 1.3, 0, 1)) ** 2
out = np.zeros(Lw)
y = 0.0
for i in range(Lw):
    a = 1 - np.exp(-2 * np.pi * cut[i] / SR)
    y += a * (noise[i] - y)
    out[i] = y
envw = np.sin(np.pi * np.clip(t / 1.4, 0, 1)) ** 2
save_sfx('whoosh', with_reverb(out * envw, 0.3))
