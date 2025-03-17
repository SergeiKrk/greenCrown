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
	subsubmenu?: NavSubItem[]
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
			submenu: [
				{
					name: 'Лечение деревьев',
					link: '/lechenie-derevev',
					subsubmenu: [
						{ name: 'Обследование деревьев', link: '/obsledovanie-derevev' },
						{ name: 'Лечение плодовых', link: '/lechenie-plodovyh' },
						{ name: 'Лечение хвойных', link: '/lechenie-hvoinih' },
						{ name: 'Лечение лиственных', link: '/lechenie-listvennyh' },
						{ name: 'Обработка от вредителей и инфекций', link: '/obrabotka-dereva-ot-vreditelej' },
						{ name: 'Инъекции', link: '/inekcii-derevyam' },
						{ name: 'Подкормка и защита', link: '/podkormka-derevev' }
					]
				},
				{
					name: 'Уход за деревьями',
					link: '/uhod-za-derevyami',
					subsubmenu: [
						{ name: 'Опрыскивание', link: '/opryskivanie-derevev' },
						{ name: 'Укрепление (Каблинг)', link: '/ukreplenie-derevev' }
					]
				},
				{
					name: 'Обрезка деревьев',
					link: '/obrezka-derevev',
					subsubmenu: [
						{ name: 'Формовочная обрезка', link: '/formovochnaya-obrezka' },
						{ name: 'Санитарная обрезка', link: '/sanitarnaya-obrezka' },
						{ name: 'Омолаживающая обрезка', link: '/omolazhivayushchaya-obrezka' },
						{ name: 'Кронирование', link: '/kronirovanie' }
					]
				},
				{
					name: 'Уход за участком',
					link: '/uhod-za-sadom',
					subsubmenu: [
						{ name: 'Обработка фунгицидами', link: '/obrabotka-fungicidami' },
						{ name: 'Борьба с борщевиком', link: '/unichtozhenie-borshchevika' },
						{ name: 'Посадка деревьев', link: '/posadka-derevev' },
						{ name: 'Аэрация почвы', link: '/aehraciya-pochvy' },
						{ name: 'Озеленение территории', link: '/ozelenenie-uchastka' },
						{ name: 'Уход за газоном', link: '/uhod-za-gazonom' },
						{ name: 'Прополка сорняков', link: '/propolka-sornyakov' }
					]
				},
				{
					name: 'Обработка от вредителей',
					link: '/obrabotka-uchastka-ot-vreditelej',
					subsubmenu: [
						{ name: 'Обработка от комаров', link: '/obrabotka-ot-komarov' },
						{ name: 'Обработка от клещей', link: '/obrabotka-ot-kleshchej' },
						{ name: 'Обработка от муравьев', link: '/obrabotka-ot-muravev' },
						{ name: 'Обработка от короеда', link: '/obrabotka-ot-koroeda' },
						{ name: 'Обработка от мышей', link: '/obrabotka-ot-myshey' },
						{ name: 'Обработка от крыс', link: '/obrabotka-ot-krys' },
						{ name: 'Борьба с кротами', link: '/borba-s-krotami' }
					]
				}
			]
		}
	],
	navActions: [{ name: 'Try it now', link: '/', style: 'primary', size: 'lg' }]
}
