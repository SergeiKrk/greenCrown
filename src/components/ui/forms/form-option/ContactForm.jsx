import React, { useState, useMemo, useEffect, useRef } from 'react'

const CAPTCHA_SITEKEY = 'ysc1_9IMphgkXA77gJofEhIWLxxEt28MfPYlVpvQ6rI0k7e7913cd'

export default function ContactForm({ isActive, formType, titleForm, idForm }) {
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const formRef = useRef(null)

	const formTime = useMemo(() => Date.now(), [])

	useEffect(() => {
		if (window.smartCaptcha) {
			return
		}

		const script = document.createElement('script')

		script.src = 'https://smartcaptcha.yandexcloud.net/captcha.js'

		script.async = true

		document.body.appendChild(script)
	}, [])

	const placeholders = {
		phone: '+7 9999 99 99',
		wp: '+7 9999 99 99',
		tg: '@username или номер'
	}

	const labels = {
		phone: 'Телефон',
		wp: 'Whatsapp',
		tg: 'Telegram'
	}

	const inputNames = {
		phone: 'FormPhone',
		wp: 'FormWp',
		tg: 'FormTg'
	}

	const inputTypes = {
		phone: 'tel',
		wp: 'tel',
		tg: 'text'
	}

	const idInput = `id-0${formType === 'phone' ? '1' : formType === 'wp' ? '2' : '3'}`

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		const form = formRef.current
		const inputValue = form.querySelector(`[name="${inputNames[formType]}"]`)?.value?.trim()

		if (!inputValue) {
			setError('Пожалуйста, заполните поле')
			return
		}

		if (
			(formType === 'phone' || formType === 'wp') &&
			!/^(\+7|8)[\d\s\-()]{10,}$/.test(inputValue)
		) {
			setError('Введите корректный номер телефона')
			return
		}

		const token = form.querySelector('[name="smart-token"]')?.value
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
			} else {
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
			}
		} catch {
			setError('Произошла ошибка. Попробуйте позже')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form
			ref={formRef}
			action="/send.php"
			method="POST"
			onSubmit={handleSubmit}
			className={`pt-3 text-sm ${isActive ? '' : 'hidden'}`}
			id={`tab-panel-${formType}fi`}
			aria-hidden={isActive ? 'false' : 'true'}
			role="tabpanel"
			aria-labelledby={`tab-label-${formType}fi`}
			tabIndex="-1"
		>
			<input type="hidden" name="FormName" value={`${titleForm} [Форма №${idForm}]`} />

			<input type="hidden" name="form_time" value={formTime} />

			<input type="text" name="website" autoComplete="off" tabIndex="-1" className="hidden" />

			<div className="relative my-2 flex flex-col lg:flex-row">
				<input
					id={idInput}
					type={inputTypes[formType]}
					name={inputNames[formType]}
					placeholder={placeholders[formType]}
					required
					className="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-emerald-500 placeholder-transparent caret-pink-500 outline-none transition-all"
				/>

				<label
					htmlFor={idInput}
					className="absolute -top-2 left-2 z-[1] cursor-text bg-white px-2 text-xs text-slate-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs"
				>
					{labels[formType]}
				</label>
			</div>

			<div className="smart-captcha mb-3" data-sitekey={CAPTCHA_SITEKEY}></div>

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
	)
}
