"use client"

import GoogleMapsIcon from "@/assets/svg/GoogleMapsIcon"
import InstagramIcon from "@/assets/svg/InstagramIcon"
import WhatsAppIcon from "@/assets/svg/WhatsAppIcon"
import ComboBox from "@/components/shared/ComboBox"
import Input from "@/components/shared/Input"
import axios from "axios"
import clsx from "clsx"
import { Field, Form, Formik } from "formik"
import { useEffect, useRef, useState } from "react"
import { HiLink } from "react-icons/hi"
import { LuCalendar } from "react-icons/lu"
import { FiArrowUpRight } from "react-icons/fi"
import { FaRegFileImage, FaRegImages } from "react-icons/fa6"
import slugify from "slugify"
import LabelWrapper from "@/components/shared/LabelWrapper"
import ImageCarousel from "@/components/shared/ImageCarousel"
import Sortable, { SortableItem } from "@/components/shared/Sortable"
import { AiOutlineDelete } from "react-icons/ai"
import { MdDragIndicator } from "react-icons/md"
import { getWindow } from "@/lib/utils/getWindow"
import { IoRefresh } from "react-icons/io5"
import { useParams, useRouter } from "next/navigation"
import imageCompression from "browser-image-compression"
import Spinner from "@/components/shared/Spinner"
import debounce from "lodash.debounce"
import { IoMdCheckmark } from "react-icons/io"
import { IoTrashOutline, IoAddOutline } from "react-icons/io5"
import RadioGroup from "@/components/shared/RadioGroup"
import { LISTING_TYPES } from "@/lib/utils/constants"
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti"
import { useAppSelector } from "@/lib/store/hooks"

const aspectRatioOptions = [
  { label: "1/1", value: 1 / 1, info: "Square" },
  { label: "4/5", value: 4 / 5, info: "Portrait" },
  { label: "16/9", value: 16 / 9, info: "Lanscape" },
]

const viewTabOptions = [
  { label: "Details", value: 0 },
  { label: "Images", value: 1 },
  { label: "Food", value: 2 },
]

const listingTypes = [
  { label: "Normal", value: LISTING_TYPES.NORMAL },
  { label: "Form", value: LISTING_TYPES.FORM },
  { label: "Food", value: LISTING_TYPES.FOOD },
]

const DIET_OPTIONS = [
  { label: "Veg", value: "veg" },
  { label: "Non-Veg", value: "non-veg" },
  { label: "Both", value: "both" },
]

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }

const INITIAL_VALUES = {
  type: listingTypes[0].value,
  title: "",
  slug: "",
  thumbnailFile: "",
  coverFiles: [],
  coverAspectRatio: aspectRatioOptions[0].label,
  food: {
    cuisines: [],
    dietType: "",
    priceRange: { min: "", max: "", avgCostForTwo: "" },
    openingHours: {},
    rating: "",
    isFeatured: false,
  },
}

export default function ListingForm() {
  const router = useRouter()
  const dateInputRef = useRef(null)
  const { listingSlug } = useParams()
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState({})
  const [viewState, setViewState] = useState(0)
  const [slugChecking, setSlugChecking] = useState(false)
  const [formState, setFormState] = useState(INITIAL_VALUES)
  const [imageURLs, setImageURLs] = useState({ thumbnail: "", covers: [], deletedCovers: [] })
  const [menuItems, setMenuItems] = useState([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [offers, setOffers] = useState([])
  const [offersLoading, setOffersLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const userState = useAppSelector((state) => state.user)
  const authHeader = { Authorization: `Bearer ${userState?.token}` }

  const isCreatingNew = listingSlug === "create"

  const fetchMenuAndOffers = async () => {
    if (isCreatingNew || !listingSlug) return
    try {
      const [menuResp, offersResp, reviewsResp] = await Promise.all([
        axios.get(`/api/menu/${listingSlug}`),
        axios.get(`/api/offer/${listingSlug}`),
        axios.get(`/api/review/admin/${listingSlug}`, { headers: authHeader }),
      ])
      setMenuItems(menuResp.data || [])
      setOffers(offersResp.data || [])
      setReviews(reviewsResp.data || [])
    } catch (_) {}
  }

  useEffect(() => {
    ;(async () => {
      try {
        const [categoryResp, subCategoryResp, listingResp] = await Promise.all([
          axios.get("/api/category"),
          axios.get("/api/sub_category"),
          !isCreatingNew && listingSlug ? axios.get(`/api/listing/${listingSlug}`) : null,
        ])

        setCategories(
          categoryResp.data.map((i) => ({
            value: i._id,
            label: i.title,
          }))
        )

        setSubCategories(subCategoryResp.data)

        if (listingResp?.data) {
          const listingJson = listingResp.data

          if (listingJson.date) {
            const date = new Date(listingJson.date)
            listingJson.date = new Intl.DateTimeFormat("en-CA").format(date)
          }

          if (listingJson.subCategory)
            listingJson.category = Object.keys(subCategoryResp.data).find((key) =>
              subCategoryResp.data[key].find((i) => i.value === listingJson.subCategory)
            )

          if (listingJson.thumbnail)
            setImageURLs((prev) => ({
              ...prev,
              thumbnail: listingJson.thumbnail,
            }))

          if (listingJson.covers)
            setImageURLs((prev) => ({
              ...prev,
              covers: listingJson.covers?.filter(Boolean).map((i) => ({
                url: i,
                name: i.split("/").at(-1),
                uploaded: true,
              })),
            }))

          setFormState(listingJson)
        }
      } catch (error) {
        console.error(error)
      }
    })()
    fetchMenuAndOffers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const compressImage = async (file) => {
    if (!file) throw new Error("No file selectd")

    const options = {
      maxWidthOrHeight: 600,
      useWebWorker: true,
    }

    const compressedFile = await imageCompression(file, options)
    return new File([compressedFile], file.name)
  }

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true)

    try {
      if (!values.subCategory) {
        setErrors({ subCategory: "Category & sub-category are required." })
        setSubmitting(false)
        return
      }

      const unUploadedCovers = Array.from(values.coverFiles?.filter((i) => !i.uploaded) || [])
      const payload = { ...values }

      payload.deletedCovers = imageURLs.deletedCovers.map((i) => i.url)
      payload.orderedCovers = imageURLs.covers.map((i) => i.name)
      payload.coverFiles = unUploadedCovers

      const json = {}
      const formData = new FormData()

      for (const key in payload) {
        if (payload[key] instanceof File) {
          const compressed = await compressImage(payload[key])
          formData.append(key, compressed)
        } else if (Array.isArray(payload[key]) && payload[key][0] instanceof File) {
          for (const value of payload[key]) formData.append(key, value)
        } else {
          json[key] = payload[key]
        }
      }

      formData.append("json", JSON.stringify(json))

      const response = await axios.post("/api/listing", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data?.slug) router.push(`/${response.data.slug}`)
    } catch (error) {
      console.error(error)
    }

    setSubmitting(false)
  }

  const validate = (values) => {
    const errors = {}

    if (!values.title) {
      errors.title = "Title is required"
    }

    if (!values.slug) {
      errors.slug = "Slug is required"
    }

    return errors
  }

  const checkSlug = debounce(async (slug, callback) => {
    if (!slug) return setSlugChecking(false)

    try {
      const response = await axios.get(`/api/listing/${slug}?checkSlug=true`)

      const isSlugAvailable =
        !response.data._id || (!isCreatingNew && response.data._id === formState._id)

      if (isSlugAvailable) callback({})
      else callback({ slug: "This slug is not available" })
    } catch (error) {
      console.error(error)
    }

    setSlugChecking(false)
  }, 1000)

  return (
    <div>
      <h1 className="px-hr block pt-4 mb-6 text-xl" id="form-details">
        {isCreatingNew ? "Create" : "Update"} Listing
      </h1>

      <Formik
        initialValues={formState}
        enableReinitialize={true}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors, setErrors }) => (
          <Form className={isSubmitting ? "pointer-events-none" : null}>
            <div className="px-hr flex flex-col gap-4">
              <Field
                name="type"
                label="Type"
                value={values.type}
                setValue={(val) => setFieldValue("type", val)}
                options={listingTypes}
                as={RadioGroup}
              />

              <Field
                type="text"
                name="title"
                label={"Title"}
                onChange={(e) => {
                  setFieldValue("title", e.target.value)
                  const slug = slugify(e.target.value)
                  setFieldValue("slug", slug)
                  checkSlug(slug)
                }}
                as={Input}
                required={true}
                error={errors.title}
              />

              <div>
                <Field
                  type="text"
                  name="slug"
                  label={"Slug"}
                  required={true}
                  suffix={{
                    element: (
                      <Spinner
                        className={clsx(
                          "!border-x-primary !border-t-primary border-b-transparent",
                          slugChecking ? "block" : "hidden"
                        )}
                      />
                    ),
                  }}
                  value={values.slug}
                  onChange={async (e) => {
                    const slug = e.target.value
                    setFieldValue(e.target.name, slug)
                    setSlugChecking(true)
                    checkSlug(slug, (_errors) => setErrors(_errors))
                  }}
                  error={errors.slug}
                  as={Input}
                />

                <small className={"block mt-1 opacity-50 whitespace-nowrap max-w-lg overflow-auto"}>
                  Your URL :{" "}
                  {getWindow()?.location?.origin +
                    "/" +
                    (values.slug ? encodeURIComponent(values.slug) : "{slug}")}
                </small>
              </div>

              {values.type === LISTING_TYPES.NORMAL ? (
                <>
                  <Field
                    type="date"
                    name="date"
                    label={"Date"}
                    ref={dateInputRef}
                    suffix={{
                      Icon: (props) => (
                        <button type="button" onClick={() => dateInputRef?.current?.showPicker?.()}>
                          <LuCalendar {...props} />
                        </button>
                      ),
                    }}
                    className="scheme-dark"
                    as={Input}
                  />

                  <div className="flex gap-2">
                    <Field
                      type="text"
                      name="time[from]"
                      label={"Start Time"}
                      labelClassName={"flex-1 min-w-0"}
                      className="scheme-dark"
                      placeholder={"e.g. 8:00 PM"}
                      as={Input}
                    />

                    <Field
                      type="text"
                      name="time[to]"
                      label={"End Time"}
                      labelClassName={"flex-1 min-w-0"}
                      className="scheme-dark"
                      placeholder={"e.g. 10:00 PM"}
                      as={Input}
                    />
                  </div>
                </>
              ) : (
                <Field type="text" name="googleFormUrl" label={"Google Form URL"} as={Input} />
              )}

              <Field
                name="category"
                label={"Select Category"}
                options={categories}
                value={categories.find((i) => i.value === values.category) || null}
                setValue={(val) => {
                  setFieldValue("category", val.value)
                  setFieldValue("subCategory", undefined)
                }}
                as={ComboBox}
                error={errors.category}
                required={true}
              />

              <Field
                name="subCategory"
                label={"Select Sub-Category"}
                options={subCategories[values.category] || []}
                value={
                  subCategories[values.category]?.find((i) => i.value === values.subCategory) ||
                  null
                }
                setValue={(val) => setFieldValue("subCategory", val.value)}
                as={ComboBox}
                error={errors.subCategory}
                required={true}
              />

              <Field name="about" label={"About"} as={Input} textArea={true} />

              {values.type === LISTING_TYPES.NORMAL && (
                <>
                  <h3 className="mt-4 text-lg">Location</h3>

                  <Field type="text" name="location[address]" label={"Address"} as={Input} />

                  <Field
                    type="text"
                    name="location[googleMapLink]"
                    label={"Google Maps URL"}
                    prefix={{
                      Icon: GoogleMapsIcon,
                    }}
                    as={Input}
                  />

                  <h3 className="mt-4 text-lg">Connect</h3>

                  <Field
                    name="actionLinks[mobileNumber]"
                    label={"Mobile Number (Call)"}
                    prefix={"+91"}
                    maxLength={10}
                    value={values?.actionLinks?.mobileNumber}
                    onChange={(e) =>
                      !e.target.value || +e.target.value
                        ? setFieldValue(e.target.name, e.target.value)
                        : null
                    }
                    as={Input}
                  />

                  <Field
                    type="text"
                    name="actionLinks[whatsapp]"
                    prefix={{
                      Icon: WhatsAppIcon,
                    }}
                    label={"WhatsApp Contact URL"}
                    as={Input}
                  />

                  <Field
                    type="text"
                    name="actionLinks[instagram]"
                    prefix={{
                      Icon: InstagramIcon,
                    }}
                    label={"Instagram Page URL"}
                    as={Input}
                  />

                  <h3 className="mt-4 text-lg">Custom Action Link</h3>

                  <Field
                    type="text"
                    name="customActionLink[label]"
                    label={"Label Text"}
                    as={Input}
                  />

                  <Field
                    type="text"
                    name="customActionLink[url]"
                    prefix={{
                      Icon: HiLink,
                    }}
                    label={"URL"}
                    as={Input}
                  />

                  <h3 className="pt-4 text-lg" id="form-images">
                    Sharing Scheme
                  </h3>

                  <button
                    tabIndex={1}
                    type="button"
                    onClick={() => {
                      setFieldValue("joinShareScheme", !values.joinShareScheme)
                      setFieldValue("targetSharingCount", "")
                    }}
                  >
                    <Field
                      type="checkbox"
                      name="joinShareScheme"
                      displayValue={"Join Sharing Scheme"}
                      prefix={{
                        element: (
                          <IoMdCheckmark
                            tabIndex={0}
                            className={clsx(
                              "rounded-sm p-[1px] size-6 flex items-center justify-center -ml-1.5",
                              !values.joinShareScheme
                                ? "text-primary/0 bg-gray-400"
                                : "bg-green-500"
                            )}
                          />
                        ),
                      }}
                      checked={Boolean(values.joinShareScheme)}
                      hidden={true}
                      as={Input}
                    />
                  </button>

                  <div>
                    <Field
                      type="number"
                      name="targetSharingCount"
                      label={"Target sharing count"}
                      as={Input}
                      placeholder={"e.g. 5"}
                      disabled={!values.joinShareScheme}
                    />

                    <small className="block mt-1 opacity-60">
                      Target sharing count is the number of times users have to share your page to
                      unlock rewards.
                    </small>
                  </div>
                </>
              )}

              {values.type === LISTING_TYPES.FOOD && (
                <div id="form-food" className="flex flex-col gap-4 pt-2">
                  <h3 className="text-lg">Restaurant Info</h3>

                  <button
                    tabIndex={1}
                    type="button"
                    onClick={() => setFieldValue("food.isFeatured", !values.food?.isFeatured)}
                  >
                    <Input
                      displayValue="Featured Listing"
                      prefix={{
                        element: (
                          <IoMdCheckmark
                            className={clsx(
                              "rounded-sm p-[1px] size-6 flex items-center justify-center -ml-1.5",
                              !values.food?.isFeatured ? "text-primary/0 bg-gray-400" : "bg-yellow-500"
                            )}
                          />
                        ),
                      }}
                      hidden={true}
                    />
                  </button>

                  <Field
                    name="food.dietType"
                    label="Diet Type"
                    value={values.food?.dietType}
                    setValue={(val) => setFieldValue("food.dietType", val)}
                    options={DIET_OPTIONS}
                    as={RadioGroup}
                  />

                  <div>
                    <label className="text-sm opacity-60 block mb-1">Cuisines</label>
                    <CuisineTagInput
                      tags={values.food?.cuisines || []}
                      onChange={(tags) => setFieldValue("food.cuisines", tags)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Field type="number" name="food.priceRange.min" label="Min price (₹)" as={Input} labelClassName="flex-1" />
                    <Field type="number" name="food.priceRange.max" label="Max price (₹)" as={Input} labelClassName="flex-1" />
                  </div>
                  <Field type="number" name="food.priceRange.avgCostForTwo" label="Avg cost for 2 (₹)" as={Input} />
                  <Field type="number" name="food.rating" label="Admin rating (0–5)" as={Input} placeholder="e.g. 4.2" />

                  <h3 className="mt-2 text-lg">Opening Hours</h3>
                  {DAYS.map((day) => (
                    <div key={day} className="flex gap-2 items-center">
                      <span className="w-8 text-sm opacity-60 shrink-0">{DAY_LABELS[day]}</span>
                      <Field type="text" name={`food.openingHours.${day}.open`} placeholder="9:00 AM" as={Input} labelClassName="flex-1 min-w-0" />
                      <span className="text-sm opacity-40">–</span>
                      <Field type="text" name={`food.openingHours.${day}.close`} placeholder="10:00 PM" as={Input} labelClassName="flex-1 min-w-0" />
                    </div>
                  ))}

                  <h3 className="mt-2 text-lg">Menu Items</h3>
                  <MenuEditor
                    items={menuItems}
                    setItems={setMenuItems}
                    listingSlug={listingSlug}
                    loading={menuLoading}
                    setLoading={setMenuLoading}
                    authHeader={authHeader}
                    isCreatingNew={isCreatingNew}
                  />

                  <h3 className="mt-2 text-lg">Offers</h3>
                  <OffersEditor
                    offers={offers}
                    setOffers={setOffers}
                    listingSlug={listingSlug}
                    loading={offersLoading}
                    setLoading={setOffersLoading}
                    authHeader={authHeader}
                    isCreatingNew={isCreatingNew}
                  />

                  {reviews.length > 0 && (
                    <>
                      <h3 className="mt-2 text-lg">Review Moderation</h3>
                      <ReviewModerator
                        reviews={reviews}
                        setReviews={setReviews}
                        authHeader={authHeader}
                      />
                    </>
                  )}
                </div>
              )}

              <h3 className="pt-4 text-lg" id="form-images">
                Images
              </h3>

              <div>
                <Field
                  type="file"
                  name="thumbnailFile"
                  prefix={{ Icon: FaRegFileImage }}
                  label={"Thumbnail"}
                  accept="image/*"
                  required={isCreatingNew}
                  onChange={(e) => {
                    e.preventDefault()
                    const file = e.target.files?.[0]
                    if (!file) return

                    setFieldValue(e.target.name, file)
                    setImageURLs((prev) => ({ ...prev, thumbnail: URL.createObjectURL(file) }))
                  }}
                  as={Input}
                />

                <small className="block mt-2 opacity-60">
                  Upload a portrait image (4:5 ratio) for best display.
                </small>

                {imageURLs.thumbnail && (
                  <img
                    src={imageURLs.thumbnail}
                    alt="Thumbnail preview"
                    className="mt-4 mx-auto rounded-lg border border-border bg-black block w-auto aspect-[4/5] object-cover overflow-hidden"
                  />
                )}
              </div>

              {values.type === LISTING_TYPES.NORMAL && (
                <div className="flex flex-col gap-4">
                  <Field
                    type="file"
                    name="coverFiles"
                    prefix={{ Icon: FaRegImages }}
                    label={"Covers"}
                    accept="image/*"
                    multiple={true}
                    onChange={(e) => {
                      const filesArray = Array.from(e.target.files)
                      const fileUrls = filesArray.map((file) => ({
                        url: URL.createObjectURL(file),
                        name: file.name,
                      }))

                      setFieldValue(e.target.name, (values.coverFiles || []).concat(filesArray))

                      setImageURLs((prev) => ({
                        ...prev,
                        covers: (prev.covers || []).concat(fileUrls),
                      }))
                    }}
                    as={Input}
                  />

                  <div>
                    {imageURLs.covers?.[0] && (
                      <div className="mb-4">
                        <span className="block mb-1.5 opacity-50 text-sm">Reorder covers</span>

                        <div className="mt-2">
                          <Sortable
                            getId={(i) => i.name}
                            items={imageURLs.covers}
                            setItems={(func) =>
                              setImageURLs((prev) => ({
                                ...prev,
                                covers: func(prev.covers),
                              }))
                            }
                          >
                            {imageURLs.covers?.map((i) => (
                              <SortableItem key={i.name} id={i.name}>
                                {(props) => (
                                  <CoverImageItem
                                    {...i}
                                    {...props}
                                    handler={() =>
                                      setImageURLs((prev) => ({
                                        ...prev,
                                        covers: prev.covers.filter((_i) => _i.name !== i.name),
                                        deletedCovers: i.uploaded
                                          ? prev.deletedCovers.concat([i])
                                          : prev.deletedCovers,
                                      }))
                                    }
                                  />
                                )}
                              </SortableItem>
                            ))}
                          </Sortable>
                        </div>
                      </div>
                    )}

                    {imageURLs.deletedCovers?.[0] && (
                      <>
                        <hr />

                        <div className="mt-4">
                          <span className="block mb-1.5 opacity-50 text-sm">Deleted covers</span>

                          <div className="mt-2">
                            {imageURLs.deletedCovers?.map((i) => (
                              <CoverImageItem
                                {...i}
                                key={i.name}
                                isDeleted={true}
                                handler={() =>
                                  setImageURLs((prev) => ({
                                    ...prev,
                                    covers: prev.covers.concat([i]),
                                    deletedCovers: prev.deletedCovers.filter(
                                      (_i) => _i.name !== i.name
                                    ),
                                  }))
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <LabelWrapper label={"Cover aspect ratio"}>
                    <div className="flex items-center border border-border rounded-lg p-1.5">
                      {aspectRatioOptions.map((i) => (
                        <label
                          key={i.label}
                          className={clsx(
                            "flex-1 flex flex-col items-center cursor-pointer rounded-lg p-1",
                            values.coverAspectRatio === i.label ? "bg-primary text-accent" : ""
                          )}
                        >
                          <Field
                            type="radio"
                            name="coverAspectRatio"
                            value={i.label}
                            hidden={true}
                          />

                          <span className="block text-lg font-semibold">{i.label}</span>

                          <span className="text-sm">{i.info}</span>
                        </label>
                      ))}
                    </div>
                  </LabelWrapper>

                  {imageURLs.covers?.[0] && (
                    <div className="aspect-[4/5.5] w-full z-[0]">
                      <ImageCarousel
                        imageUrls={imageURLs.covers?.map((i) => i.url)}
                        aspectRatio={values.coverAspectRatio}
                      />

                      <hr />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center justify-between bg-secondary px-hr py-6 mt-6">
              <RadioGroup
                isSmall
                isRounded
                value={viewState}
                setValue={(val) => {
                  setViewState(val)
                  const ids = { 0: "form-details", 1: "form-images", 2: "form-food" }
                  document.getElementById(ids[val])?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                options={values.type === LISTING_TYPES.FOOD ? viewTabOptions : viewTabOptions.slice(0, 2)}
              />

              <button
                type="submit"
                className="bg-primary flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-background"
              >
                <span>Submit</span>

                {isSubmitting ? <Spinner /> : <FiArrowUpRight size={18} />}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

function CuisineTagInput({ tags, onChange }) {
  const [input, setInput] = useState("")
  const add = () => {
    const val = input.trim()
    if (val && !tags.includes(val)) onChange([...tags, val])
    setInput("")
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-secondary border border-secondary-border rounded-full px-2.5 py-1 text-sm">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="opacity-50 hover:opacity-100 ml-0.5">✕</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add() } }}
          placeholder="Type and press Enter"
          className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-sm outline-none"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-primary text-background rounded-xl text-sm">Add</button>
      </div>
    </div>
  )
}

const BLANK_MENU_ITEM = { name: "", price: "", category: "", dietType: "veg", description: "" }
const BLANK_OFFER = { title: "", discount: "", description: "", validFrom: "", validTo: "" }

function MenuEditor({ items, setItems, listingSlug, loading, setLoading, authHeader, isCreatingNew }) {
  const [draft, setDraft] = useState(BLANK_MENU_ITEM)
  const [showForm, setShowForm] = useState(false)

  const saveItem = async () => {
    if (!draft.name || !draft.price) return toast.error("Name and price are required")
    if (isCreatingNew) return toast.error("Save the listing first before adding menu items")
    setLoading(true)
    try {
      const { data } = await axios.post(`/api/menu/${listingSlug}`, draft, { headers: authHeader })
      setItems((prev) => draft._id ? prev.map((i) => i._id === draft._id ? data : i) : [...prev, data])
      setDraft(BLANK_MENU_ITEM)
      setShowForm(false)
      toast.success("Menu item saved")
    } catch (err) { toast.error("Failed to save item") }
    setLoading(false)
  }

  const deleteItem = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`/api/menu/${listingSlug}?itemId=${id}`, { headers: authHeader })
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (err) { toast.error("Failed to delete item") }
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item._id} className="flex items-center gap-2 bg-secondary border border-secondary-border rounded-xl px-3 py-2.5 text-sm">
          <span className={clsx("size-2.5 rounded-sm shrink-0", item.dietType === "veg" ? "bg-green-500" : "bg-red-500")} />
          <span className="flex-1 font-medium">{item.name}</span>
          <span className="opacity-60">{item.category}</span>
          <span className="font-semibold">₹{item.price}</span>
          <button type="button" onClick={() => { setDraft({ ...item }); setShowForm(true) }}><IoMdCheckmark className="size-5 opacity-40" /></button>
          <button type="button" onClick={() => deleteItem(item._id)}><IoTrashOutline className="size-5 text-red-400" /></button>
        </div>
      ))}
      {showForm ? (
        <div className="bg-background border border-border rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <Input label="Name" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} labelClassName="flex-1" />
            <Input label="Price ₹" type="number" value={draft.price} onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))} labelClassName="w-24" />
          </div>
          <div className="flex gap-2">
            <Input label="Category" value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Starters" labelClassName="flex-1" />
            <RadioGroup isSmall value={draft.dietType} setValue={(v) => setDraft((p) => ({ ...p, dietType: v }))} options={[{ label: "Veg", value: "veg" }, { label: "Non-Veg", value: "non-veg" }]} />
          </div>
          <Input label="Description (optional)" value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
          <div className="flex gap-2">
            <button type="button" onClick={saveItem} disabled={loading} className="flex-1 bg-primary text-background py-2 rounded-xl text-sm">
              {loading ? "Saving..." : "Save Item"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setDraft(BLANK_MENU_ITEM) }} className="px-4 py-2 bg-secondary rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowForm(true)} className="w-full flex items-center gap-2 justify-center py-2.5 border border-dashed border-secondary-border rounded-xl text-sm opacity-60">
          <IoAddOutline size={18} /> Add Menu Item
        </button>
      )}
    </div>
  )
}

function OffersEditor({ offers, setOffers, listingSlug, loading, setLoading, authHeader, isCreatingNew }) {
  const [draft, setDraft] = useState(BLANK_OFFER)
  const [showForm, setShowForm] = useState(false)

  const saveOffer = async () => {
    if (!draft.title) return toast.error("Title is required")
    if (isCreatingNew) return toast.error("Save the listing first before adding offers")
    setLoading(true)
    try {
      const { data } = await axios.post(`/api/offer/${listingSlug}`, draft, { headers: authHeader })
      setOffers((prev) => draft._id ? prev.map((i) => i._id === draft._id ? data : i) : [...prev, data])
      setDraft(BLANK_OFFER)
      setShowForm(false)
      toast.success("Offer saved")
    } catch (err) { toast.error("Failed to save offer") }
    setLoading(false)
  }

  const deleteOffer = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`/api/offer/${listingSlug}?offerId=${id}`, { headers: authHeader })
      setOffers((prev) => prev.filter((i) => i._id !== id))
    } catch (err) { toast.error("Failed to delete offer") }
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      {offers.map((offer) => (
        <div key={offer._id} className="flex items-start gap-2 bg-secondary border border-secondary-border rounded-xl px-3 py-2.5 text-sm">
          <div className="flex-1 min-w-0">
            <span className="font-medium block">{offer.title}</span>
            {offer.discount && <span className="text-yellow-400 text-xs">{offer.discount}</span>}
          </div>
          <button type="button" onClick={() => deleteOffer(offer._id)}><IoTrashOutline className="size-5 text-red-400" /></button>
        </div>
      ))}
      {showForm ? (
        <div className="bg-background border border-border rounded-xl p-3 space-y-2">
          <Input label="Title" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
          <Input label="Discount (e.g. 20% off)" value={draft.discount} onChange={(e) => setDraft((p) => ({ ...p, discount: e.target.value }))} />
          <Input label="Description" value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
          <div className="flex gap-2">
            <Input label="Valid From" type="date" value={draft.validFrom} onChange={(e) => setDraft((p) => ({ ...p, validFrom: e.target.value }))} labelClassName="flex-1" />
            <Input label="Valid To" type="date" value={draft.validTo} onChange={(e) => setDraft((p) => ({ ...p, validTo: e.target.value }))} labelClassName="flex-1" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={saveOffer} disabled={loading} className="flex-1 bg-primary text-background py-2 rounded-xl text-sm">{loading ? "Saving..." : "Save Offer"}</button>
            <button type="button" onClick={() => { setShowForm(false); setDraft(BLANK_OFFER) }} className="px-4 py-2 bg-secondary rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowForm(true)} className="w-full flex items-center gap-2 justify-center py-2.5 border border-dashed border-secondary-border rounded-xl text-sm opacity-60">
          <IoAddOutline size={18} /> Add Offer
        </button>
      )}
    </div>
  )
}

function ReviewModerator({ reviews, setReviews, authHeader }) {
  const updateStatus = async (reviewId, status) => {
    try {
      const { data } = await axios.patch(`/api/review/admin/${reviewId}`, { status }, { headers: authHeader })
      setReviews((prev) => prev.map((r) => r._id === reviewId ? data.review : r))
      toast.success(`Review ${status}`)
    } catch (err) { toast.error("Failed to update review") }
  }

  const statusColor = { pending: "text-yellow-400", approved: "text-green-400", hidden: "opacity-40 line-through" }

  return (
    <div className="space-y-2">
      {reviews.map((r) => (
        <div key={r._id} className={clsx("bg-secondary border border-secondary-border rounded-xl p-3 text-sm space-y-1", r.status === "hidden" && "opacity-50")}>
          <div className="flex items-center justify-between">
            <span className="font-medium">{r.userName || "Anonymous"}</span>
            <span className={clsx("text-xs font-semibold", statusColor[r.status])}>{r.status}</span>
          </div>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((n) => n <= r.rating ? <TiStarFullOutline key={n} size={14} className="text-yellow-400" /> : <TiStarOutline key={n} size={14} className="opacity-30" />)}
          </div>
          {r.comment && <p className="opacity-70">{r.comment}</p>}
          <div className="flex gap-2 pt-1">
            {r.status !== "approved" && (
              <button type="button" onClick={() => updateStatus(r._id, "approved")} className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-1 rounded-lg">Approve</button>
            )}
            {r.status !== "hidden" && (
              <button type="button" onClick={() => updateStatus(r._id, "hidden")} className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-1 rounded-lg">Hide</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const CoverImageItem = ({ url, name, uploaded, isDeleted, handler, ...props }) => {
  return (
    <div className="flex bg-background justify-between items-center gap-2 border border-border rounded-lg pl-2 pr-4 py-2 mb-2">
      <div className="flex items-center gap-3 touch-none" {...props}>
        <MdDragIndicator className="shrink-0" />

        <img src={url} alt="img" className="size-14 shrink-0 rounded-sm object-cover" />

        <span className={clsx("line-clamp-2 text-sm", isDeleted ? "line-through" : "")}>
          {name}
        </span>
      </div>

      <button type="button" onClick={handler}>
        {isDeleted ? (
          <IoRefresh className="text-white size-6" />
        ) : (
          <AiOutlineDelete className="text-red-500 size-6" />
        )}
      </button>
    </div>
  )
}
