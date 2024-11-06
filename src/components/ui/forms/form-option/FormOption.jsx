import React, { useState, useRef, useEffect } from 'react'

export default function TabsSmPillLeadingIcon() {
	const [tabSelected, setTabSelected] = useState({
		currentTab: 1,
		noTabs: 3
	})

	const wrapperRef = useRef(null)

	const handleKeyDown = (e) => {
		if (e.keyCode === 39) {
			if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
				if (tabSelected.currentTab >= 1 && tabSelected.currentTab < tabSelected.noTabs) {
					setTabSelected({
						...tabSelected,
						currentTab: tabSelected.currentTab + 1
					})
				} else {
					setTabSelected({
						...tabSelected,
						currentTab: 1
					})
				}
			}
		}

		if (e.keyCode === 37) {
			if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
				if (tabSelected.currentTab > 1 && tabSelected.currentTab <= tabSelected.noTabs) {
					setTabSelected({
						...tabSelected,
						currentTab: tabSelected.currentTab - 1
					})
				} else {
					setTabSelected({
						...tabSelected,
						currentTab: tabSelected.noTabs
					})
				}
			}
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	})

	return (
		<>
			{/*<!-- Component: Pill sm sized tab with leading icon --> */}

			<p class="my-3 flex items-start text-xs">Выберите удобный способ связи:</p>
			<ul className="flex items-center gap-1" role="tablist" ref={wrapperRef}>
				<li className="" role="presentation">
					<button
						className={`inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded px-4 text-sm font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed ${
							tabSelected.currentTab === 1
								? 'bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-primary-500 disabled:bg-emerald-300'
								: 'w-full justify-self-center stroke-slate-700 text-slate-700 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 disabled:text-emerald-300'
						}`}
						id="tab-label-1fi"
						role="tab"
						aria-setsize="3"
						aria-posinset="1"
						tabindex={`${tabSelected.currentTab === 1 ? '0' : '-1'}`}
						aria-controls="tab-panel-1fi"
						aria-selected={`${tabSelected.currentTab === 1 ? 'true' : 'false'}`}
						onClick={() => setTabSelected({ ...tabSelected, currentTab: 1 })}
					>
						<span className="order-2 hidden sm:block">Телефон</span>
						<span className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="-mb-1 h-[28px] w-[28px]"
								fill="none"
								viewBox="0 0 30 30"
								stroke="currentColor"
								strokeWidth="1.5"
								aria-labelledby="title-77asp desc-77asp"
							>
								<title id="title-77asp">Icon title</title>
								<desc id="desc-77asp">A more detailed description of the icon</desc>
								<path
									d="M5.13641 12.764L8.15456 9.08664C8.46255 8.69065 8.61655 8.49264 8.69726 8.27058C8.76867 8.07409 8.79821 7.86484 8.784 7.65625C8.76793 7.42053 8.67477 7.18763 8.48846 6.72184L7.77776 4.9451C7.50204 4.25579 7.36417 3.91113 7.12635 3.68522C6.91678 3.48615 6.65417 3.35188 6.37009 3.29854C6.0477 3.238 5.68758 3.32804 4.96733 3.5081L3 4C3 14 9.99969 21 20 21L20.4916 19.0324C20.6717 18.3121 20.7617 17.952 20.7012 17.6296C20.6478 17.3456 20.5136 17.0829 20.3145 16.8734C20.0886 16.6355 19.7439 16.4977 19.0546 16.222L17.4691 15.5877C16.9377 15.3752 16.672 15.2689 16.4071 15.2608C16.1729 15.2536 15.9404 15.3013 15.728 15.4001C15.4877 15.512 15.2854 15.7143 14.8807 16.119L11.8274 19.1733M12.9997 7C13.9765 7.19057 14.8741 7.66826 15.5778 8.37194C16.2815 9.07561 16.7592 9.97326 16.9497 10.95M12.9997 3C15.029 3.22544 16.9213 4.13417 18.366 5.57701C19.8106 7.01984 20.7217 8.91101 20.9497 10.94"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
						</span>
					</button>
				</li>
				<li role="presentation">
					<button
						className={`inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded px-4 text-sm font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed ${
							tabSelected.currentTab === 2
								? 'bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-primary-500 disabled:bg-emerald-300'
								: 'w-full justify-self-center stroke-slate-700 text-slate-700 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 disabled:text-emerald-300'
						}`}
						id="tab-label-2fi"
						role="tab"
						aria-setsize="3"
						aria-posinset="2"
						tabindex={`${tabSelected.currentTab === 2 ? '0' : '-1'}`}
						aria-controls="tab-panel-2fi"
						aria-selected={`${tabSelected.currentTab === 2 ? 'true' : 'false'}`}
						onClick={() => setTabSelected({ ...tabSelected, currentTab: 2 })}
					>
						<span className="order-2 hidden sm:block">Whatsapp</span>
						<span className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="-mb-1 h-[28px] w-[28px]"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								viewBox="0 0 60 60"
							>
								<path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 C 17.028118 15 17.408214 15.004701 17.726562 15.019531 C 18.054056 15.035851 18.033687 15.037192 17.970703 15.007812 C 17.906713 14.977972 17.993533 14.968282 18.179688 15.410156 C 18.423098 15.98801 18.84317 16.999249 19.21875 17.900391 C 19.40654 18.350961 19.582292 18.773816 19.722656 19.105469 C 19.863021 19.437122 19.939077 19.622295 20.027344 19.798828 L 20.027344 19.800781 L 20.029297 19.802734 C 20.115837 19.973483 20.108185 19.864164 20.078125 19.923828 C 19.867096 20.342656 19.838461 20.445493 19.625 20.691406 C 19.29998 21.065838 18.968453 21.483404 18.792969 21.65625 C 18.639439 21.80707 18.36242 22.042032 18.189453 22.501953 C 18.016221 22.962578 18.097073 23.59457 18.375 24.066406 C 18.745032 24.6946 19.964406 26.679307 21.859375 28.347656 C 23.05276 29.399678 24.164563 30.095933 25.052734 30.564453 C 25.940906 31.032973 26.664301 31.306607 26.826172 31.386719 C 27.210549 31.576953 27.630655 31.72467 28.119141 31.666016 C 28.607627 31.607366 29.02878 31.310979 29.296875 31.007812 L 29.298828 31.005859 C 29.655629 30.601347 30.715848 29.390728 31.224609 28.644531 C 31.246169 28.652131 31.239109 28.646231 31.408203 28.707031 L 31.408203 28.708984 L 31.410156 28.708984 C 31.487356 28.736474 32.454286 29.169267 33.316406 29.580078 C 34.178526 29.990889 35.053561 30.417875 35.337891 30.558594 C 35.748225 30.761674 35.942113 30.893881 35.992188 30.894531 C 35.995572 30.982516 35.998992 31.07786 35.986328 31.222656 C 35.951258 31.624292 35.8439 32.180225 35.628906 32.775391 C 35.523582 33.066746 34.975018 33.667661 34.283203 34.105469 C 33.591388 34.543277 32.749338 34.852514 32.4375 34.898438 C 31.499896 35.036591 30.386672 35.087027 29.164062 34.703125 C 28.316336 34.437036 27.259305 34.092596 25.890625 33.509766 C 23.114812 32.325956 20.755591 30.311513 19.070312 28.537109 C 18.227674 27.649908 17.552562 26.824019 17.072266 26.199219 C 16.592866 25.575584 16.383528 25.251054 16.208984 25.021484 L 16.207031 25.019531 C 15.897202 24.609805 14 21.970851 14 19.59375 C 14 17.077989 15.168497 16.091436 15.800781 15.410156 C 16.132721 15.052495 16.495617 15 16.642578 15 z"></path>
							</svg>
						</span>
					</button>
				</li>
				<li className="" role="presentation">
					<button
						className={`inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded px-4 text-sm font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed ${
							tabSelected.currentTab === 3
								? 'bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-primary-500 disabled:bg-emerald-300'
								: 'w-full justify-self-center stroke-slate-700 text-slate-700 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 disabled:text-emerald-300'
						}`}
						id="tab-label-3fi"
						role="tab"
						aria-setsize="3"
						aria-posinset="3"
						tabindex={`${tabSelected.currentTab === 3 ? '0' : '-1'}`}
						aria-controls="tab-panel-3fi"
						aria-selected={`${tabSelected.currentTab === 3 ? 'true' : 'false'}`}
						onClick={() => setTabSelected({ ...tabSelected, currentTab: 3 })}
					>
						<span className="order-2 hidden sm:block">Telegram</span>
						<span className="relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mb-1 h-[28px] w-[28px]"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								viewBox="0 0 44 44"
							>
								<path d="M25,8c9.389,0,17,7.611,17,17s-7.611,17-17,17S8,34.389,8,25S15.611,8,25,8z M30.864,31.93	c0.312-0.959,1.778-10.521,1.958-12.405c0.055-0.571-0.126-0.95-0.478-1.119c-0.427-0.205-1.06-0.103-1.794,0.162	c-1.007,0.363-13.876,5.827-14.62,6.144c-0.704,0.3-1.372,0.626-1.372,1.1c0,0.333,0.198,0.52,0.742,0.714	c0.566,0.202,1.992,0.634,2.834,0.866c0.811,0.224,1.734,0.03,2.251-0.292c0.548-0.341,6.878-4.576,7.332-4.947	c0.454-0.371,0.816,0.104,0.445,0.476c-0.371,0.371-4.715,4.588-5.289,5.172c-0.696,0.709-0.202,1.443,0.265,1.738	c0.533,0.336,4.365,2.906,4.943,3.319c0.578,0.412,1.162,0.599,1.699,0.599C30.316,33.456,30.597,32.749,30.864,31.93z"></path>
							</svg>
						</span>
					</button>
				</li>
			</ul>
			<div className="">
				<div
					className={`pt-3 text-sm ${tabSelected.currentTab === 1 ? '' : 'hidden'}`}
					id="tab-panel-1fi"
					aria-hidden={`${tabSelected.currentTab === 1 ? 'true' : 'false'}`}
					role="tabpanel"
					aria-labelledby="tab-label-1fi"
					tabindex="-1"
				>
					<p>
						<div class="relative my-2 flex flex-col lg:flex-row">
							<input
								id="id-01"
								type="number"
								name="id-01"
								placeholder="+7 9999 99 99"
								class="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-emerald-500 placeholder-transparent caret-pink-500 outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-emerald-400"
							/>
							<label
								for="id-01"
								class="absolute -top-2 left-2 z-[1] cursor-text px-2 text-xs text-slate-400 caret-pink-500 transition-all before:absolute before:left-0 before:top-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\\\\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-emerald-400 peer-disabled:before:bg-transparent"
							>
								Телефон
							</label>
							<button class="mt-2 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded border border-emerald-500 px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:border-emerald-600 hover:text-emerald-600 focus:border-emerald-700 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300 disabled:shadow-none md:mt-0 lg:ml-2 lg:py-2">
								<span>Заказать консультацию</span>
							</button>
						</div>
					</p>
				</div>
				<div
					className={`pt-3 text-sm ${tabSelected.currentTab === 2 ? '' : 'hidden'}`}
					id="tab-panel-2fi"
					aria-hidden={`${tabSelected.currentTab === 2 ? 'true' : 'false'}`}
					role="tabpanel"
					aria-labelledby="tab-label-2fi"
					tabindex="-1"
				>
					<p>
						<div class="relative my-2 flex flex-col lg:flex-row">
							<input
								id="id-02"
								type="number"
								name="id-01"
								placeholder="+7 9999 99 99"
								class="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-emerald-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-emerald-400"
							/>
							<label
								for="id-03"
								class="absolute -top-2 left-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:left-0 before:top-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-emerald-400 peer-disabled:before:bg-transparent"
							>
								Wp:
							</label>
							<button class="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded border border-emerald-500 px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:border-emerald-600 hover:text-emerald-600 focus:border-emerald-700 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300 disabled:shadow-none lg:ml-2 lg:py-2">
								<span>Заказать консультацию</span>
							</button>
						</div>
					</p>
				</div>
				<div
					className={`pt-3 text-sm ${tabSelected.currentTab === 3 ? '' : 'hidden'}`}
					id="tab-panel-3fi"
					aria-hidden={`${tabSelected.currentTab === 3 ? 'true' : 'false'}`}
					role="tabpanel"
					aria-labelledby="tab-label-3fi"
					tabindex="-1"
				>
					<p>
						<div class="relative my-2 flex flex-col lg:flex-row">
							<input
								id="id-01"
								type="number"
								name="id-01"
								placeholder="+7 9999 99 99"
								class="peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-emerald-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-emerald-400"
							/>
							<label
								for="id-01"
								class="absolute -top-2 left-2 z-[1] cursor-text px-2 text-xs text-slate-400 transition-all before:absolute before:left-0 before:top-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-autofill:-top-2 peer-required:after:text-pink-500 peer-required:after:content-['\\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:cursor-default peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-emerald-400 peer-disabled:before:bg-transparent"
							>
								Tg:
							</label>
							<button class="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded border border-emerald-500 px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:border-emerald-600 hover:text-emerald-600 focus:border-emerald-700 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300 disabled:shadow-none lg:ml-2 lg:py-2">
								<span>Заказать консультацию</span>
							</button>
						</div>
					</p>
				</div>
			</div>
			{/*<!-- End Pill sm sized tab with leading icon --> */}
		</>
	)
}
