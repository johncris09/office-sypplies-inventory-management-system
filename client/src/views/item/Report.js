import React, { useEffect, useState } from 'react'
import {
  CCol,
  CContainer,
  CFooter,
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
      <CContainer>
        <CTable striped bordered small responsive className=" mb-5 mt-5" borderColor="dark">
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
      </CContainer>

      <CFooter className="bg-transparent footer fixed-bottom" style={{ fontSize: 12 }}>
        <div>
          <span>Developed by: OCM MIS Division &copy; {new Date().getFullYear()}</span>
        </div>
        <div>
          <span>Printed on {formattedDate}</span>
        </div>
      </CFooter>
    </>
  )
}

export default TopFivePrintPerJudge
