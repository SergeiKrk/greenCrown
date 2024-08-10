import React, { useEffect, useRef } from 'react'
import { Image } from 'astro:assets'
import Section from '../../ui/Section' // импортируйте ваш компонент Section
import Row from '../../ui/Row' // импортируйте ваш компонент Row
import Col from '../../ui/Col' // импортируйте ваш компонент Col
import ChipNotification from '../../ui/ChipNotification' // импортируйте ваш компонент ChipNotification
import Button from '../../ui/Button' // импортируйте ваш компонент Button
import AvatarGroup from '../../ui/AvatarGroup' // импортируйте ваш компонент AvatarGroup

import heroImage from '../../../assets/hero-01.png'
import user1 from '../../../assets/avatars/avatar-01.webp'
import user2 from '../../../assets/avatars/avatar-02.webp'
import user3 from '../../../assets/avatars/avatar-03.webp'

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

const HeroCTA = () => {
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
		<Section id="intro" padding="top" classes="bg-neutral-50 dark:bg-neutral-900" ref={introRef}>
			<Row>
				<Col span="7" align="center">
					<ChipNotification radius="rounded-full" classes="mb-6">
						<strong>300+</strong> довольных клиентов
						<AvatarGroup avatars={avatars} radius="rounded-full" slot="button" />
					</ChipNotification>
					<h1>
						Enhance team <strong>performance</strong> with seamless integration
					</h1>
					<p className="pb-0 text-lg">Work smarter, not harder, with our innovative platform</p>
					<Button size="lg" link="/">
						Get started for free
					</Button>
				</Col>
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
				</Col>
			</Row>
		</Section>
	)
}

export default HeroCTA
