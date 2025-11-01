import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Label, Input, Button, Spinner } from 'reactstrap'
import { useCitiesQuery } from '../../../redux/rtkQuery/admin'

import '@styles/react/libs/react-select/_react-select.scss'
import Select from 'react-select'

// ** Utils
import { selectThemeColors } from '@utils'
import { useUpdateMutation } from '../../../redux/rtkQuery/product'
import SuccessAlert from '../../components/handleStatusCode/success'
import ErrorAlert from '../../components/handleStatusCode/error'

const ProductEditForm = ({data, setIsChanging}) => {
  const {t} = useTranslation()
  const {data:citiesData} = useCitiesQuery()

  
  const [update, {data:updateData, status, isLoading, error}] = useUpdateMutation()
  const cities = citiesData?.data?.map((el) => ({ value: el?.id, label: el?.name }))

  const [formData, setFormData] = useState({
    name: '',
    city_id: '',
    address: '',
    description: '',
    is_negotiable: 1,
    is_fluctuate_price: 0,
    delete_main_img: 0
  })
  useMemo(() => {
    if (status === 'fulfilled') {
        SuccessAlert({
            title: t('Success'),
            body: updateData?.message,
            position:'top-left'
        })
        setIsChanging(true)
        setTimeout(() => (
          setIsChanging(false)
        ), 100)
    } if (status === 'rejected') {
        ErrorAlert({
            title: t('Failed'),
            body: error?.data?.message,
            button: t('Done')
        })
    }
  }, [status])
  useEffect(() => {
    setFormData({
        name:data?.name,
        city_id:{value: data?.city_id, label:data?.city_name},
        address:data?.address,
        description:data?.description,
        is_negotiable: data?.is_negotiable ? 1 : 0,
        is_fluctuate_price: data?.is_fluctuate_price ? 1 : 0,
        delete_main_img: 0
    })
  }, [data])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }))
  }

  const handleSubmit = () => {
    const submitData = new FormData()
    submitData.append('_method', 'PUT')
    submitData.append('name', formData.name)
    submitData.append('city_id', formData?.city_id?.value)
    submitData.append('address', formData.address)
    submitData.append('description', formData.description)
    submitData.append('delete_video', 0)
    // submitData.append('deleted_media[]', null)
    submitData.append('is_negotiable', formData.is_negotiable ? 1 : 0)
    submitData.append('is_fluctuate_price', formData.is_fluctuate_price ? 1 : 0)
    submitData.append('delete_main_img', formData.delete_main_img ? 1 : 0)
    data.custom_fields.forEach((item, index) => {
  let value = item.value;

  // If value is a string that looks like an array, parse it and join
  if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        value = parsed.join(',');
      }
    } catch (error) {
      // Not a JSON array string, keep original value
    }
  }

  submitData.append(`form_custom_fields[${index}][id]`, item.field.id);
  submitData.append(`form_custom_fields[${index}][value]`, value);
});


    update({body:submitData, id:data?.id})
  }

  return (
    <Card style = {{
            width: "100%", 
            boxShadow: "0 8px 10px rgb(0, 0, 0, 0.2)", 
            borderRadius: "5px", 
            padding: "5px",
            borderRight: "10px solid #1fa2ff"}}>
      <CardHeader>
        <CardTitle>{t('Update Product')}</CardTitle>
      </CardHeader>
      <CardBody>
          <Row>
            <Row>
              <Col md='6'>
                <div className={'mt-1'}>
                    <Label>{t('Name')}</Label>
                    <Input name='name' value={formData.name} onChange={handleChange} />
                </div>
                <div className={'mt-1'}>
                    <Label>{t('City')}</Label>
                    <Select
                        id='city'
                        className='react-select'
                        classNamePrefix='select'
                        isClearable={false}
                        options={cities}
                        value={formData.city_id}
                        theme={selectThemeColors}
                        onChange={data => setFormData({ ...formData, city_id: data })}
                    /> 
                </div>
                <div className={'mt-1'}>
                    <Label>{t('Address')}</Label>
                    <Input name='address' value={formData.address} onChange={handleChange} />
                </div>
              </Col>
              <Col md={6} className={'mt-1'}>
                <Label>{t('Description')}</Label>
                <Input type='textarea' rows='7' name='description' value={formData.description} onChange={handleChange} />
              </Col>
            </Row>
            <Row>
                <Row>
                    <Col md='6' className={'mt-1'}>
                        <Input type='checkbox' name='is_negotiable' checked={formData.is_negotiable === 1} onChange={handleChange} /> {` `}
                        <Label>{` ${t('Is Negotiable')} `}</Label>
                    </Col>
                </Row>
                <Row>
                    <Col md='6' className={'mt-1'}>
                        <Input type='checkbox' name='is_fluctuate_price' checked={formData.is_fluctuate_price === 1} onChange={handleChange} />{` `}
                        <Label>{` ${t('Is Fluctuate Price?')}`}</Label>
                    </Col>
                </Row>
                <Row>
                    <Col md='6' className={'mt-1'}>
                        <Input type='checkbox' name='delete_main_img' checked={formData.delete_main_img === 1} onChange={handleChange} />{` `}
                        <Label>{t('Delete Main Image?')}</Label>
                    </Col>
                </Row>
            </Row>
            <Col sm='12' className='mt-2 d-flex justify-content-end'>
              <Button color='primary' onClick={handleSubmit}>
                {isLoading ? <Spinner size='sm' /> : 'Update Product'}
              </Button>
            </Col>
          </Row>
      </CardBody>
    </Card>
  )
}

export default ProductEditForm
