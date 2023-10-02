import React, { useEffect, useState } from 'react'
import MaterialReactTable from 'material-react-table'
import { Article, DeleteOutline, EditSharp } from '@mui/icons-material'
import { MenuItem, ListItemIcon } from '@mui/material'
import RequiredNote from 'src/helper/RequiredNote'
import ConvertToTitleCase from '../../helper/ConvertToTitleCase'
import FormatDateTime from 'src/helper/FormatDateTime'
import GetErrorMessage from 'src/helper/GetErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import ip from './../../constant/ip'
import Draggable from 'react-draggable'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
} from '@coreui/react'
import FormatDate from 'src/helper/FormatDate'

const Borrower = ({ pageName }) => {
  const table = 'borrower'
  const [data, setData] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [validated, setValidated] = useState(false)
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [viewDetailsModalVisible, setViewDetailsModalVisible] = useState(false)
  const [selectedBorrower, setSelectedBorrower] = useState('')
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [borrowerBorrowedItem, setBorrowerBorrowedItem] = useState([])
  const [formData, setFormData] = useState({
    name: '',
  })
  useEffect(() => {
    fetchData()
  }, [data])

  const fetchData = async () => {
    try {
      const response = await axios.get(ip + table)
      const formattedData = response.data.map((item) => ({
        ...item,
        timestamp: FormatDateTime(item.timestamp),
      }))
      setData(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchBorrowerBorrowedItem = async (borrower_id) => {
    try {
      const response = await axios.get(ip + 'transaction/getBorrowerBorrowedItem/' + borrower_id)
      const formattedData = response.data.map((item) => ({
        ...item,
        date_borrowed: FormatDate(item.date_borrowed),
      }))
      console.info(formattedData)
      setBorrowerBorrowedItem(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleAdd = () => {
    setEditMode(false)
    setNewDataFormModalVisible(true)
    setValidated(false)
    setSelectedItemId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const _formData = new FormData(form)
    const name = _formData.get('name')

    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        if (selectedItemId) {
          // Update operation
          await updateData({
            name,
            id: selectedItemId,
          })
        } else {
          // Add operation
          await addData({
            name,
          })
          setFormData({
            ...formData,
            name: '',
          })
          setValidated(false)
        }

        // Fetch updated data
        fetchData()

        setValidated(true)
        setNewDataFormModalVisible(false)
      }
    } catch (error) {
      // Show error message
      Swal.fire({
        title: 'Error!',
        html: GetErrorMessage(error),
        icon: 'error',
      })
    }
  }

  const updateData = async (data) => {
    const response = await axios.put(ip + table, data)

    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const addData = async (data) => {
    const response = await axios.post(ip + table, data)
    // // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const deleteData = async (id) => {
    const response = await axios.delete(ip + table, { data: { id: id } })

    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: ConvertToTitleCase(value) })
  }
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
  ]

  const borrower_borrowed_item_column = [
    {
      accessorKey: 'date_borrowed',
      header: 'Date Borrowed',
    },
    {
      accessorKey: 'item_name',
      header: 'Item',
    },
    {
      accessorKey: 'quantity_borrowed',
      header: 'Quantity',
    },
    {
      accessorKey: 'item_unit',
      header: 'Unit',
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{pageName}</strong>
            <CButton
              size="sm"
              color="primary"
              variant="outline"
              className="float-end mx-1"
              onClick={handleAdd}
            >
              <FontAwesomeIcon icon={faPlusCircle} /> Add New Data
            </CButton>
          </CCardHeader>
          <CCardBody>
            <>
              <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enablePinning
                enableRowActions
                enableColumnResizing
                initialState={{ density: 'compact' }}
                positionToolbarAlertBanner="bottom"
                renderRowActionMenuItems={({ closeMenu, row }) => [
                  <MenuItem
                    key={0}
                    onClick={async () => {
                      closeMenu()
                      let id = row.original.id
                      fetchBorrowerBorrowedItem(id)
                      setSelectedBorrower(id)
                      setViewDetailsModalVisible(true)
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <Article />
                    </ListItemIcon>
                    View Details
                  </MenuItem>,
                  <MenuItem
                    key={1}
                    onClick={async () => {
                      closeMenu()
                      setFormData({
                        name: row.original.name,
                      })
                      setSelectedItemId(row.original.id) // Set the selected item ID
                      setNewDataFormModalVisible(true)
                      setEditMode(true)
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <EditSharp />
                    </ListItemIcon>
                    Edit
                  </MenuItem>,
                  <MenuItem
                    key={2}
                    onClick={() => {
                      closeMenu()
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          let itemId = row.original.id
                          await deleteData(itemId)
                          fetchData()
                        }
                      })
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <DeleteOutline />
                    </ListItemIcon>
                    Delete
                  </MenuItem>,
                ]}
              />
            </>
          </CCardBody>
        </CCard>
      </CCol>
      {/* Add New Data */}
      <CModal
        alignment="center"
        visible={newDataFormModalVisible}
        onClose={() => setNewDataFormModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Data' : 'Add New Data'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredNote />
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <CCol md={12}>
              <CFormInput
                type="text"
                feedbackInvalid="Name is required"
                id="name"
                label={
                  <>
                    Name
                    <span className="text-warning">
                      <strong>*</strong>
                    </span>
                  </>
                }
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </CCol>
            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {editMode ? 'Update' : 'Submit form'}
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>
      {/* View Details Data */}
      <CModal
        alignment="center"
        visible={viewDetailsModalVisible}
        onClose={() => setViewDetailsModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>View Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={12}>
              {/* Borrower's Borrowed Item */}
              <MaterialReactTable
                columns={borrower_borrowed_item_column}
                data={borrowerBorrowedItem}
                enableColumnFilterModes
                enableColumnOrdering
                enableGrouping
                enablePinning
                enableColumnResizing
                initialState={{ density: 'compact' }}
                positionToolbarAlertBanner="bottom"
              />
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </CRow>
  )
}

export default Borrower
