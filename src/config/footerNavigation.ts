// Footer Navigation
// ------------
// Description: The footer navigation data for the website.
export interface Logo {
	src: string
	alt: string
	text: string
}

export interface FooterAbout {
	title: string
	aboutText: string
	logo: Logo
}

export interface SubCategory {
	subCategory: string
	subCategoryLink: string
}

export interface FooterColumn {
	category: string
	subCategories: SubCategory[]
}

export interface SubFooter {
	copywriteText: string
}

export interface FooterData {
	footerAbout: FooterAbout
	footerColumns: FooterColumn[]
	subFooter: SubFooter
}

export const footerNavigationData: FooterData = {
	footerAbout: {
		title: 'Foxi.',
		aboutText:
			'Сохраним красоту и силу ваших деревьев и растений. Комплексный уход и защита зеленых насаждения на вашем участке.',
		logo: {
			src: '../../assets/logoGreenCrown.png',
			alt: 'Green Crown - ЛЕЧЕНИЕ РАСТЕНИЙ и БЕРЕЖНЫЙ УХОД',
			text: 'GreenCrown'
		}
	},
	footerColumns: [
		{
			category: 'Лечение',
			subCategories: [
				{
					subCategory: 'Лечение деревьев',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Oбследование деревьев',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Лечение хвойных',
					subCategoryLink: '/lechenie-hvoinih'
				},
				{
					subCategory: 'Лечение плодовых',
					subCategoryLink: '/lechenie-plodovyh'
				},
				{
					subCategory: 'Лечение листенных',
					subCategoryLink: '/lechenie-listvennyh'
				},
				{
					subCategory: 'Обработка деревьев от вредителей',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Стволовые инъекции ',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Подкормка деревьев',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Обрезка деревьев',
					subCategoryLink: '/#'
				}
			]
		},
		{
			category: 'Обработка участка',
			subCategories: [
				{
					subCategory: 'Обработка от вредителей',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Обработка от клещей',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Обработка от муравьев',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Обработка от короеда',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Обработка от мышей',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Обработка от крыс',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Обработка от кротов',
					subCategoryLink: '/#'
				}
			]
		},
		{
			category: 'Уход',
			subCategories: [
				{
					subCategory: 'Уход за деревьями',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Опрыскивание деревьев',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Укрепление деревьев (Каблинг)',
					subCategoryLink: '/#'
				},
				{
					subCategory: 'Восстановление деревьев',
					subCategoryLink: '/#'
				}
			]
		}
	],
	subFooter: {
		copywriteText: '© GREEN CROWN 2024.'
	}
}
