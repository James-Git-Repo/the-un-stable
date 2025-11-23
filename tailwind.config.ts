import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Bodoni MT',
          'Bodoni Moda',
          'Georgia',
          'serif',
        ],
        navbar: [
          'Bodoni MT',
          'Bodoni Moda',
          'Georgia',
          'serif',
        ],
        hero: [
          'Bodoni MT',
          'Bodoni Moda',
          'Georgia',
          'serif',
        ],
        'hero-subtitle': [
          'Bodoni MT',
          'Bodoni Moda',
          'Georgia',
          'serif',
        ],
        title: [
          'Bodoni MT',
          'Bodoni Moda',
          'Georgia',
          'serif',
        ],
        body: [
          'Bodoni MT',
          'Bodoni Moda',
          'Georgia',
          'serif',
        ],
      },
      backgroundSize: {
        "400%": "400% 400%",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        hover: "hsl(var(--hover))",
        "chip-up": "hsl(var(--chip-up))",
        "chip-down": "hsl(var(--chip-down))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) translateX(20px) rotate(5deg)" },
        },
        "slide-diagonal": {
          "0%": { transform: "translateX(-100%) translateY(-100%)" },
          "100%": { transform: "translateX(100%) translateY(100%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "grid-move": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(60px)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "scroll-down": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(20px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 60s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out infinite",
        "slide-diagonal": "slide-diagonal 30s linear infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "grid-move": "grid-move 20s linear infinite",
        "draw-line": "draw-line 3s ease-in-out infinite",
        "draw-line-delayed": "draw-line 4s ease-in-out infinite 1s",
        "scroll-down": "scroll-down 20s linear infinite",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
