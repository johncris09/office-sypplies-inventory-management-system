import React, { useEffect, useState } from 'react'
import {
  CCol,
  CContainer,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import ip from './../../constant/ip'
import axios from 'axios'

import logo from './../../assets/images/logo.png'
const TopFivePrintPerJudge = () => {
  const api = 'item'
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(ip + api)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const formattedDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  })
  return (
    <>
      <CRow className="justify-content-around evenly text-center mt-5 mb-4">
        <CCol>
          <CImage
            rounded
            src={logo}
            style={{
              width: '50%',
              height: 'auto',
              maxWidth: '80px',
              maxHeight: '90px',
            }}
          />{' '}
        </CCol>
      </CRow>
      <div className="text-center mb-2" style={{ 'margin-top': '-20px' }}>
        <pre>
          Republic of the Philippines
          <br />
          <strong>OFFICE OF THE CITY MAYOR </strong>
          <br />
          <i>Oroquieta City </i>
          <br />
          The Capital of Misamis Occidental
        </pre>
      </div>
      <hr />
      <div className="text-center my-2">
        <pre>
          <strong>Certification</strong>
        </pre>
      </div>
      <CContainer>
        <CRow>
          <CCol>
            <CTable striped bordered small responsive className=" mb-5 mt-2" borderColor="dark">
              <CTableHead>
                <CTableRow className="text-center">
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Item</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Avaiable</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total Quantity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.map((row, rowIndex) => (
                  <CTableRow key={rowIndex} className="text-center text-sm">
                    <CTableDataCell>{rowIndex + 1}</CTableDataCell>
                    <CTableDataCell>{row.item_name}</CTableDataCell>
                    <CTableDataCell>{row.available_stock}</CTableDataCell>
                    <CTableDataCell>{row.total_quantity}</CTableDataCell>
                    <CTableDataCell>{row.unit}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
        <CRow className="mt-5">
          <CCol md={9}> </CCol>
          <CCol md={3}>
            <div>
              <pre>
                <span className="mb-2">Prepared by:</span>
                <br />
                <br />
                <span style={{ marginLeft: '100px' }}>
                  <strong>
                    <u>GAY C. MONDOY</u>
                  </strong>
                </span>
                <br />
                <span style={{ marginLeft: '130px' }} className="text-sm">
                  SMDO
                </span>
                <br />
              </pre>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default TopFivePrintPerJudge
