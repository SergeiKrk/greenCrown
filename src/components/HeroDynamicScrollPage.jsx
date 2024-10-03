import React, { useEffect, useRef, useState } from 'react'

const HeroDynamicScrollPage = ({ heroImg, heroAlt }) => {
	const [scrollPosition, setScrollPosition] = useState(0)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const heroImgRef = useRef(null)
	const sectionBgRef = useRef(null) // Добавляем sectionBgRef
	const obrabotchikiRef = useRef(null) // Добавляем obrabotchikiRef для движения изображения

	// Обработчик прокрутки
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			setScrollPosition(scrollTop)
		}

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

	// Обновление позиции изображений на основе прокрутки
	useEffect(() => {
		const scaleValuePlusMini = 1 + scrollPosition * 0.0002
		if (heroImgRef.current) {
			heroImgRef.current.style.transform = `translateY(${scrollPosition * 0.3}px) scale(${scaleValuePlusMini})`
		}
	}, [scrollPosition])

	// Обработчик движения мыши
	useEffect(() => {
		const handleMouseMove = (event) => {
			const rect = sectionBgRef.current.getBoundingClientRect()
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			setMousePosition({ x, y })
		}

		const sectionBg = sectionBgRef.current
		if (sectionBg) {
			sectionBg.addEventListener('mousemove', handleMouseMove)
		}

		return () => {
			if (sectionBg) {
				sectionBg.removeEventListener('mousemove', handleMouseMove)
			}
		}
	}, [])

	// Обновление положения картинки на основе движения мыши и прокрутки
	useEffect(() => {
		if (obrabotchikiRef.current) {
			const offsetX = (mousePosition.x - window.innerWidth / 2) * 0.07
			const offsetY = (mousePosition.y - window.innerHeight / 2) * 0.05
			obrabotchikiRef.current.style.transform = `translate(${offsetX}px, ${scrollPosition * 0.42 + offsetY}px)`
		}
	}, [mousePosition, scrollPosition])

	return (
		<div ref={sectionBgRef} className="basis-64 2xl:basis-1/4">
			<img
				ref={heroImgRef}
				src={heroImg.src}
				alt={heroAlt}
				width={370}
				className="top-0"
				transition-name={heroAlt}
			/>
		</div>
	)
}

export default HeroDynamicScrollPage
