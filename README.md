# Gym Instruction App

**Live site:** https://gym-instruction-eight.vercel.app/

---

## The Problem

Public gyms — especially government-funded ones — are full of weight machines that most beginners have never touched. There's no staff explaining how to use them, no labels beyond the machine name, and hiring a personal trainer is expensive. The result: people avoid the equipment entirely, use it wrong and risk injury, or give up on going to the gym altogether.

This gap hits hardest for beginners, particularly women who are new to weight training and just want to get fit without the cost or intimidation of a coach.

---

## The Solution

A free, mobile-first web app that turns every gym machine into a self-service instructor. Each machine gets a QR code. Scan it, and you instantly see:

- An interactive 3D model of the machine — rotatable, auto-spinning, showing the movement
- Step-by-step instructions for correct form
- Common mistakes to avoid
- A context-aware safety warning specific to that machine

No app download. No account. No cost. Just scan and learn.

---

## Why I Built This

The fitness app market is flooded with subscription products targeting experienced gym-goers. Nobody is solving the on-site, in-the-moment problem for the person standing in front of a machine they've never used.

Government-funded public gyms in particular have the infrastructure (machines, space, members) but almost no budget for on-site education. A QR code sticker costs nothing to print. This app costs nothing to use.

This is the kind of problem I find interesting — not technically glamorous, but real, underserved, and solvable with simple tools if you identify the right constraint.

---

## How It's Used

1. A gym prints the QR code page from `/admin/qr-codes`
2. Each QR code gets placed on its corresponding machine
3. A gym member scans the code with their phone
4. They see bilingual instructions (Traditional Chinese default, English toggle) and an interactive 3D demo — no installation required

The app is fully read-only and static. There's nothing to log into, nothing to update, and nothing that can break mid-session.

---

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- react-i18next (Traditional Chinese / English)
- Sketchfab embeds for interactive 3D models
- Deployed on Vercel

---

## Built in the Vibe Coding Era

This project was built with AI-assisted development. The goal wasn't just to ship fast — it was to demonstrate that good product thinking still matters even when the code writes itself. Identifying a real problem, making sharp scope decisions, and knowing what to cut are the skills that separate useful tools from disposable prototypes.
