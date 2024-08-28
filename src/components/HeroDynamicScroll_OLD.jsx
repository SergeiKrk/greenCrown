import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'astro:assets'

import heroImage from '../../../assets/hero-01.png'

const avatars = [
	{ image: { src: user1.src, alt: 'user name' }, link: '/' },
	{ image: { src: user2.src, alt: 'user name' }, link: '/' },
	{ image: { src: user3.src, alt: 'user name' }, link: '/' }
]

const debounce = (func, wait) => {
	let timeout
	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(this, args), wait)
	}
}

const HeroDynamicScroll = () => {
	const heroImageRef = useRef(null)
	const introRef = useRef(null)

	useEffect(() => {
		const handleScroll = debounce(() => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			if (heroImageRef.current) {
				heroImageRef.current.style.transform = `translateY(${scrollTop * 0.2}px)`
			}
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

		if (introRef.current) {
			observer.observe(introRef.current)
		}

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<Col span="5">
			<Image
				src={heroImage}
				alt="Foxi. The tailwind astro theme"
				className="shadow-2xl shadow-neutral-200 dark:shadow-neutral-950"
				format="webp"
				style={{
					transitionDuration: '0.7s',
					transitionProperty: 'all',
					transform: 'translateY(-55px)'
				}}
				ref={heroImageRef}
			/>
			<Image
				src={lugdoroga}
				alt="GreenCrown - Уход за зелеными насаждениями"
				class="absolute bottom-0 left-0 z-20 w-full object-cover"
				style="transition-duration: 0.7s;transition-property: all;transform: translateY(10);"
				id="hero-image"
			/>
		</Col>
	)
}

export default HeroDynamicScroll
