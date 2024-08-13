// Config
// ------------
// Description: The configuration file for the website.

export interface Logo {
	src: string
	alt: string
}

export type Mode = 'auto' | 'light' | 'dark'

export interface Config {
	siteTitle: string
	siteDescription: string
	ogImage: string
	logo: Logo
	canonical: boolean
	noindex: boolean
	mode: Mode
	scrollAnimations: boolean
}

export const configData: Config = {
	siteTitle: 'Уход за зелеными насаждениями: Защита и обработка деревьев',
	siteDescription:
		'Комплексный уход за зелеными насаждениями: лечение деревьев, защита от вредителей, профессиональное обслуживание участков',
	ogImage: '/og.jpg',
	logo: {
		src: '../assets/logoGreenCrown.png',
		alt: 'GreenCrown logo'
	},
	canonical: true,
	noindex: false,
	mode: 'auto',
	scrollAnimations: true
}
