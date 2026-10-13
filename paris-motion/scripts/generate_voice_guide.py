#!/usr/bin/env python3
"""
Génère une VOIX GUIDE provisoire (synthèse vocale hors ligne espeak-ng + MBROLA fr4).
Elle sert uniquement à vérifier le rythme et la synchronisation : pour le rendu final,
enregistre ta propre voix (voir README.md, section « Enregistrer ta voix »).

Chaque phrase est accélérée si nécessaire pour tenir dans son créneau (src/lib/timeline.ts).
Prérequis : sudo apt install espeak-ng mbrola mbrola-fr4 ffmpeg
"""
import json, os, subprocess, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'public', 'voix', 'guide')
TEXT = json.load(open(os.path.join(ROOT, 'narration', 'voix_off.json'), encoding='utf-8'))
# Durées maximales (s) — identiques à VOICE_SLOTS dans src/lib/timeline.ts
MAX = {'scene1': 4.9, 'scene2': 10.0, 'scene3': 11.0, 'scene4': 11.0, 'scene5': 10.0, 'scene6': 6.6}
VOICE = os.environ.get('VOIX', 'mb-fr4')


def duration(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    return float(r.stdout.strip())


os.makedirs(OUT, exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    for key, text in TEXT.items():
        raw = os.path.join(tmp, f'{key}.wav')
        speed = 118
        while True:
            subprocess.run(['espeak-ng', '-v', VOICE, '-s', str(speed), '-p', '42', '-a', '60', '-w', raw, text], check=True)
            d = duration(raw)
            if d <= MAX[key] * 0.94 or speed >= 190:
                break
            speed += 6
        dst = os.path.join(OUT, f'{key}.wav')
        # Nettoyage : passe-haut, léger adoucissement, normalisation du volume, stéréo 44,1 kHz.
        subprocess.run([
            'ffmpeg', '-y', '-v', 'error', '-i', raw,
            '-af', 'highpass=f=90,lowpass=f=7500,adelay=60|60,loudnorm=I=-16:TP=-2:LRA=7',
            '-ar', '44100', '-ac', '2', dst,
        ], check=True)
        print(f'{key}: {duration(dst):.2f} s (max {MAX[key]} s, vitesse {speed} mots/min)')
