// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Steps

// ** Icons Imports
import { Clock, Command, Image, Minimize2, Trello } from 'react-feather'
import ExchangeDollar from './exchange'
import Duration from './duration'
import FAQCategoies from './category'

const Settings = () => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    // {
    //   id: 'account-details',
    //   title: 'سعر الصرف',
    //   icon: <Minimize2 size={18} />,
    //   content: <ExchangeDollar stepper={stepper}/> 
    // },
    {
      id: 'duration-details',
      title: 'Duration',
      icon: <Clock size={18} />,
      content: <Duration stepper={stepper}/> 
    },
    {
      id: 'category-details',
      title: 'FAQ categories',
      icon: <Command size={18} />,
      content: <FAQCategoies stepper={stepper}/> 
    }
  ]

  return (
    <div className='modern-vertical-wizard'>
      <Wizard
        type='modern-vertical'
        ref={ref}
        steps={steps}
        options={{
          linear: false
        }}
        instance={el => setStepper(el)}
      />
    </div>
  )
}

export default Settings
