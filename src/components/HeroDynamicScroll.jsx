import React, { useEffect, useRef, useState } from 'react'

const HeroDynamicScroll = ({ lugdoroga, moskvasiti, derevolev, derevopr, obrabotchiki }) => {
	const [scrollPosition, setScrollPosition] = useState(0)
	const lugdorogaRef = useRef(null)
	const moskvasitiRef = useRef(null)
	const derevolevRef = useRef(null)
	const derevoprRef = useRef(null)
	const obrabotchikiRef = useRef(null)

	useEffect(() => {
		// Функция дебаунсинга
		const debounce = (func, wait) => {
			let timeout
			return function (...args) {
				clearTimeout(timeout)
				timeout = setTimeout(() => func.apply(this, args), wait)
			}
		}

		// Обработчик прокрутки
		const handleScroll = debounce(() => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			setScrollPosition(scrollTop)
		}, 50)

		const handleIntersection = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					window.addEventListener('scroll', handleScroll)
				} else {
					window.removeEventListener('scroll', handleScroll)
				}
			})
		}

		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			threshold: 0
		})

		const target = document.getElementById('intro')
		if (target) {
			observer.observe(target)
		}

		// Чистим после размонтирования компонента
		return () => {
			window.removeEventListener('scroll', handleScroll)
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		if (lugdorogaRef.current) {
			lugdorogaRef.current.style.transform = `translateY(${scrollPosition * 0.3}px)`
		}
		if (moskvasitiRef.current) {
			moskvasitiRef.current.style.transform = `translateY(${scrollPosition * 0.42}px)`
		}
		if (derevolevRef.current) {
			derevolevRef.current.style.transform = `translateY(${scrollPosition * 0.32}px)`
		}
		if (derevoprRef.current) {
			derevoprRef.current.style.transform = `translateY(${scrollPosition * 0.37}px)`
		}
		if (obrabotchikiRef.current) {
			obrabotchikiRef.current.style.transform = `translateY(${scrollPosition * 0.25}px)`
		}
	}, [scrollPosition])

	return (
		<div className="relative h-full w-full">
			<img
				ref={lugdorogaRef}
				src={lugdoroga.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="absolute bottom-0 left-0 z-20 w-full translate-y-10 object-cover transition-all duration-700"
			/>
			<img
				ref={moskvasitiRef}
				src={moskvasiti.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="absolute left-0 z-10 ml-[10%] w-[70%] translate-y-10 object-cover transition-all duration-500 2xl:bottom-[40%]"
			/>
			<img
				ref={derevolevRef}
				src={derevolev.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				width="200"
				class="translate-y-50 invisible absolute left-0 z-30 object-cover transition-all duration-300 2xl:visible 2xl:bottom-[50%] 2xl:-ml-[10%]"
				id="hero-image"
			/>
			<img
				ref={derevoprRef}
				src={derevopr.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				class="absolute right-0 z-30 -mr-[2%] w-[40%] translate-y-10 transition-all duration-300 2xl:bottom-[35%]"
				id="hero-image"
			/>
			<img
				ref={obrabotchikiRef}
				src={obrabotchiki.src}
				width={200}
				alt="GreenCrown - Уход за зелеными насаждениями"
				class="absolute right-0 z-30 mr-[20%] translate-y-10 transition-all duration-700 2xl:bottom-[5%]"
				id="hero-image"
			/>
		</div>
	)
}

export default HeroDynamicScroll
