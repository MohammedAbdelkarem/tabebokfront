// ** React Imports
import { useCallback, useEffect, useMemo, useState } from "react"
import Select from 'react-select'
// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs"

// ** Reactstrap Imports
import {
  Row, Col, Card, CardBody, Form, Label, Input, Button,
  CardHeader, CardTitle, Spinner, InputGroup, InputGroupText
} from "reactstrap"

// ** Styles
import "@styles/react/libs/editor/editor.scss"
import "@styles/base/plugins/forms/form-quill-editor.scss"
import "@styles/react/libs/react-select/_react-select.scss"
import "@styles/base/pages/page-blog.scss"
import Flatpickr from "react-flatpickr"
import "@styles/react/libs/flatpickr/flatpickr.scss"

// ** i18n & Helpers
import { useTranslation } from "react-i18next"
import SuccessAlert from "../../components/handleStatusCode/success"
import ErrorAlert from "../../components/handleStatusCode/error"
import { useLocation, useNavigate } from "react-router-dom"

// ** API
import { useRegisterMutation } from "../../../redux/rtkQuery/clinic"
import { useListMutation } from "../../../redux/rtkQuery/plan"
import { useCitiesQuery } from "../../../redux/rtkQuery/admin"

// ** Google map imports
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api"

import { useGetQuery as useCategoriesQuery } from "../../../redux/rtkQuery/content/category"
import { useGetMutation as useSubcatsMutation } from "../../../redux/rtkQuery/content/subCategory"
const ClinicForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const state = useLocation()?.state
  const containerStyle = {
    width: "100%",
    height: "250px"
  }
  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    // googleMapsApiKey: 'AIzaSyB-Cdn95koLl_dU9WZJywUcSV3xTZcvhe0'
    libraries: ["places"]
  })

  const [errors, setErrors] = useState({})
  const [subcatOptions, setSubcatOptions] = useState([])

  const [store, { isLoading: storing, error: storeError }] = useRegisterMutation()
  const [fetchPlans, { data: plansResp, isLoading: loadingPlans, error: plansError }] = useListMutation()

  useEffect(() => {
    fetchPlans({})
  }, [])

  const { data: citiesResp, isLoading: loadingCities, error: citiesError } = useCitiesQuery({ page: 1 })

  const dayOptions = useMemo(() => [
    { value: "1", label: t("Sunday") },
    { value: "2", label: t("Monday") },
    { value: "3", label: t("Tuesday") },
    { value: "4", label: t("Wednesday") },
    { value: "5", label: t("Thursday") },
    { value: "6", label: t("Friday") },
    { value: "7", label: t("Saturday") }
  ], [t])

  const defaultShift = useCallback(() => ({
    day_id: dayOptions[0]?.value || "1",
    start_time: "09:00",
    end_time: "12:00"
  }), [dayOptions])

  const planOptions = useMemo(
    () => (plansResp?.data || []).map(p => ({ value: String(p.id), label: p.title })),
    [plansResp]
  )

  const cityOptions = useMemo(
    () => (citiesResp?.data || []).map(c => ({ value: String(c.id), label: c.name })),
    [citiesResp]
  )
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const { data: categoriesResp, isLoading: loadingCats, error: catsError } = useCategoriesQuery()
  const [fetchSubcats, { isLoading: loadingSubcats, error: subcatsError }] = useSubcatsMutation()

  const categoryOptions = useMemo(
    () => (categoriesResp?.data || []).map(c => ({ value: String(c.id), label: c.name })),
    [categoriesResp]
  )

  useEffect(() => {
    if (!selectedCategoryIds.length) return
    fetchSubcats({ id: selectedCategoryIds.join("&category_ids[]=") })
      .unwrap()
      .then(r => setSubcatOptions((r?.data || []).map(sc => ({ value: String(sc.id), label: sc.name }))))
      .catch(() => setSubcatOptions([]))
    }, [selectedCategoryIds, fetchSubcats])

  const [formData, setFormData] = useState({
    full_name: "",
    name: "",
    doctor: "",
    pergl: "",
    phone_number: "+963",
    avatar: null,
    birth_date: "",
    email: "",
    is_male: "1",
    clinic_name: "",
    address_text: "",
    lat: "33.518583",
    lng: "36.279089",
    license_number: "",
    is_center: "1",
    bio: "",
    join_reason: "",
    logo: null,
    cover_image: null,

    certificates: [{ image: null, title: "" }],
    phone_numbers: [""],
    sub_category_ids: [],
    shift_times: [],
    plan_id: '',
    has_been_paid: "1",
    city_id: ""
  })

  const [mapCenter, setMapCenter] = useState({
    lat: Number(formData.lat) || 0,
    lng: Number(formData.lng) || 0
  })
  const [autocompleteInstance, setAutocompleteInstance] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const [locating, setLocating] = useState(false)

  const validateField = (name, value) => {
    if (["name", "clinic_name", "address_text"].includes(name)) {
      if (!value?.trim()) return t("This field is required")
    }
    if (name === "email") {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("Invalid email")
    }
    if (name === "phone_number") {
      if (!/^\+?\d{6,20}$/.test(value || "")) return t("Invalid phone number")
    }
    if (name === "lat" || name === "lng") {
      if (value === "" || isNaN(Number(value))) return t("Must be a valid number")
    }
    if (name === "birth_date") {
      if (!value) return t("This field is required")
      const d = new Date(value)
      if (isNaN(+d)) return t("Invalid date")
      if (d > new Date()) return t("Birth date cannot be in the future")
    }
    if (name === "is_male" || name === "is_center" || name === "has_been_paid") {
      if (!["0", "1"].includes(String(value))) return t("Invalid value")
    }
    if (name === "city_id" || name === "plan_id") {
      if (!String(value)?.trim()) return t("This field is required")
    }
    return ""
  }

  const validateShiftTime = (st) => {
    const dayId = String(st?.day_id || "")
    if (!dayId) return t("Day is required")
    if (!dayOptions.some(d => d.value === dayId)) return t("Day is required")
    if (!/^\d{1,2}:\d{2}$/.test(st?.start_time || "")) return t("Invalid start time")
    if (!/^\d{1,2}:\d{2}$/.test(st?.end_time || "")) return t("Invalid end time")
    if ((st?.start_time || "") >= (st?.end_time || "")) return t("End time must be after start time")
    return ""
  }

  const toArray = (value, fallback = []) => {
    if (Array.isArray(value)) return value
    if (value === null || value === undefined) return fallback
    return [value]
  }

  const runValidation = () => {
    const newErr = Object.create(null)
    const requiredFields = [
      "name", "clinic_name", "address_text", "email",
      "phone_number", "lat", "lng", "birth_date",
      "is_male", "is_center", "has_been_paid", "plan_id", "city_id"
    ]

    requiredFields.forEach((k) => {
      const e = validateField(k, formData[k])
      if (e) newErr[k] = e
    })

    const phoneNumbersRaw = formData?.phone_numbers
    let phoneNumbers = []
    if (Array.isArray(phoneNumbersRaw)) phoneNumbers = phoneNumbersRaw
    else if (phoneNumbersRaw) phoneNumbers = [phoneNumbersRaw]

    if (!phoneNumbers.length) {
      newErr["phone_numbers.0"] = t("Required")
    } else {
      phoneNumbers.forEach((p, idx) => {
        if (!p?.trim()) newErr[`phone_numbers.${idx}`] = t("Required")
        else if (!/^\+?\d{6,20}$/.test(p)) newErr[`phone_numbers.${idx}`] = t("Invalid phone number")
      })
    }

    const subCategoryIdsRaw = formData?.sub_category_ids
    let subCategoryIds = []
    if (Array.isArray(subCategoryIdsRaw)) subCategoryIds = subCategoryIdsRaw
    else if (subCategoryIdsRaw) subCategoryIds = [subCategoryIdsRaw]

    if (!subCategoryIds.length) {
      newErr.sub_category_ids = t("Select at least one sub-category")
    }
    const certificatesRaw = formData?.certificates
    let certificates = []
    if (Array.isArray(certificatesRaw)) certificates = certificatesRaw
    else if (certificatesRaw) certificates = [certificatesRaw]

    if (!certificates.length) {
      newErr["certificates.0.title"] = t("Required")
      newErr["certificates.0.image"] = t("Image is required")
    } else {
      certificates.forEach((c, idx) => {
        if (!c?.title?.trim()) newErr[`certificates.${idx}.title`] = t("Required")
        if (!c?.image) newErr[`certificates.${idx}.image`] = t("Image is required")
      })
    }
    const shiftTimesRaw = formData?.shift_times
    let shiftTimes = []
    if (Array.isArray(shiftTimesRaw)) shiftTimes = shiftTimesRaw
    else if (shiftTimesRaw) shiftTimes = [shiftTimesRaw]

    shiftTimes.forEach((st, idx) => {
      const e = validateShiftTime(st || {})
      if (e) newErr[`shift_times.${idx}`] = e
    })

    const errorKeys = Object.keys(newErr)
    setErrors(errorKeys.length > 0 ? newErr : {})
    
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0]
      setTimeout(() => {
        const firstErrorElement = document.querySelector(`[data-field-id="${firstErrorKey}"]`)
        if (firstErrorElement) {
          const scrollTarget = firstErrorElement.closest('.select__control') || firstErrorElement
          scrollTarget.scrollIntoView({ behavior: "smooth", block: "center" })
          if (firstErrorElement.focus && typeof firstErrorElement.focus === 'function') {
            firstErrorElement.focus()
          }
        }
      }, 100)
    }

    return errorKeys.length === 0
  }

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    const fieldError = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: fieldError }))
  }

  const onFile = (name, file) => setFormData((p) => ({ ...p, [name]: file || null }))
  const onCertImage = (idx, file) => setFormData((p) => {
      const arr = [...p.certificates]
      arr[idx] = { ...arr[idx], image: file || null }
      return { ...p, certificates: arr }
    })
  const onCertTitle = (idx, v) => setFormData((p) => {
      const arr = [...p.certificates]
      arr[idx] = { ...arr[idx], title: v }
      return { ...p, certificates: arr }
    })
  const addCertificate = () => setFormData((p) => ({ ...p, certificates: [...p.certificates, { image: null, title: "" }] }))
  const removeCertificate = (idx) => setFormData((p) => {
      const arr = [...p.certificates]
      arr.splice(idx, 1)
      return { ...p, certificates: arr.length ? arr : [{ image: null, title: "" }] }
    })

  const onPhoneChange = (idx, v) => setFormData((p) => {
      const arr = [...p.phone_numbers]
      arr[idx] = v
      return { ...p, phone_numbers: arr }
    })
  const addPhone = () => setFormData((p) => ({ ...p, phone_numbers: [...p.phone_numbers, ""] }))
  const removePhone = (idx) => setFormData((p) => {
      const arr = [...p.phone_numbers]
      arr.splice(idx, 1)
      return { ...p, phone_numbers: arr.length ? arr : [""] }
    })

  const onShiftField = (idx, key, v) => setFormData((p) => {
      const arr = [...p.shift_times]
      arr[idx] = { ...arr[idx], [key]: key === "day_id" ? String(v) : v }
      return { ...p, shift_times: arr }
    })
  const addShift = () => setFormData((p) => ({
      ...p,
      shift_times: [
        ...p.shift_times,
        defaultShift()
      ]
    }))
  const removeShift = (idx) => setFormData((p) => {
      const arr = [...p.shift_times]
      arr.splice(idx, 1)
      return { ...p, shift_times: arr.length ? arr : [defaultShift()] }
    })

  useEffect(() => {
    if (!state) return
    const incomingPhoneNumbers = toArray(state.phone_numbers, [""])
    const incomingShiftTimes = toArray(state.shift_times, [])
    const incomingCertificates = toArray(state.certificates, [{ image: null, title: "" }])
    const incomingSubCategories = toArray(state.sub_category_ids, [])
    const shiftTemplate = defaultShift()

    setFormData((prev) => ({
      ...prev,
      full_name: '',
      name: state.name ?? prev.name,
      doctor: state.doctor ?? prev.doctor,
      pergl: state.pergl ?? prev.pergl,
      phone_number: state.phone_number ?? prev.phone_number,
      birth_date: state.birth_date ?? prev.birth_date,
      email: state.email ?? prev.email,
      is_male: String(state.is_male ?? prev.is_male),

      clinic_name: state.clinic_name ?? prev.clinic_name,
      address_text: state.address_text ?? prev.address_text,
      lat: state.lat ?? prev.lat,
      lng: state.lng ?? prev.lng,
      license_number: state.license_number ?? prev.license_number,
      is_center: String(state.is_center ?? prev.is_center),
      bio: state.bio ?? prev.bio,
      join_reason: state.join_reason ?? prev.join_reason,

      plan_id: String(state.plan_id ?? prev.plan_id),
      has_been_paid: String(state.has_been_paid ?? prev.has_been_paid),
      city_id: String(state.city_id ?? prev.city_id),

      certificates: incomingCertificates,
      sub_category_ids: incomingSubCategories.map(String),
      phone_numbers: incomingPhoneNumbers,
      shift_times: incomingShiftTimes.map(st => ({
        day_id: String(st?.day_id ?? shiftTemplate.day_id),
        start_time: st?.start_time ?? shiftTemplate.start_time,
        end_time: st?.end_time ?? shiftTemplate.end_time
      }))
    }))
    if (incomingSubCategories.length) {
      setSelectedCategoryIds(incomingSubCategories.map(String))
    }
  }, [state, defaultShift])

  useEffect(() => {
    const latNum = Number(formData.lat)
    const lngNum = Number(formData.lng)
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      setMapCenter({ lat: latNum, lng: lngNum })
    }
  }, [formData.lat, formData.lng])

  const handleManualCenter = () => {
    const latError = validateField("lat", formData.lat)
    const lngError = validateField("lng", formData.lng)
    setErrors((prev) => ({ ...prev, lat: latError, lng: lngError }))
    if (!latError && !lngError) {
      setMapCenter({ lat: Number(formData.lat), lng: Number(formData.lng) })
    }
  }

  const handlePlaceChanged = () => {
    if (!autocompleteInstance) return
    const place = autocompleteInstance.getPlace()
    const location = place?.geometry?.location
    if (!location) return
    const lat = location.lat()
    const lng = location.lng()
    setFormData((prev) => ({ ...prev, lat: String(lat), lng: String(lng) }))
    setErrors((prev) => ({
      ...prev,
      lat: validateField("lat", String(lat)),
      lng: validateField("lng", String(lng))
    }))
    setMapCenter({ lat, lng })
    setSearchValue(place?.formatted_address || place?.name || "")
  }

  const handleLocateMe = () => {
    if (!navigator?.geolocation) {
      ErrorAlert({
        title: t("Error"),
        body: t("Geolocation is not supported by your browser"),
        button: t("Done")
      })
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position?.coords?.latitude
        const lng = position?.coords?.longitude
        if (lat === undefined || lng === undefined) {
          setLocating(false)
          ErrorAlert({
            title: t("Error"),
            body: t("Unable to fetch current location"),
            button: t("Done")
          })
          return
        }
        const latStr = String(lat)
        const lngStr = String(lng)
        setFormData((prev) => ({ ...prev, lat: latStr, lng: lngStr }))
        setErrors((prev) => ({
          ...prev,
          lat: validateField("lat", latStr),
          lng: validateField("lng", lngStr)
        }))
        setMapCenter({ lat, lng })
        setSearchValue("")
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        ErrorAlert({
          title: t("Error"),
          body: err?.message || t("Unable to fetch current location"),
          button: t("Done")
        })
      },
      { enableHighAccuracy: true }
    )
  }

  const handleSubmit = async () => {
    const isValid = runValidation()
    if (!isValid) {
      ErrorAlert({
        title: t("Validation Error"),
        body: t("Please fill all required fields correctly"),
        button: t("Done")
      })
      return
    }

    try {
      const payload = new FormData()

      payload.append("full_name", '')
      payload.append("name", formData.name || '')
      if (formData.doctor) payload.append("doctor", formData.doctor)
      if (formData.pergl) payload.append("pergl", formData.pergl)
      payload.append("phone_number", formData.phone_number || '')
      
      const birthDate = formData.birth_date ? (typeof formData.birth_date === "string" ? formData.birth_date : new Date(formData.birth_date).toISOString().slice(0, 10)) : ""
      payload.append("birth_date", birthDate)
      payload.append("email", formData.email || '')
      payload.append("is_male", String(formData.is_male || "1"))

      if (formData.avatar) payload.append("avatar", formData.avatar)

      payload.append("clinic_name", formData.clinic_name || '')
      payload.append("address_text", formData.address_text || '')
      payload.append("lat", String(formData.lat || "33.518583"))
      payload.append("lng", String(formData.lng || "36.279089"))
      if (formData.license_number) payload.append("license_number", formData.license_number)
      payload.append("is_center", String(formData.is_center || "1"))
      if (formData.bio) payload.append("bio", formData.bio)
      if (formData.join_reason) payload.append("join_reason", formData.join_reason)

      if (formData.logo) payload.append("logo", formData.logo)
      if (formData.cover_image) payload.append("cover_image", formData.cover_image)
      
      if (Array.isArray(formData.certificates)) {
        formData.certificates.forEach((c, i) => {
          if (c?.image) payload.append(`certificates[${i}][image]`, c.image)
          if (c?.title) payload.append(`certificates[${i}][title]`, c.title)
        })
      }
      
      if (Array.isArray(formData.phone_numbers)) {
        formData.phone_numbers.forEach((p) => {
          if (p) payload.append("phone_numbers[]", p)
        })
      }

      if (Array.isArray(formData.sub_category_ids)) {
        formData.sub_category_ids.forEach((sid) => {
          if (sid) payload.append("sub_category_ids[]", sid)
        })
      }

      if (Array.isArray(formData.shift_times)) {
        formData.shift_times.forEach((st, i) => {
          if (st?.day_id) payload.append(`shift_times[${i}][day_id]`, String(st.day_id))
          if (st?.start_time) payload.append(`shift_times[${i}][start_time]`, st.start_time)
          if (st?.end_time) payload.append(`shift_times[${i}][end_time]`, st.end_time)
        })
      }

      payload.append("plan_id", String(formData.plan_id || ''))
      payload.append("has_been_paid", String(formData.has_been_paid || "1"))
      payload.append("city_id", String(formData.city_id || ''))

      await store({ body: payload }).unwrap()
      SuccessAlert({
        title: t("Success"),
        body: t("Clinic registered successfully"),
        position: "top-left"
      })
      navigate(-1)
    } catch (error) {
      console.error("Submit error:", error)
      ErrorAlert({
        title: t("Error"),
        body: error?.data?.message || storeError?.data?.message || error?.message || t("Something went wrong"),
        button: t("Done")
      })
    }
  }

  return isLoaded &&  (
    <div className="blog-edit-wrapper">
      <Breadcrumbs
        title={t("Registering clinics")}
        data={[{ title: t("Clinics"), link: "/clinics" }, { title: t("Clinic form") }]}
      />

      <Row>
        <Col sm="12">
          <Card
            style={{
              width: "100%",
              boxShadow: "0 8px 10px rgb(0 0 0 / 0.2)",
              borderRadius: "5px",
              padding: "5px",
              borderRight: "10px solid #1fa2ff"
            }}
          >
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle className="text-capitalize border-bottom" style={{ fontSize: "20px" }}>
                {t("Registering new clinic")}
              </CardTitle>
              <Button color="secondary" outline onClick={() => navigate(-1)}>
                {t("Back")}
              </Button>
            </CardHeader>

            <CardBody>
              <Form className="mt-2" onSubmit={(e) => e.preventDefault()}>
                {/* Personal / Doctor Section */}
                <h5 className="mb-1">{t("Doctor Information")}</h5>
                <Row className="mb-2">
                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Name")}</Label>
                    <Input
                      data-field-id="name"
                      value={formData.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                    {errors?.name && <div className="invalid-feedback d-block">{errors?.name}</div>}
                  </Col>
                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Phone Number")}</Label>
                    <Input
                      data-field-id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setField("phone_number", e.target.value)}
                      placeholder="+963937139393"
                    />
                    {errors?.phone_number && <div className="invalid-feedback d-block">{errors?.phone_number}</div>}
                  </Col>

                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Email")}</Label>
                    <Input
                      data-field-id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="doctor@example.com"
                    />
                    {errors?.email && <div className="invalid-feedback d-block">{errors?.email}</div>}
                  </Col>

                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Birth Date")}</Label>
                    <Flatpickr
                      data-field-id="birth_date"
                      value={formData.birth_date ? new Date(formData.birth_date) : null}
                      options={{ dateFormat: "Y-m-d" }}
                      onChange={(date) => setField("birth_date", date?.[0] ? date[0].toISOString().slice(0, 10) : "")
                      }
                      className="form-control"
                    />
                    {errors?.birth_date && <div className="invalid-feedback d-block">{errors?.birth_date}</div>}
                  </Col>

                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Gender")}</Label>
                    <div className="d-flex gap-2">
                      <div className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="is_male"
                          checked={formData.is_male === "1"}
                          onChange={() => setField("is_male", "1")}
                        />
                        <Label className="form-check-label">{t("Male")}</Label>
                      </div>
                      <div className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="is_male"
                          checked={formData.is_male === "0"}
                          onChange={() => setField("is_male", "0")}
                        />
                        <Label className="form-check-label">{t("Female")}</Label>
                      </div>
                    </div>
                    {errors?.is_male && <div className="invalid-feedback d-block">{errors?.is_male}</div>}
                  </Col>

                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Avatar")}</Label>
                    <Input type="file" accept="image/*" onChange={(e) => onFile("avatar", e.target.files?.[0])} />
                  </Col>
                </Row>
                <hr/>

                {/* Clinic Section */}
                <h5 className="mb-1">{t("Clinic Information")}</h5>
                <Row className="mb-2">
                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Clinic Name")}</Label>
                    <Input
                      data-field-id="clinic_name"
                      value={formData.clinic_name}
                      onChange={(e) => setField("clinic_name", e.target.value)}
                    />
                    {errors?.clinic_name && <div className="invalid-feedback d-block">{errors?.clinic_name}</div>}
                  </Col>
                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("License Number")}</Label>
                    <Input
                      value={formData.license_number}
                      onChange={(e) => setField("license_number", e.target.value)}
                    />
                  </Col>
                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Is Center?")}</Label>
                    <div className="d-flex gap-2">
                      <div className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="is_center"
                          checked={formData.is_center === "1"}
                          onChange={() => setField("is_center", "1")}
                        />
                        <Label className="form-check-label">{t("Yes")}</Label>
                      </div>
                      <div className="form-check form-check-inline">
                        <Input
                          type="radio"
                          name="is_center"
                          checked={formData.is_center === "0"}
                          onChange={() => setField("is_center", "0")}
                        />
                        <Label className="form-check-label">{t("No")}</Label>
                      </div>
                    </div>
                    {errors?.is_center && <div className="invalid-feedback d-block">{errors?.is_center}</div>}
                  </Col>

                  <Col md="6" className="mb-2">
                    <Label className="form-label">{t("Bio")}</Label>
                    <Input
                      type="textarea"
                      rows="3"
                      value={formData.bio}
                      onChange={(e) => setField("bio", e.target.value)}
                    />
                  </Col>
                  <Col md="6" className="mb-2">
                    <Label className="form-label">{t("Join Reason")}</Label>
                    <Input
                      type="textarea"
                      rows="3"
                      value={formData.join_reason}
                      onChange={(e) => setField("join_reason", e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Label className="form-label">{t("Categories")}</Label>
                    <Select
                      classNamePrefix="select"
                      isMulti
                      isLoading={loadingCats}
                      options={categoryOptions}
                      value={categoryOptions.filter(o => selectedCategoryIds.includes(String(o.value)))}
                      onChange={(opts) => {
                        const ids = (opts || []).map(o => String(o.value))
                        setSelectedCategoryIds(ids)
                        setFormData(prev => ({ ...prev, sub_category_ids: [] }))
                      }}
                      placeholder={t("Select categories")}
                      noOptionsMessage={() => (catsError ? t("Failed to load categories") : t("No options"))}
                    />
                  </Col>
                  <Col md={6}>
                    <Label className="form-label">{t("Sub Categories")}</Label>
                      <Select
                        classNamePrefix="select"
                        data-field-id="sub_category_ids"
                        isMulti
                        isDisabled={!selectedCategoryIds.length}
                        isLoading={loadingSubcats}
                        options={subcatOptions}
                        value={subcatOptions.filter(o => (formData.sub_category_ids || []).includes(String(o.value)))}
                        onChange={(opts) => {
                          const ids = (opts || []).map(o => String(o.value))
                          setFormData(prev => ({ ...prev, sub_category_ids: ids }))
                          setErrors(prev => ({ ...prev, sub_category_ids: ids.length ? "" : t("Select at least one sub-category") }))
                        }}
                        placeholder={
                          selectedCategoryIds.length ? t("Select sub categories") : t("Choose categories first")
                        }
                        noOptionsMessage={() => (subcatsError ? t("Failed to load subcategories") : t("No options"))
                        }
                      />
                    {errors?.sub_category_ids && (
                      <div className="invalid-feedback d-block">{errors?.sub_category_ids}</div>
                    )}
                  </Col>
                </Row>
                <hr/>
                <h5 className="mb-1">{t("Media")}</h5>
                <Row className="mb-2">
                  <Col md="6" className="mb-2">
                    <Label className="form-label">{t("Logo")}</Label>
                    <Input type="file" accept="image/*" onChange={(e) => onFile("logo", e.target.files?.[0])} />
                  </Col>
                  <Col md="6" className="mb-2">
                    <Label className="form-label">{t("Cover Image")}</Label>
                    <Input type="file" accept="image/*" onChange={(e) => onFile("cover_image", e.target.files?.[0])} />
                  </Col>
                </Row>

                <h5 className="mb-1">{t("Certificates")}</h5>
                <Row className="mb-2">
                  {formData.certificates.map((c, idx) => (
                    <Col md="12" className="border rounded p-1 mb-1" key={`cert-${idx}`}>
                      <Row>
                        <Col md="6" className="mb-1">
                          <Label className="form-label">{t("Certificate Image")}</Label>
                          <Input
                            data-field-id={`certificates.${idx}.image`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => onCertImage(idx, e.target.files?.[0])}
                          />
                          {errors?.[`certificates.${idx}.image`] && (
                            <div className="invalid-feedback d-block">{errors?.[`certificates.${idx}.image`]}</div>
                          )}
                        </Col>
                        <Col md="6" className="mb-1">
                          <Label className="form-label">{t("Certificate Title")}</Label>
                          <Input
                            data-field-id={`certificates.${idx}.title`}
                            value={c.title}
                            onChange={(e) => onCertTitle(idx, e.target.value)}
                          />
                          {errors?.[`certificates.${idx}.title`] && (
                            <div className="invalid-feedback d-block">{errors?.[`certificates.${idx}.title`]}</div>
                          )}
                        </Col>
                        <Col md="12" className="d-flex justify-content-end">
                          <Button color="danger" outline size="sm" onClick={() => removeCertificate(idx)}>
                            {t("Remove")}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                  <Col md="12" className="d-flex">
                    <Button color="info" outline onClick={addCertificate}>
                      {t("Add Certificate")}
                    </Button>
                  </Col>
                </Row>
                <hr/>
                  <h5 className="mb-1">{t("Additional Phone Numbers")}</h5>
                  <Row className="mb-2">
                    {formData.phone_numbers.map((p, idx) => (
                      <Col md="6" className="mb-1 d-flex" key={`phone-${idx}`}>
                        <InputGroup>
                          <InputGroupText>+ / 0</InputGroupText>
                          <Input
                            data-field-id={`phone_numbers.${idx}`}
                            value={p}
                            onChange={(e) => onPhoneChange(idx, e.target.value)}
                            placeholder="0948xxxxxxx"
                          />
                        </InputGroup>
                        <Button color="danger" outline className="ms-1" onClick={() => removePhone(idx)}>
                          {t("Remove")}
                        </Button>
                        {errors?.[`phone_numbers.${idx}`] && (
                          <div className="invalid-feedback d-block">{errors?.[`phone_numbers.${idx}`]}</div>
                        )}
                      </Col>
                    ))}
                    <Col md="12" className="d-flex">
                      <Button color="info" outline onClick={addPhone}>
                        {t("Add Phone")}
                      </Button>
                    </Col>
                  </Row>
                <hr/>
                <h5 className="mb-1">{t("Shift Times")}</h5>
                <Row className="mb-2">
                  {formData.shift_times.map((st, idx) => (
                    <Col md="12" className="border rounded p-1 mb-1" key={`shift-${idx}`} data-field-id={`shift_times.${idx}`}>
                      <Row className="align-items-end">
                        <Col md="4" className="mb-1">
                          <Label className="form-label">{t("Day ID")}</Label>
                          <Input
                            type="select"
                            value={String(st.day_id)}
                            onChange={(e) => onShiftField(idx, "day_id", e.target.value)}
                          >
                            {dayOptions.map((d) => (
                              <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                          </Input>
                        </Col>
                        <Col md="4" className="mb-1">
                          <Label className="form-label">{t("Start Time")}</Label>
                          <Input
                            type="time"
                            value={st.start_time}
                            onChange={(e) => onShiftField(idx, "start_time", e.target.value)}
                          />
                        </Col>
                        <Col md="4" className="mb-1">
                          <Label className="form-label">{t("End Time")}</Label>
                          <Input
                            type="time"
                            value={st.end_time}
                            onChange={(e) => onShiftField(idx, "end_time", e.target.value)}
                          />
                        </Col>
                        <Col md="12" className="d-flex justify-content-end mt-50">
                          <Button color="danger" outline size="sm" onClick={() => removeShift(idx)}>
                            {t("Remove Shift")}
                          </Button>
                        </Col>
                        {errors?.[`shift_times.${idx}`] && (
                          <div className="invalid-feedback d-block">{errors?.[`shift_times.${idx}`]}</div>
                        )}
                      </Row>
                    </Col>
                  ))}
                  <Col md="12" className="d-flex">
                    <Button color="info" outline onClick={addShift}>
                      {t("Add Shift")}
                    </Button>
                  </Col>
                </Row>
                <hr/>
                <Row>
                  <h5 className="mb-1">{t("Plan & Payment")}</h5>
                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("Plan")}</Label>
                    <Select
                      classNamePrefix="select"
                      data-field-id="plan_id"
                      isLoading={loadingPlans}
                      options={planOptions}
                      value={planOptions.find(o => String(o.value) === String(formData.plan_id)) || null}
                      onChange={(opt) => setField("plan_id", opt?.value ? String(opt.value) : "")}
                      placeholder={t("Select plan")}
                      noOptionsMessage={() => (plansError ? t("Failed to load plans") : t("No options"))}
                    />
                    {errors?.plan_id && <div className="invalid-feedback d-block">{errors?.plan_id}</div>}
                  </Col>
                  <Col md="2" className="mb-1">
                    <Label className="form-label">{t("Paid?")}</Label>
                    <Input
                      type="select"
                      value={formData.has_been_paid}
                      onChange={(e) => setField("has_been_paid", e.target.value)}
                    >
                      <option value="1">{t("Yes")}</option>
                      <option value="0">{t("No")}</option>
                    </Input>
                    {errors?.has_been_paid && <div className="invalid-feedback d-block">{errors?.has_been_paid}</div>}
                  </Col>
                </Row>
                <hr/>
                <Row>
                  <h5 className="mb-1">{t("Cities & location")}</h5>
                  <Col md="4" className="mb-2">
                    <Label className="form-label">{t("City")}</Label>
                    <Select
                      classNamePrefix="select"
                      data-field-id="city_id"
                      isLoading={loadingCities}
                      options={cityOptions}
                      value={cityOptions.find(o => String(o.value) === String(formData.city_id)) || null}
                      onChange={(opt) => setField("city_id", opt?.value ? String(opt.value) : "")}
                      placeholder={t("Select city")}
                      noOptionsMessage={() => (citiesError ? t("Failed to load cities") : t("No options"))}
                    />
                    {errors?.city_id && <div className="invalid-feedback d-block">{errors?.city_id}</div>}
                    <Label className="form-label mt-2">{t("Address Text")}</Label>
                    <Input
                      data-field-id="address_text"
                      value={formData.address_text}
                      onChange={(e) => setField("address_text", e.target.value)}
                    />
                    {errors?.address_text && <div className="invalid-feedback d-block">{errors?.address_text}</div>}
                  </Col>
                   <Col md="8" className="mb-2">
                    <Label className='form-label'>
                        {t('Set the coordinates of the branch on the map')}
                    </Label>
                    <Row className="mb-1">
                      <Col md="12" className="mb-1">
                        <Label className="form-label">{t("Coordinates (Lat, Lng)")}</Label>
                        <InputGroup>
                          <Input
                            data-field-id="lat"
                            value={`${formData.lat}, ${formData.lng}`.trim()}
                            onChange={(e) => {
                              const [latInput = "", lngInput = ""] = e.target.value
                                .split(",")
                                .map(part => part.trim())
                              setFormData(prev => ({
                                ...prev,
                                lat: latInput,
                                lng: lngInput
                              }))
                            }}
                            placeholder="33.518583, 36.279089"
                          />
                          <Button color="info" outline className="me-1" onClick={handleManualCenter}>
                            {t("Go")}
                          </Button>
                          <Button color="primary" outline onClick={handleLocateMe} disabled={locating}>
                            {locating ? <Spinner size="sm" /> : t("Use My Location")}
                          </Button>
                        </InputGroup>
                        {errors?.lat && <div className="invalid-feedback d-block">{errors?.lat}</div>}
                        {errors?.lng && <div className="invalid-feedback d-block">{errors?.lng}</div>}
                      </Col>
                    </Row>
                    <GoogleMap mapContainerStyle={containerStyle}
                                center={mapCenter}
                                zoom={15}
                                id="map"
                                onClick={(e) => {
                                  const lat = e?.latLng?.lat()
                                  const lng = e?.latLng?.lng()
                                  if (lat !== undefined && lng !== undefined) {
                                    setFormData(prev => ({ ...prev, lat: String(lat), lng: String(lng) }))
                                    setErrors(prev => ({
                                      ...prev,
                                      lat: validateField("lat", String(lat)),
                                      lng: validateField("lng", String(lng))
                                    }))
                                    setMapCenter({ lat, lng })
                                    setSearchValue("")
                                  }
                                }}>
                        <Marker position={mapCenter}/>
                    </GoogleMap>
                
                  </Col>
                </Row>
                <Col className="mt-50 d-flex justify-content-end">
                  <Button
                    color="primary"
                    className="me-1"
                    disabled={storing}
                    onClick={handleSubmit}
                  >
                    {storing ? <Spinner size="sm" /> : t("Submit")}
                  </Button>
                  <Button color="secondary" outline onClick={() => navigate(-1)}>
                    {t("Discard")}
                  </Button>
                </Col>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ClinicForm