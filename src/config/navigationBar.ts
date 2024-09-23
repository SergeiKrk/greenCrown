// Navigation Bar
// ------------
// Description: The navigation bar data for the website.
export interface Logo {
	src: string
	alt: string
	text: string
}

export interface NavSubItem {
	name: string
	link: string
}

export interface NavItem {
	name: string
	link: string
	submenu?: NavSubItem[]
}

export interface NavAction {
	name: string
	link: string
	style: string
	size: string
}

export interface NavData {
	logo: Logo
	navItems: NavItem[]
	navActions: NavAction[]
}

export const navigationBarData: NavData = {
	logo: {
		src: '/logoGreenCrown.png',
		alt: 'GREENCROWN',
		text: 'GREENCROWN'
	},
	navItems: [
		{ name: 'Главная', link: '/' },
		{ name: 'Садовый календарь', link: '/sadovyj-kalendar' },
		{
			name: 'Услуги',
			link: '#',
			submenu: [{ name: 'Лечение деревьев', link: '/lechenie-derevev' }]
		},
		{
			name: 'Resources',
			link: '#',
			submenu: [
				{ name: 'Blog', link: '/blog' },
				{ name: 'FAQ', link: '/faq' },
				{ name: 'Terms', link: '/terms' },
				{ name: 'Features', link: '/features' },
				{ name: 'Contact', link: '/contact' }
			]
		}
	],
	navActions: [{ name: 'Try it now', link: '/', style: 'primary', size: 'lg' }]
}
