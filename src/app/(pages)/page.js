"use client"

import axios from "axios"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { dateString } from "@/lib/utils/dateString"
import { LuCalendar } from "react-icons/lu"
import Image from "next/image"
import Link from "next/link"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { CgDetailsLess } from "react-icons/cg"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setNavigationIds } from "@/lib/store/slices/navigationSlice"
import { FiArrowUpRight } from "react-icons/fi"

export default function Page() {
	const [loading, setLoading] = useState(true)
	const [categories, setCategories] = useState([])
	const [listings, setListings] = useState([])
	const [selectedCategory, setSelectedCategory] = useState()
	const dispatch = useAppDispatch()
	const navigationState = useAppSelector((state) => state.navigation)
	const [dynamicInfoText, setDynamicInfoText] = useState()

	const scrollIntoView = (id, options) => {
		let timerId
		const ivlId = setInterval(() => {
			const elem = document.getElementById(id)
			if (!elem) return
			elem?.scrollIntoView?.(options)
			clearInterval(ivlId)
			clearTimeout(timerId)
		})
		timerId = setTimeout(() => clearTimeout(ivlId), 1000)
	}

	const fetchListings = async (_id, isManualCall = true) => {
		try {
			setLoading(true)
			scrollIntoView(_id, {
				behavior: isManualCall ? "smooth" : "instant",
				block: "nearest",
				inline: "center",
			})

			const response = await axios.get(`/api/listing/sub_categories/${_id}`)
			setListings(response.data)

			if (isManualCall) setSelectedCategory(categories.find((i) => i._id === _id))
			else if (navigationState.subCategory) {
				for (const subCat of response.data) {
					if (![subCat._id, subCat.slug].includes(navigationState.subCategory)) continue
					if (subCat.slug === navigationState.subCategory)
						dispatch(setNavigationIds({ subCategory: subCat._id }))

					scrollIntoView(subCat._id, {
						behavior: "instant",
						block: "nearest",
						inline: "center",
					})
				}
			}
		} catch (error) {
			console.error(error)
		}
		setLoading(false)
	}

	useEffect(() => {
		axios
			.get(`/api/constants`)
			.then((response) => setDynamicInfoText(response?.data?.dynamicInfoText))
			.catch(console.error)
		;(async () => {
			try {
				let response = await axios.get(`/api/category?listings=true`)
				const _categories = response.data

				const catId = navigationState.category
					? _categories.find((i) => [i._id, i.slug].includes(navigationState.category))?._id ||
					  _categories[0]?._id
					: _categories[0]?._id

				if (catId !== navigationState.category) dispatch(setNavigationIds({ category: catId }))

				setSelectedCategory(_categories.find((i) => i._id === catId))
				setCategories(_categories)
				fetchListings(catId, false)

				if (navigationState.listing) {
					scrollIntoView(navigationState.listing, {
						behavior: "instant",
						block: "nearest",
						inline: "center",
					})

					dispatch(setNavigationIds({ listing: "" }))
				}
			} catch (error) {
				console.error(error.message)
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div>
			{dynamicInfoText && (
				<span className="py-1.5 bg-secondary border-y border-border block text-center opacity-60 text-sm">
					{dynamicInfoText}
				</span>
			)}
			<div className="px-hr mt-3 mb-4 no-scrollbar flex gap-2 items-center overflow-auto whitespace-nowrap">
				{categories?.length > 0 ? (
					categories.map((i) => (
						<button
							key={i._id}
							id={i._id}
							className={clsx(
								"rounded-full border border-secondary-border py-2 px-3 font-medium",
								selectedCategory && selectedCategory._id === i._id
									? "bg-primary text-secondary"
									: "bg-secondary"
							)}
							onClick={() => fetchListings(i._id)}
						>
							{i.title}
						</button>
					))
				) : (
					<>
						<span className="bg-secondary rounded-full py-2 px-3 text-base">
							<span className="block h-6 w-[4.5em]" />
						</span>
						<span className="bg-secondary rounded-full py-2 px-3 text-base">
							<span className="block h-6 w-[4.5em]" />
						</span>
						<span className="bg-secondary rounded-full py-2 px-3 text-base">
							<span className="block h-6 w-[4.5em]" />
						</span>
					</>
				)}
			</div>
			{listings?.length > 0 ? (
				listings
					?.filter((subCat) => subCat?.listings?.length > 0)
					?.map((subCat) => (
						<div key={subCat._id} id={subCat._id}>
							<span className="px-hr block mt-8 mb-6 font-bold text-xl">{subCat.title}</span>
							<div className="scroll-container flex gap-2 px-hr w-full">
								{subCat.listings.map((i) => (
									<Link
										key={i._id}
										id={i._id}
										href={`/${selectedCategory.slug}/${subCat.slug}/${i.slug}`}
										className="scroll-element"
									>
										<div className="listing-card bg-secondary text-secondary-foreground h-full flex flex-col rounded-xl overflow-hidden drop-shadow-xl shadow-black border border-border">
											<div className="border-[4px] border-transparent">
												<Image
													src={i.thumbnail}
													alt="thumbnail"
													className={"object-cover aspect-[4/5] rounded-[8.5px]"}
													width={400}
													height={400 * (1 + 1 / 5)}
												/>
											</div>
											<div className="pt-3 pb-3 px-3">
												<div className="line-clamp-2">
													<span>{i.title}</span>
												</div>
												<div className="mt-2 space-y-2 text-sm">
													{i?.date && (
														<div className="flex items-center gap-3">
															<LuCalendar size={20} className="shrink-0 opacity-50" />
															<span className="font-light block truncate">
																{dateString(i?.date, i?.time, true)}
															</span>
														</div>
													)}
													{i.location?.address && (
														<div className="flex items-center gap-3 truncate">
															<HiOutlineLocationMarker size={20} className="shrink-0 opacity-50" />
															<span className="font-light">{i.location.address}</span>
														</div>
													)}
													{!i?.date && i.about?.length ? (
														<div className="flex gap-3">
															<CgDetailsLess size={20} className="shrink-0 opacity-50" />
															<p className="font-light line-clamp-2">{i.about}</p>
														</div>
													) : null}
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					))
			) : (
				<div
					className={clsx(
						"transition-opacity ease-in-out duration-500",
						loading ? "opacity-100" : "opacity-0"
					)}
				>
					<div className="h-full">
						<span className="mt-8 mb-6 block w-3/5 h-[1.4rem] bg-secondary rounded-full mx-hr" />
						<div className="flex gap-2 px-hr overflow-auto w-full">
							<div className="listing-card aspect-[3/5] bg-secondary h-full flex flex-col shrink-0 text-secondary-foreground rounded-3xl overflow-hidden" />
							<div className="listing-card aspect-[3/5] bg-secondary h-full flex flex-col shrink-0 text-secondary-foreground rounded-3xl overflow-hidden" />
						</div>
					</div>
					<div className="h-full">
						<span className="mt-8 mb-6 block w-3/5 h-[1.4rem] bg-secondary rounded-full mx-hr" />
						<div className="flex gap-2 px-hr overflow-auto w-full">
							<div className="listing-card aspect-[3/5] bg-secondary h-full flex flex-col shrink-0 text-secondary-foreground rounded-3xl overflow-hidden" />
							<div className="listing-card aspect-[3/5] bg-secondary h-full flex flex-col shrink-0 text-secondary-foreground rounded-3xl overflow-hidden" />
						</div>
					</div>
				</div>
			)}

			{selectedCategory?.connectButton && (
				<Link
					href={selectedCategory.connectButton.url}
					className="my-8 flex gap-1 items-center justify-center underline opacity-60"
				>
					<span>{selectedCategory.connectButton.text}</span>
					<FiArrowUpRight className="size-4" />
				</Link>
			)}
		</div>
	)
}
