import React, { useRef, useState,ReactElement } from 'react'
import { Row, Col } from 'react-bootstrap'
import Layout from '@layout/index'
import BreadcrumbItem from '@common/BreadcrumbItem'
import MyCard from '@views/FinaceDashboard/MyCard'
import Transactions from '@views/FinaceDashboard/Transactions'
import CashFlow from '@views/FinaceDashboard/CashFlow'
import ExpensType from '@views/FinaceDashboard/ExpensType'
import TransactionsType from '@views/FinaceDashboard/TransactionsType'
import Accounts from '@views/FinaceDashboard/Accounts'
import QuickTransfer from '@views/FinaceDashboard/QuickTransfer'
import Catagory from '@views/FinaceDashboard/Catagory'
import TransactionHistory from '@views/FinaceDashboard/TransactionHistory'

const FinanceDashboard = () => {
  const [display, setDisplay] = useState(null)
  const dropdownRef = useRef(null)

  const handleDropDown = (id: any,e:any) => {
    if (display === id) {
      setDisplay(null)
    } else {
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
      <BreadcrumbItem mainTitle="Dashboard" subTitle="Finance" />
      <Row>
        <Col md={5} xxl={4}>

          <MyCard
            display={display}
            handleDropDown={handleDropDown}
            handleClickOutside={handleClickOutside}
            dropdownRef={dropdownRef} />

          <TransactionsType
            display={display}
            handleDropDown={handleDropDown}
            handleClickOutside={handleClickOutside}
            dropdownRef={dropdownRef} />

        </Col>
        <Col md={7} xxl={8}>
          <Transactions
            display={display}
            handleDropDown={handleDropDown}
            handleClickOutside={handleClickOutside}
            dropdownRef={dropdownRef} />
          <CashFlow />

          <ExpensType
            display={display}
            handleDropDown={handleDropDown}
            handleClickOutside={handleClickOutside}
            dropdownRef={dropdownRef} />
        </Col>

        <Accounts />

        <QuickTransfer
          display={display}
          handleDropDown={handleDropDown}
          handleClickOutside={handleClickOutside}
          dropdownRef={dropdownRef} />

        <Catagory
          display={display}
          handleDropDown={handleDropDown}
          handleClickOutside={handleClickOutside}
          dropdownRef={dropdownRef} />

        <TransactionHistory />
      </Row>
    </React.Fragment>
  )
}
FinanceDashboard.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
};

export default FinanceDashboard
