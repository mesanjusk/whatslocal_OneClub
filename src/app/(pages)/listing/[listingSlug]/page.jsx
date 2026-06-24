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
import RadioGroup from "@/components/shared/RadioGroup"
import { LISTING_TYPES } from "@/lib/utils/constants"

const aspectRatioOptions = [
  { label: "1/1", value: 1 / 1, info: "Square" },
  { label: "4/5", value: 4 / 5, info: "Portrait" },
  { label: "16/9", value: 16 / 9, info: "Lanscape" },
]

const viewTabOptions = [
  { label: "Details", value: 0 },
  { label: "Images", value: 1 },
]

const listingTypes = [
  { label: "Normal", value: LISTING_TYPES.NORMAL },
  { label: "Form", value: LISTING_TYPES.FORM },
]

const INITIAL_VALUES = {
  type: listingTypes[0].value,
  title: "",
  slug: "",
  thumbnailFile: "",
  coverFiles: [],
  coverAspectRatio: aspectRatioOptions[0].label,
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
  const [imageURLs, setImageURLs] = useState({
    thumbnail: "",
    covers: [],
    deletedCovers: [],
  })

  const isCreatingNew = listingSlug === "create"

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
                  document
                    .getElementById(val === 0 ? "form-details" : "form-images")
                    .scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                }}
                options={viewTabOptions}
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
