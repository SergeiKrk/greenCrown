import React, { useState, useRef, useEffect, useMemo } from 'react'
import TabButton from './TabButton'
import PhoneIcon from './icons/PhoneIcon'
import WhatsappIcon from './icons/WhatsappIcon'
import TelegramIcon from './icons/TelegramIcon'

const CAPTCHA_SITEKEY = 'ysc1_9IMphgkXA77gJofEhIWLxxEt28MfPYlVpvQ6rI0k7e7913cd'

const TABS = [
	{
		id: 'phone',
		label: 'Телефон',
		icon: PhoneIcon,
		name: 'FormPhone',
		type: 'tel',
		placeholder: '+7 9999 99 99'
	},
	{
		id: 'wp',
		label: 'Whatsapp',
		icon: WhatsappIcon,
		name: 'FormWp',
		type: 'tel',
		placeholder: '+7 9999 99 99'
	},
	{
		id: 'tg',
		label: 'Telegram',
		icon: TelegramIcon,
		name: 'FormTg',
		type: 'text',
		placeholder: '@username'
	}
]

export default function FormOption({ titleForm, idForm }) {
	const [activeTabId, setActiveTabId] = useState('phone')
	const [inputValue, setInputValue] = useState('')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const wrapperRef = useRef(null)
	const formRef = useRef(null)
	const captchaContainerRef = useRef(null)
	const captchaWidgetIdRef = useRef(null)

	const formTime = useMemo(() => Date.now(), [])
	const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0]

	// Lazy fallback: ensure script presence even if it wasn't preloaded in layout.
	useEffect(() => {
		if (window.smartCaptcha) return
		if (document.querySelector('script[src*="smartcaptcha.yandexcloud.net/captcha.js"]')) return

		const script = document.createElement('script')
		script.src = 'https://smartcaptcha.yandexcloud.net/captcha.js?render=onload'
		script.async = true
		document.body.appendChild(script)
	}, [])

	// Render the captcha widget explicitly so we own its lifecycle (and can reset).
	useEffect(() => {
		let cancelled = false
		let intervalId = null

		const tryRender = () => {
			if (cancelled) return false
			if (!captchaContainerRef.current) return false
			if (!window.smartCaptcha || typeof window.smartCaptcha.render !== 'function') return false
			if (captchaWidgetIdRef.current !== null) return true

			captchaWidgetIdRef.current = window.smartCaptcha.render(captchaContainerRef.current, {
				sitekey: CAPTCHA_SITEKEY,
				hl: 'ru'
			})
			return true
		}

		if (!tryRender()) {
			intervalId = window.setInterval(() => {
				if (tryRender() && intervalId !== null) {
					window.clearInterval(intervalId)
					intervalId = null
				}
			}, 150)
		}

		return () => {
			cancelled = true
			if (intervalId !== null) window.clearInterval(intervalId)
		}
	}, [])

	// On tab switch: clear input value and error.
	// IMPORTANT: do NOT reset the captcha here — the SmartCaptcha widget is
	// shared across tabs, and programmatic reset() can produce a token that
	// the backend will subsequently reject. The widget is reset only after a
	// real server-side failure (see handleSubmit).
	useEffect(() => {
		setInputValue('')
		setError('')
	}, [activeTabId])

	// Keyboard navigation between tabs.
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!wrapperRef.current || !wrapperRef.current.contains(e.target)) return

			const idx = TABS.findIndex((t) => t.id === activeTabId)

			if (e.keyCode === 39) {
				setActiveTabId(TABS[(idx + 1) % TABS.length].id)
			} else if (e.keyCode === 37) {
				setActiveTabId(TABS[(idx - 1 + TABS.length) % TABS.length].id)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [activeTabId])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		const value = inputValue.trim()

		if (!value) {
			setError('Пожалуйста, заполните поле')
			return
		}

		if (
			(activeTabId === 'phone' || activeTabId === 'wp') &&
			!/^(\+7|8)[\d\s\-()]{10,}$/.test(value)
		) {
			setError('Введите корректный номер телефона')
			return
		}

		if (activeTabId === 'tg' && !/^@?[a-zA-Z0-9_]{4,32}$/.test(value)) {
			setError('Введите корректный Telegram username')
			return
		}

		const form = formRef.current
		const token = form?.querySelector('[name="smart-token"]')?.value

		if (!token) {
			setError('Пожалуйста, пройдите проверку капчи')
			return
		}

		setIsSubmitting(true)

		try {
			const formData = new FormData(form)

			const response = await fetch('/send.php', {
				method: 'POST',
				body: formData
			})

			if (response.ok || response.redirected) {
				window.location.href = '/zayavka-otpravlena/'
				return
			}

			switch (response.status) {
				case 403:
					setError('Ошибка отправки. Проверьте правильность заполнения формы')
					break
				case 429:
					setError('Слишком много запросов. Подождите 30 секунд')
					break
				case 500:
					setError('Ошибка сервера. Попробуйте позже')
					break
				default:
					setError('Произошла ошибка. Попробуйте позже')
			}

			if (
				window.smartCaptcha &&
				typeof window.smartCaptcha.reset === 'function' &&
				captchaWidgetIdRef.current !== null
			) {
				try {
					window.smartCaptcha.reset(captchaWidgetIdRef.current)
				} catch {
					/* no-op */
				}
			}
		} catch {
			setError('Произошла ошибка. Попробуйте позже')
		} finally {
			setIsSubmitting(false)
		}
	}

	const idInput = `id-${idForm}-${activeTabId}`
	const panelId = `tab-panel-${activeTabId}fi`

	return (
		<>
			<p className="my-3 flex items-start text-xs">Выберите удобный способ связи:</p>

			<ul className="flex items-center gap-1" role="tablist" ref={wrapperRef}>
				{TABS.map((tab, index) => (
					<TabButton
						key={tab.id}
						isActive={activeTabId === tab.id}
						icon={tab.icon}
						label={tab.label}
						tabId={`tab-label-${tab.id}fi`}
						onClick={() => setActiveTabId(tab.id)}
						posInSet={index + 1}
						setSize={TABS.length}
					/>
				))}
			</ul>

			<form
				ref={formRef}
				action="/send.php"
				method="POST"
				onSubmit={handleSubmit}
				className="pt-3 text-sm"
				id={panelId}
				role="tabpanel"
				aria-labelledby={`tab-label-${activeTabId}fi`}
			>
				<input type="hidden" name="FormName" value={`${titleForm} [Форма №${idForm}]`} />
				<input type="hidden" name="form_time" value={formTime} />
				<input type="text" name="website" autoComplete="off" tabIndex="-1" className="hidden" />

				<div className="relative my-2 flex flex-col lg:flex-row">
					<input
						id={idInput}
						type={activeTab.type}
						name={activeTab.name}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder={activeTab.placeholder}
						required
						autoComplete="off"
						className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-emerald-500 placeholder-transparent caret-pink-500 outline-none transition-all"
					/>

					<label
						htmlFor={idInput}
						className="absolute -top-2 left-2 z-[1] cursor-text bg-white px-2 text-xs text-slate-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs"
					>
						{activeTab.label}
					</label>
				</div>

				<div ref={captchaContainerRef} className="mb-3"></div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="mt-2 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded border border-emerald-500 px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:border-emerald-600 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 md:mt-0 lg:mt-0 lg:py-2"
				>
					<span>{isSubmitting ? 'Отправка...' : 'Заказать консультацию'}</span>
				</button>

				{error && <p className="mt-2 text-xs text-red-500">{error}</p>}

				<p className="mt-3 text-xs">
					Нажимая на кнопку Вы соглашаетесь c <a href="/politic">политикой конфиденциальности</a>
				</p>
			</form>
		</>
	)
}
