import React,{useState,useRef,ReactElement} from 'react'
import { Row } from 'react-bootstrap'
import Layout from '@layout/index'
import Trading from '@views/Invoice/Dashboard/Trading'
import BreadcrumbItem from '../Common/BreadcrumbItem'
import Information from '@views/Invoice/Dashboard/Information'
import RecentVoice from '@views/Invoice/Dashboard/RecentVoice'
import TotalExpenses from '@views/Invoice/Dashboard/TotalExpenses'
import Notification from '@views/Invoice/Dashboard/Notification'

function InvoiceDashboard() {
  const [display, setDisplay] = useState(null)
  const dropdownRef = useRef(null)

  const handleDropDown = (id:any) => {
    if(display===id){
     setDisplay(null)
    }else{
      setDisplay(id)
    }
  }
  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !event.target.closest('.dropdown')
    ) {
      setDisplay(null);
    }
  };


  return (
    <React.Fragment>
        <BreadcrumbItem mainTitle="Dashboard" subTitle="Invoice Dashboard" />
            <Row>
                <Trading/>
                <Information/>
                <RecentVoice 
                display={display} 
                handleDropDown={handleDropDown} 
                handleClickOutside={handleClickOutside} 
                dropdownRef={dropdownRef}/>

                <TotalExpenses  
                display={display} 
                handleDropDown={handleDropDown} 
                handleClickOutside={handleClickOutside} 
                dropdownRef={dropdownRef}/>

                <Notification 
                display={display} 
                handleDropDown={handleDropDown} 
                handleClickOutside={handleClickOutside} 
                dropdownRef={dropdownRef}/>
            </Row>
    </React.Fragment>
  )
}

InvoiceDashboard.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
};


export default InvoiceDashboard