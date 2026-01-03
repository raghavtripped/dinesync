# DineSync 🍽️

> **Stop the "Where should we eat?" debate.**  
> A collaborative, real-time group dining decision app that gamifies restaurant selection and bill splitting.

![DineSync Demo](https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2874&auto=format&fit=crop)

## 🚀 Overview

**DineSync** solves the chaos of group dining planning. From sending invites to splitting the bill, it streamlines the entire process into a fun, interactive flow.

Built with **React**, **TypeScript**, **Framer Motion**, and **Tailwind CSS**, it features a smooth, app-like experience with glassmorphism UI and fluid animations.

---

## ✨ Key Features

### 1. **Instant Lobby Creation** 📨
- Generate a unique invite link in seconds.
- Customize group name and participant count.
- **Visuals:** Shareable link UI with copy-to-clipboard feedback.

### 2. **Real-Time Lobby** 👥
- Watch friends join the lobby in real-time.
- Interactive avatar circle with "nudge" functionality.
- **Visuals:** Avatars popping in around a virtual table.

### 3. **Smart Preference Collection** 🌶️
- Asynchronous voting system.
- Users set cravings: **Cuisine**, **Ambiance**, **Budget**, **Spice Level**, etc.
- **Visuals:** Clean sliders and pill selectors for quick input.

### 4. **AI-Powered Recommendations** 🤖
- "AI" engine analyzes group preferences to suggest top 3 matches.
- Shows match percentage (e.g., "98% Match").
- **Visuals:** Loading animation simulating "Analyzing spice levels..." followed by sleek restaurant cards.

### 5. **Democratic Voting** 🗳️
- Tinder-style or list-based voting on the curated options.
- Live progress bars show leading choices.
- **Visuals:** Confetti explosion when the winner is decided! 🎉

### 6. **Smart Split & Receipt** 🧾
- **Simulated Bill Split:** Intelligent breakdown based on who ate what (Veg/Non-Veg, Alcohol/Mocktail).
- **Splitwise Integration:** One-click option to settle up.
- **Visuals:** Interactive receipt with individual share calculation.

---

## 🛠️ Tech Stack

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📸 User Journey

1.  **Host** starts the app and creates a "Dinner Squad" group.
2.  **Friends** join the lobby (simulated in this demo version).
3.  Everyone inputs their **cravings** (e.g., "Italian", "Rooftop", "₹800").
4.  The **AI Revelation** presents the best restaurant options.
5.  Group **Votes** on the options.
6.  **Winner Declared!** Reservation is "confirmed."
7.  After the meal, the **Smart Split** calculates shares (e.g., Vegetarians don't pay for Chicken Wings).

---

## 💻 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/raghavtripped/dinesync.git
    cd dinesync
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

---

## 🎨 Theme Support

Includes a fully functional **Light/Dark mode toggle**.
- **Dark Mode:** Deep slate backgrounds with neon accents (Cyberpunk/Nightlife vibe).
- **Light Mode:** Clean white/gray surfaces with orange accents (Fresh/Brunch vibe).

---

## 🤝 Contributing

This is a prototype built for demonstration. Feel free to fork and expand!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*Crafted with ❤️ by Raghav Tripathi*
