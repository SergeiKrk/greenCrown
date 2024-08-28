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
			derevolevRef.current.style.transform = `translateY(${scrollPosition * 0.27}px)`
		}
		if (derevoprRef.current) {
			derevoprRef.current.style.transform = `translateY(${scrollPosition * 0.27}px)`
		}
		if (obrabotchikiRef.current) {
			obrabotchikiRef.current.style.transform = `translateY(${scrollPosition * 0.35}px)`
		}
	}, [scrollPosition])

	return (
		<div className="relative h-full w-full">
			<img
				ref={lugdorogaRef}
				src={lugdoroga.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="absolute bottom-0 left-0 z-20 w-full translate-y-10 object-cover transition-all duration-[0.7s]"
			/>
			<img
				ref={moskvasitiRef}
				src={moskvasiti.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="absolute left-0 z-10 ml-[10%] w-[70%] translate-y-10 object-cover transition-all duration-[0.5s] 2xl:bottom-[40%]"
			/>
			<img
				ref={derevolevRef}
				src={derevolev.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="translate-y-50 absolute left-0 z-20 -ml-[8%] w-[25%] object-cover transition-all duration-[0.7s] 2xl:bottom-[40%]"
			/>
			<img
				ref={derevoprRef}
				src={derevopr.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="translate-y-50 absolute right-0 z-20 -mr-[5%] w-[40%] object-cover transition-all duration-[0.7s] 2xl:bottom-[35%]"
			/>
			<img
				ref={obrabotchikiRef}
				src={obrabotchiki.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="translate-y-50 absolute right-0 z-30 mr-[22%] w-[25%] object-cover transition-all duration-[0.7s] 2xl:bottom-[20%]"
			/>
		</div>
	)
}

export default HeroDynamicScroll
