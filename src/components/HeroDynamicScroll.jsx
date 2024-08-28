import React, { useEffect, useRef, useState } from 'react'

const HeroDynamicScroll = ({ lugdoroga, moskvasiti }) => {
	const [scrollPosition, setScrollPosition] = useState(0)
	const heroImageRef = useRef(null)
	const secondaryImageRef = useRef(null)

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
		if (heroImageRef.current) {
			heroImageRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`
		}
		if (secondaryImageRef.current) {
			secondaryImageRef.current.style.transform = `translateY(${scrollPosition * 0.25}px)`
		}
	}, [scrollPosition])

	return (
		<div className="relative h-full w-full">
			<img
				ref={heroImageRef}
				src={lugdoroga.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="absolute bottom-0 left-0 z-20 w-full translate-y-10 object-cover transition-all duration-700"
			/>
			<img
				ref={secondaryImageRef}
				src={moskvasiti.src}
				alt="GreenCrown - Уход за зелеными насаждениями"
				className="absolute left-0 z-10 ml-[10%] w-[70%] translate-y-10 object-cover transition-all duration-500 2xl:bottom-[40%]"
			/>
		</div>
	)
}

export default HeroDynamicScroll
