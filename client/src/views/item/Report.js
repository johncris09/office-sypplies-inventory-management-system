import React, { useEffect, useState } from 'react'
import {
  CCol,
  CContainer,
  CFormSelect,
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
import './../../assets/css/custom.css'
import logo from './../../assets/images/logo.png'

const Report = () => {
  const api = 'item'
  const [data, setData] = useState([])
  const [type, setType] = useState([])
  const [formData, setFormData] = useState({
    type: '',
  })

  useEffect(() => {
    fetchData(formData.type)
    fetchType()
  }, [data])

  const fetchData = async (selectedType) => {
    try {
      const response = await axios.get(ip + api, { params: { type: selectedType } })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchType = async () => {
    try {
      const response = await axios.get(ip + 'type')
      setType(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

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
          <strong>CERTIFICATION</strong>
        </pre>
      </div>
      <CContainer>
        <CRow className="type">
          <CCol>
            <CFormSelect id="type" name="type" onChange={handleChange}>
              <option value="">Choose Type...</option>
              {type.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.type}
                </option>
              ))}
            </CFormSelect>
            <hr />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CTable striped bordered small responsive className=" mb-5 mt-2" borderColor="dark">
              <CTableHead>
                <CTableRow className="text-center">
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Item</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Available</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Consumed</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Unit</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.map((row, rowIndex) => (
                  <CTableRow key={rowIndex} className="text-center text-sm">
                    <CTableDataCell>{rowIndex + 1}</CTableDataCell>
                    <CTableDataCell>{row.item_name}</CTableDataCell>
                    <CTableDataCell>{row.available_stock}</CTableDataCell>
                    <CTableDataCell>{row.borrowed_quantity}</CTableDataCell>
                    <CTableDataCell>{row.total_quantity}</CTableDataCell>
                    <CTableDataCell>{row.unit}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
        <div className="text-left" style={{ 'margin-top': '20px' }}>
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
            <span style={{ marginLeft: '10px' }} className="text-sm">
              Supervising Manpower Development Officer
            </span>
          </pre>
        </div>
      </CContainer>
    </>
  )
}

export default Report
