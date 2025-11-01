// ** Custom Components
import Sidebar from '@components/sidebar'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import { Button, Label, Input, Spinner, Row, Col } from 'reactstrap'
import FileUploaderRestrictions from '../../../../components/uplaoder/FileUploaderRestrictions'
import { useMemo, useState, useEffect } from 'react'
import { useStoreMutation, useUpdateMutation as updateCategory} from '../../../../../redux/rtkQuery/content/subCategory'
import useHeaders from '../../../../../utility/hooks/useHeaders'
import SuccessAlert from '../../../../components/handleStatusCode/success'
import ErrorAlert from '../../../../components/handleStatusCode/error'
import { Edit3 } from 'react-feather'
import { useUpdateMutation, useUploadMutation } from '../../../../../redux/rtkQuery/media'

const SidebarSubCategory = ({ open, toggleSidebar, selectedItem = null, id, handleClose, get }) => {
  const { t } = useTranslation()
  const headers = useHeaders()

  const [store, { data: storeData, isLoading: storing, status: storeStatus, error: storeError }] = useStoreMutation()
  const [update, { data: updateData, isLoading: updating, status: updateStatus, error: updateError }] = updateCategory()
  const [updateImage, { data: updateImageData, isLoading: updatingImage, status: updateImageStatus, error: updateImageError }] = useUpdateMutation()
  const [upload, { data: uploadData, isLoading: uploading, status: uploadStatus, error: uploadError }] = useUploadMutation()
  
  const [updatedImage, setUpdatedImage] = useState(false)

  const [form, setForm] = useState({ name: '', bio: '' })
  const [files, setFiles] = useState([])
console.log('files', files)

console.log('selectedItem', selectedItem)
  // Prefill form when editing
  useEffect(() => {
    if (selectedItem) {
      setForm({
        name: selectedItem?.name || '',
        bio: selectedItem?.bio || ''
      })
      setFiles([])
    } else {
      setForm({ name: '', bio: '' })
      setFiles([])
    }
  }, [selectedItem])

  const handleSidebarClosed = () => {
    setFiles([])
    setForm({ name: '', bio: '' })
    toggleSidebar()
  }  

  const handleSubmit = () => {
    const body = selectedItem ? new URLSearchParams() : new FormData() 
    const mediaBody = new FormData()
    body.append('name', form.name)
    body.append('bio', form.bio)
    body.append('category_id', id)
    if (selectedItem) {
      mediaBody.append('_method', 'PUT')
      if (selectedItem.media.length === 0) {
        mediaBody.append('context_id', selectedItem?.id)
        mediaBody.append('context_type', 'Subcategory')
        if (files.length > 0) mediaBody.append('image', files[0])
        updateImage({id:selectedItem?.media[0]?.id, headers, body: mediaBody})
      } else {
        if (files.length > 0) mediaBody.append('image', files[0])
        updateImage({id:selectedItem?.media[0]?.id, headers, body: mediaBody})
      }

      update({ id: selectedItem.id, headers, body })
    } else {
      if (files.length > 0) body.append('image', files[0])
      store({ headers, body })
    }
  }

  // Handle success/error for store
  useMemo(() => {
    if (storeStatus === 'fulfilled') {
      SuccessAlert({
        title: t('Success'),
        body: storeData?.message,
        position: 'top-left'
      })
      handleSidebarClosed()
      
      get({headers, id})
    }
    if (storeStatus === 'rejected') {
      ErrorAlert({
        title: t('Failed'),
        body: storeError?.data?.message,
        bottun: t('Done')
      })
    }
  }, [storeStatus])

  // Handle success/error for update
  useMemo(() => {
    if (updateStatus === 'fulfilled') {
      SuccessAlert({
        title: t('Updated'),
        body: updateData?.message,
        position: 'top-left'
      })
      get({headers, id})
      handleSidebarClosed()
    }
    if (updateStatus === 'rejected') {
      ErrorAlert({
        title: t('Update Failed'),
        body: updateError?.data?.message,
        bottun: t('Done')
      })
    }
  }, [updateStatus])

  return (
    <Sidebar
      size='md'
      open={open}
      title={selectedItem ? t('Update Sub Category') : t('Create Sub Category')}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <div className='mb-1'>
        <Label className='form-label' for='fullName'>
          {t('Name')} <span className='text-danger'>*</span>
        </Label>
        <Input
          id='fullName'
          placeholder={t('Sub Category name')}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className='mb-1'>
        <Label className='form-label' for='bio'>
          {t('Bio')} <span className='text-danger'>*</span>
        </Label>
        <Input
          type='textarea'
          rows={5}
          id='bio'
          placeholder={t('Sub Category Bio (description)')}
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
        />
      </div>
      {
        selectedItem === null ? <div className='mb-1'>
          <FileUploaderRestrictions
            title={t('Sub Category logo')}
            files={files}
            setFiles={setFiles}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
          />
        </div> : <div className='mb-1'  style={{display: !updatedImage && "flex", justifyContent: !updatedImage && 'center'}}>
          {
            updatedImage ? <FileUploaderRestrictions title={ 'Sub Category logo'} files={files} setFiles={setFiles} accept={{'image/*': ['.png', '.jpg', '.jpeg']}}/> : <Row>
              <Col md={12}>
                <Label for='role-select'>{`${t('الصورة السابقة')}:`}</Label>
                <Edit3 onClick={() => setUpdatedImage(true)} style={{color:"#1fa2ff", cursor:"pointer", width:'20px'}}/>
              </Col>
                  <Col md={12} style={{justifyContent:'center', display:'flex'}}>
                    <img src={selectedItem?.media[0]?.url} width='200px' height='200px'/>
                  </Col>
              </Row>
          }
        </div>
      }
      <Button type='submit' className='me-1' color='primary' disabled={storing || updating || updatingImage} onClick={handleSubmit}>
        {(storing || updating || updatingImage) ? <Spinner size='sm' /> : selectedItem ? t('Update') : t('Submit')}
      </Button>
      <Button type='reset' color='secondary' disabled={storing || updating || updatingImage} outline onClick={handleSidebarClosed}>
        {t('Discard')}
      </Button>
    </Sidebar>
  )
}

export default SidebarSubCategory