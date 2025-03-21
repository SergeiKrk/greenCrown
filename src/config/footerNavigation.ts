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
	ip?: string
	inn?: string
	ogrn?: string
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
		},
		ip: 'ИП Буравлев Денис Витальевич',
		inn: 'ИНН 564818897380',
		ogrn: 'ОГРНИП 323774600375797'
	},
	footerColumns: [
		{
			category: 'Лечение деревьев',
			subCategories: [
				{
					subCategory: 'Лечение деревьев',
					subCategoryLink: '/#'
				},
				{ subCategory: 'Обследование деревьев', subCategoryLink: '/obsledovanie-derevev' },
				{ subCategory: 'Лечение плодовых', subCategoryLink: '/lechenie-plodovyh' },
				{ subCategory: 'Лечение хвойных', subCategoryLink: '/lechenie-hvoinih' },
				{ subCategory: 'Лечение лиственных', subCategoryLink: '/lechenie-listvennyh' },
				{
					subCategory: 'Обработка от вредителей и инфекций',
					subCategoryLink: '/obrabotka-dereva-ot-vreditelej'
				},
				{ subCategory: 'Инъекции', subCategoryLink: '/inekcii-derevyam' },
				{ subCategory: 'Подкормка и защита', subCategoryLink: '/podkormka-derevev' },
				{ subCategory: 'Укрепление (Каблинг)', subCategoryLink: '/ukreplenie-derevev' }
			]
		},
		{
			category: 'Уход за деревьями',
			subCategories: [
				{ subCategory: 'Уход за деревьями', subCategoryLink: '/uhod-za-derevyami' },
				{ subCategory: 'Опрыскивание', subCategoryLink: '/opryskivanie-derevev' },
				{ subCategory: 'Санитарная обрезка', subCategoryLink: '/sanitarnaya-obrezka' },
				{ subCategory: 'Омолаживающая обрезка', subCategoryLink: '/omolazhivayushchaya-obrezka' },
				{ subCategory: 'Кронирование', subCategoryLink: '/kronirovanie' },
				{ subCategory: 'Каблинг', subCategoryLink: '/ukreplenie-derevev' }
			]
		},
		{
			category: 'Уход за участком',
			subCategories: [
				{ subCategory: 'Уход за участком', subCategoryLink: '/uhod-za-sadom' },
				{ subCategory: 'Обработка фунгицидами', subCategoryLink: '/obrabotka-fungicidami' },
				{ subCategory: 'Борьба с борщевиком', subCategoryLink: '/unichtozhenie-borshchevika' },
				{ subCategory: 'Посадка деревьев', subCategoryLink: '/posadka-derevev' },
				{ subCategory: 'Аэрация почвы', subCategoryLink: '/aehraciya-pochvy' },
				{ subCategory: 'Озеленение территории', subCategoryLink: '/ozelenenie-uchastka' },
				{ subCategory: 'Уход за газоном', subCategoryLink: '/uhod-za-gazonom' },
				{ subCategory: 'Прополка сорняков', subCategoryLink: '/propolka-sornyakov' }
			]
		},
		{
			category: 'Борьба с вредителями',
			subCategories: [
				{
					subCategory: 'Обработка от вредителей',
					subCategoryLink: '/obrabotka-uchastka-ot-vreditelej'
				},
				{ subCategory: 'Обработка от комаров', subCategoryLink: '/obrabotka-ot-komarov' },
				{ subCategory: 'Обработка от клещей', subCategoryLink: '/obrabotka-ot-kleshchej' },
				{ subCategory: 'Обработка от муравьев', subCategoryLink: '/obrabotka-ot-muravev' },
				{ subCategory: 'Обработка от короеда', subCategoryLink: '/obrabotka-ot-koroeda' },
				{ subCategory: 'Обработка от мышей', subCategoryLink: '/obrabotka-ot-myshey' },
				{ subCategory: 'Обработка от крыс', subCategoryLink: '/obrabotka-ot-krys' },
				{ subCategory: 'Борьба с кротами', subCategoryLink: '/borba-s-krotami' }
			]
		}
	],
	subFooter: {
		copywriteText: `© GREEN CROWN ${new Date().getFullYear()}.`
	}
}
