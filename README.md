# Gym Instruction App

**Live site:** https://gym-instruction-eight.vercel.app/

---

## The Problem

Most gym equipment comes with a paper instruction — dense text, static diagrams, and anatomical labels that mean little to someone who has never trained before. Even after reading it, beginners often still don't know:

- How to execute the movement correctly
- Which muscles are actually being trained
- What adjustments to make for their body

The consequences are real: people avoid equipment entirely, develop bad form, or injure themselves. Even those who attend a coach-led class often struggle to replicate movements independently — the instruction doesn't stay with them once they're training alone.

**Target users:** Gym beginners — people who are new to weight training, training without a coach, and want to use equipment safely and correctly on their own.

---

## The Solution

A free, mobile-first web app that replaces static paper instructions with an interactive experience. Scan the QR code on any machine and instantly see:

- An interactive 3D model of the machine — rotatable and auto-spinning, showing the actual movement
- Simple, step-by-step instructions written for beginners
- Common mistakes to avoid
- A safety warning specific to that machine

No download. No account. Just scan and learn — reducing the risk of injury at the point where it matters most.

The app supports Traditional Chinese and English, making it accessible in multilingual gym environments like public facilities in Taiwan.

---

## Why I Built This

I noticed the problem while training myself. To validate it, I interviewed around 20 gym beginners and asked whether an interactive, visual instruction format would be more helpful than what currently exists — 18 out of 20 said yes.

That was enough to confirm this wasn't just a personal frustration. It's a gap that existing gym infrastructure hasn't addressed, and one that a simple, well-designed tool could fill — especially in government-funded public gyms where on-site education resources are limited.

---

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- react-i18next (Traditional Chinese / English)
- Sketchfab embeds for interactive 3D models
- Deployed on Vercel
