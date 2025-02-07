import type { Config } from "tailwindcss";
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		fontFamily: {
    			heading: [
    				'var(--font-heading)',
    				'serif'
    			],
    			body: [
    				'var(--font-body)',
    				'sans-serif'
    			]
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				'100': '#eff6f4',
    				'200': '#cfe3dd',
    				'300': '#afd0c6',
    				'400': '#8ebdaf',
    				'500': '#6ea998',
    				'600': '#55917e',
    				'700': '#427162',
    				'800': '#2f5046',
    				'900': '#1c302a',
    				'1000': '#09100e',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				'100': '#faefeaa',
    				'200': '#f1cec1',
    				'300': '#e7ad98',
    				'400': '#dd8c6e',
    				'500': '#ba512b',
    				'600': '#913f22',
    				'700': '#672d18',
    				'800': '#3e1b0e',
    				'900': '#150905',
    				'1000': '#0a0403',
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			accent: {
    				'100': '#F9F1EB',
    				'200': '#F1DDCD',
    				'300': '#EED6C3',
    				'400': '#E3BB9B',
    				'500': '#D8A074',
    				'600': 'hsl(var(--accent-000))',
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				'100': '#f5f5f5',
    				'200': '#e5e5e5',
    				'300': '#d4d4d4',
    				'400': '#a3a3a3',
    				'500': '#737373',
    				'600': '#525252',
    				'700': '#404040',
    				'800': '#262626',
    				'900': '#171717',
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			success: {
    				'100': '#c7e1c8',
    				'200': '#8fc391',
    				'300': '#3e7440',
    				DEFAULT: 'hsl(var(--success))'
    			},
    			warning: {
    				'100': '#ffdbb4',
    				'200': '#ffb86a',
    				'300': '#c76d00',
    				DEFAULT: 'hsl(var(--warning))'
    			},
    			error: {
    				'100': '#f6b1b1',
    				'200': '#ed6464',
    				'300': '#e01a1a',
    				DEFAULT: 'hsl(var(--error))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
} satisfies Config;
