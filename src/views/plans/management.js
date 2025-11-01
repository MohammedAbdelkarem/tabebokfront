// ** React Imports
import { useEffect, useMemo, useState } from "react"

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  CardHeader,
  CardTitle,
  Spinner
} from "reactstrap"

// ** Styles
import "@styles/react/libs/editor/editor.scss"
import "@styles/base/plugins/forms/form-quill-editor.scss"
import "@styles/react/libs/react-select/_react-select.scss"
import "@styles/base/pages/page-blog.scss"
import Flatpickr from "react-flatpickr"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import { useTranslation } from "react-i18next"
import SuccessAlert from "../components/handleStatusCode/success"
import { useLocation, useNavigate } from "react-router-dom"
import ErrorAlert from "../components/handleStatusCode/error"
import {
  useCreateMutation,
  useUpdateMutation
} from "../../redux/rtkQuery/plan"
import FormattingMask from "../components/formatting"
const PlanForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const state = useLocation()?.state
  const [errors, setErrors] = useState({})

  const [
    store,
    {
      data: storeData,
      isLoading: storing,
      status: storeStatus,
      error: storeError
    }
  ] = useCreateMutation()
  const [
    update,
    { isLoading: updating, status: updateStatus, error: updateError }
  ] = useUpdateMutation()
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    number_of_days: "",
    is_discount: false,
    discount_percentage: "",
    discount_start_at: "",
    discount_end_at: ""
  })
  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return value.trim() ? "" : "اسم الخطة مطلوب"
        case "price":
        const numericPrice = String(value).replace(/,/g, '')
        return !numericPrice || isNaN(numericPrice) || numericPrice < 1 || numericPrice > 999999999 ? "السعر يجب أن يكون بين 1 و 999,999,999" : ""
      case "number_of_days":
        return !value || isNaN(value) || value < 1 || value > 365 ? "المدة يجب أن تكون بين 1 و 365 يوم" : ""
      case "discount_percentage":
        return value && (isNaN(value) || value < 0.01 || value > 99.99) ? "الخصم يجب أن يكون بين 0.01% و 99.99%" : ""
      default:
        return ""
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    const fieldError = validateField(name, value)
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError }))
  }

  const validateForm = () => {
    const newErrors = {}

    for (const key in formData) {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    }

    const today = new Date().toISOString().slice(0, 10)

    if (formData.discount_start_at && formData.discount_start_at < today) newErrors.discount_start_at = "تاريخ البداية يجب أن يكون اليوم أو بعده"

    if (
      formData.discount_end_at &&
      formData.discount_start_at &&
      formData.discount_end_at <= formData.discount_start_at
    ) newErrors.discount_end_at =
        "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    if (state) {
      setFormData({
        title: state.title,
        price: state.price,
        number_of_days: state.number_of_days,
        is_discount:state?.discount_percentage > 0,
        discount_percentage: state.discount_percentage,
        discount_start_at: state.discount_start_at?.slice(0, 10),
        discount_end_at: state.discount_end_at?.slice(0, 10)
      })
    }
  }, [state])
  const handleSubmit = () => {
    if (!validateForm()) return
    const formatDateTo24Hour = (date) => {
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, 0)
      const day = String(d.getDate()).padStart(2, 0)

      return `${year}-${month}-${day}`
    }
    if (state) {
      // Edit mode
      const payload = new URLSearchParams()
      payload.append("_method", "PUT")
      payload.append("title", formData.title)
      if (String(formData?.price)?.includes(',')) {
        const cleanPrice = formData.price.replace(/,/g, '')
        payload.append("price", cleanPrice)
      } else {
        payload.append("price", formData.price)
      }
      payload.append("number_of_days", formData.number_of_days)
      payload.append("discount_percentage", formData.discount_percentage)
      payload.append(
        "discount_start_at",
        formatDateTo24Hour(formData.discount_start_at)
      )
      payload.append(
        "discount_end_at",
        formatDateTo24Hour(formData.discount_end_at)
      )

      update({ body: payload, id: state.id })
    } else {
      // Create mode
      const payload = new FormData()
      payload.append("title", formData.title)
      if (String(formData?.price)?.includes(',')) {
        const cleanPrice = formData.price.replace(/,/g, '')
        payload.append("price", cleanPrice)
      } else {
        payload.append("price", formData.price)
      }
      payload.append("number_of_days", formData.number_of_days)
      payload.append("discount_percentage", formData.discount_percentage)
      payload.append(
        "discount_start_at",
        formatDateTo24Hour(formData.discount_start_at)
      )
      payload.append(
        "discount_end_at",
        formatDateTo24Hour(formData.discount_end_at)
      )

      store({ body: payload })
    }
  }

  useMemo(() => {
    if (storeStatus === "fulfilled") {
      SuccessAlert({
        title: "Success",
        body: "Plan saved successfully",
        position: "top-left"
      })
      navigate(-1)
    }
    if (storeStatus === "rejected") {
      ErrorAlert({
        title: "Error",
        body: storeError?.data?.message,
        button: t("Done")
      })
    }
  }, [storeStatus])
  useMemo(() => {
    if (updateStatus === "fulfilled") {
      SuccessAlert({
        title: "Success",
        body: "Plan updated successfully",
        position: "top-left"
      })
      navigate(-1)
    }
    if (updateStatus === "rejected") {
      ErrorAlert({
        title: "Error",
        body: updateError?.data?.message,
        button: t("Done")
      })
    }
  }, [updateStatus])

  return (
    <div className="blog-edit-wrapper">
      <Breadcrumbs
        title={t("Manging Plans")}
        data={[{ title: t("Plans List"), link: "/plans" }, { title: t("Manging Plan")}]}
      />
      <Row>
        <Col sm="12">
          <Card
            style={{
              width: "100%",
              boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)",
              borderRadius: "5px",
              padding: "5px",
              borderRight: "10px solid #1fa2ff"
            }}
          >
            <CardHeader>
              <CardTitle
                className="text-capitalize border-bottom"
                style={{ fontSize: "20px" }}
              >
                {t("Manging Plan")}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Form className="mt-2" onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col md="4" className="mb-2">
                    <Label className="form-label" for="blog-edit-title">
                      {t("Plan title")}
                    </Label>
                    <Input
                      id="blog-edit-title"
                      name="title"
                      className="mb-1"
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <div className="invalid-feedback d-block">
                        {errors.title}
                      </div>
                    )}
                  </Col>
                  <Col md={4}>
                  <Label className="form-label" for="blog-edit-slug">
                    {t("Price")}
                  </Label>
                    <FormattingMask
                    id='price'
                    name='price'
                    defaultValue={formData.price}
                    onChange={e => setFormData({...formData, price :e.target.value })}
                    required
                  />
                  {errors.price && (
                    <div className="invalid-feedback d-block">
                      {errors.price}
                    </div>
                  )}
                  </Col>
                  <Col md={4}>
                  <Label className="form-label" for="blog-edit-slug">
                    {t("Duration")}
                  </Label>
                  <Input
                    className="mb-1"
                    id="blog-edit-title"
                    name="number_of_days"
                    value={formData.number_of_days}
                    onChange={handleChange}
                  />
                  {errors.number_of_days && (
                    <div className="invalid-feedback d-block">
                      {errors.number_of_days}
                    </div>
                  )}
                </Col>

                  <Col md={6}>
                    <div className="d-flex mt-2 mb-2">
                      <div className="d-flex align-items-center justify-content-between flex-grow-1">
                        <div className="me-1">
                          <p className="fw-bolder mb-0">{t("يوجد خصم؟")}</p>
                        </div>
                        <div className="d-flex gap-2">
                          <div className="form-check form-check-inline">
                            <Input
                              type="radio"
                              name="is_discount"
                              id="cashOnDelivery"
                              value="cash_on_delivery"
                              checked={formData.is_discount === true}
                              onChange={() => setFormData({ ...formData, is_discount: true })
                              }
                            />
                            <Label
                              className="form-check-label"
                              for="cashOnDelivery"
                            >
                              {t("نعم")}
                            </Label>
                          </div>
                          <div className="form-check form-check-inline">
                            <Input
                              type="radio"
                              name="is_discount"
                              id="notCashOnDelivery"
                              value="not_cash_on_delivery"
                              checked={formData.is_discount === false}
                              onChange={() => setFormData({ ...formData, is_discount: false })
                              }
                            />
                            <Label
                              className="form-check-label"
                              for="notCashOnDelivery"
                            >
                              {t("لا")}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} />
                  {formData.is_discount ? (
                    <>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="blog-edit-slug">
                          {t("Discount Ratio")}
                        </Label>
                        <Input
                          id="blog-edit-title"
                          name="discount_percentage"
                          value={formData.discount_percentage}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md="6" />
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="blog-edit-slug">
                          {t("Discount Start Date")}
                        </Label>
                        <Flatpickr
                          value={
                            formData?.discount_start_at ? new Date(formData.discount_start_at) : null
                          }
                          options={{ minDate: "today", dateFormat: "Y-m-d" }}
                          onChange={(date) => setFormData({
                              ...formData,
                              discount_start_at: date[0]
                            })
                          }
                          className="form-control invoice-edit-input due-date-picker"
                        />
                      </Col>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="blog-edit-slug">
                          {t("Discount End Date")}
                        </Label>
                        <Flatpickr
                          value={
                            formData?.discount_end_at ? new Date(formData.discount_end_at) : null
                          }
                          options={{ minDate: "today", dateFormat: "Y-m-d" }}
                          onChange={(date) => setFormData({
                              ...formData,
                              discount_end_at: date[0]
                            })
                          }
                          className="form-control invoice-edit-input due-date-picker"
                        />
                      </Col>
                    </>
                  ) : null}
                  <Col className="mt-50 d-flex justify-content-end">
                    <Button
                      color="primary"
                      className="me-1"
                      disabled={
                        storing ||
                        updating ||
                        Object.values(errors).some((err) => err)
                      }
                      onClick={() => handleSubmit()}
                    >
                      {storing || updating ? (
                        <Spinner size={"sm"} />
                      ) : (
                        t("Submit")
                      )}
                    </Button>
                    <Button color="secondary" outline>
                      {t("Discard")}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PlanForm
