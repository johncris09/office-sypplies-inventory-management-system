import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { cilFilter } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CAlertHeading,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import { faCancel, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import GetErrorMessage from 'src/helper/GetErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Draggable from 'react-draggable'
import RequiredNote from 'src/helper/RequiredNote'
import ip from '../../constant/ip'
import axios from 'axios'
import { Box, IconButton, ListItemIcon, MenuItem, Stack, Tooltip } from '@mui/material'
import { MaterialReactTable } from 'material-react-table'
import {
  Add,
  AddCircle,
  CollectionsBookmarkOutlined,
  DeleteOutline,
  EditSharp,
  PlusOne,
} from '@mui/icons-material'
import Swal from 'sweetalert2'
import FormatDateTime from 'src/helper/FormatDateTime'
import FormatDate from 'src/helper/FormatDate'

const Item = ({ pageName }) => {
  const api = 'item'
  const [data, setData] = useState([])
  const [itemName, setItemName] = useState('')
  const [itemUnit, setItemUnit] = useState('')
  const [itemTotalQuantity, setItemTotalQuantity] = useState('')

  const [itemStock, setItemStock] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [validated, setValidated] = useState(false)
  const [newDataFormModalVisible, setNewDataFormModalVisible] = useState(false)
  const [addItemQuantityModel, setAddItemQuantityModel] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [selectedItemQuantityId, setSelectedItemQuantityId] = useState(null)
  const [isPasswordFieldVisible, setPasswordFieldVisible] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
  })
  const [formItemQuantityData, setFormItemQuantityData] = useState({
    item_id: '',
    quantity_added: '',
    date_added: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [itemStock, data])

  const fetchData = async () => {
    try {
      const response = await axios.get(ip + api)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchItemStockData = async (item_id) => {
    try {
      if (item_id) {
        const response = await axios.get(ip + 'item_stock/item/' + item_id)
        const formattedData = response.data.map((item) => ({
          ...item,
          date_added: FormatDate(item.date_added),
        }))
        setItemStock(formattedData)
      }
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
    const unit = _formData.get('unit')

    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        if (selectedItemId) {
          // Update operation
          await updateData({
            name,
            unit,
            id: selectedItemId,
          })
        } else {
          // Add operation
          await addData({
            name,
            unit,
          })
          setFormData({
            ...formData,
            name: '',
            unit: '',
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
    const response = await axios.put(ip + api, data)

    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const addData = async (data) => {
    const response = await axios.post(ip + api, data)
    // // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const deleteData = async (id) => {
    console.info(id)
    const response = await axios.delete(ip + api, { data: { id: id } })
    // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const handleItemQuantityAddedChange = (e) => {
    const { name, value } = e.target
    setFormItemQuantityData({ ...formItemQuantityData, [name]: value })
  }

  const handleItemManageQuantitySubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const _formData = new FormData(form)
    const item_id = _formData.get('item_id')
    const quantity_added = _formData.get('quantity_added')
    const date_added = _formData.get('date_added')

    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        if (selectedItemQuantityId) {
          // Update operation
          await updateItemQuantityData({
            item_id,
            quantity_added,
            date_added,
            id: selectedItemQuantityId,
          })
        } else {
          // Add operation
          await addItemQuantityData({
            item_id,
            quantity_added,
            date_added,
          })
          setFormItemQuantityData({
            ...formItemQuantityData,
            quantity_added: '',
            date_added: '',
          })
          setValidated(false)
        }

        // Fetch updated data
        fetchItemStockData(item_id)

        // setValidated(true)
        // setNewDataFormModalVisible(false)
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

  const updateItemQuantityData = async (data) => {
    const response = await axios.put(ip + 'item_stock', data)
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })

    setSelectedItemQuantityId(null)
    setFormItemQuantityData({
      ...formItemQuantityData,
      quantity_added: '',
      date_added: '',
    })
    setValidated(false)
  }

  const addItemQuantityData = async (data) => {
    const response = await axios.post(ip + 'item_stock', data)
    // // Show success message
    Swal.fire({
      title: 'Success!',
      html: response.data.message,
      icon: 'success',
    })
  }

  const columns = [
    {
      accessorKey: 'item_name',
      header: 'Item',
    },
    {
      accessorKey: 'available_stock',
      header: 'Available Stock',
    },
    {
      accessorKey: 'quantity_borrowed',
      header: 'Borrowed Quantity',
    },
    {
      accessorKey: 'total_quantity',
      header: 'Total Quantity',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
    },
  ]

  const itemSotckColumns = [
    {
      accessorKey: 'quantity_added',
      header: 'Quantity',
    },
    {
      accessorKey: 'date_added',
      header: 'Date',
    },
  ]

  return (
    <CRow>
      <CCol md={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{pageName}</strong>
            <CButton
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
                      console.log(row.original)
                      let item_id = row.original.item_id
                      fetchItemStockData(item_id)

                      setFormItemQuantityData({
                        item_id: row.original.item_id,
                        quantity_added: '',
                        date_added: '',
                      })
                      setSelectedItemQuantityId(null)
                      setItemName(row.original.item_name)
                      setItemUnit(row.original.unit)
                      setAddItemQuantityModel(true)
                      setValidated(false)
                    }}
                    sx={{ m: 0 }}
                  >
                    <ListItemIcon>
                      <AddCircle />
                    </ListItemIcon>
                    Add Quantity
                  </MenuItem>,
                  <MenuItem
                    key={1}
                    onClick={async () => {
                      closeMenu()
                      setFormData({
                        name: row.original.item_name,
                        unit: row.original.unit,
                      })
                      setSelectedItemId(row.original.item_id)
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
                          let itemId = row.original.item_id
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
            <CCol md={12}>
              <CFormSelect
                feedbackInvalid="Unit is required"
                id="unit"
                label={
                  <>
                    Unit
                    <span className="text-warning">
                      <strong>*</strong>
                    </span>
                  </>
                }
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="">Choose...</option>
                <option value="pcs">pcs</option>
                <option value="packs">packs</option>
                <option value="reams">reams</option>
              </CFormSelect>
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

      <CModal
        alignment="center"
        visible={addItemQuantityModel}
        onClose={() => setAddItemQuantityModel(false)}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>{selectedItemQuantityId ? 'Edit Quantity' : 'Add Quantity'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredNote />
          <table>
            <tr>
              <td>Item Name</td>
              <td>:</td>
              <td>
                <u>
                  <strong>{itemName}</strong>
                </u>
              </td>
            </tr>
            <tr>
              <td>Available Stock</td>
              <td>:</td>
              <td>
                <u>
                  <strong>
                    {itemStock.reduce(
                      (accumulator, currentItem) => accumulator + currentItem.quantity_added,
                      0,
                    )}
                  </strong>
                </u>
              </td>
            </tr>
            <tr>
              <td>Item Unit</td>
              <td>:</td>
              <td>
                <u>
                  <strong>{itemUnit}</strong>
                </u>
              </td>
            </tr>
          </table>
          <>
            <CForm
              className="row g-3 needs-validation mb-5"
              noValidate
              validated={validated}
              onSubmit={handleItemManageQuantitySubmit}
            >
              <CCol md={12}>
                <CFormInput
                  type="hidden"
                  name="item_id"
                  value={formItemQuantityData.item_id}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="number"
                  feedbackInvalid="Quantity is required"
                  id="quantity_added"
                  label={
                    <>
                      Quantity
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="quantity_added"
                  value={formItemQuantityData.quantity_added}
                  onChange={handleItemQuantityAddedChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="date"
                  feedbackInvalid="Date is required"
                  id="date_added"
                  label={
                    <>
                      Date
                      <span className="text-warning">
                        <strong>*</strong>
                      </span>
                    </>
                  }
                  name="date_added"
                  value={formItemQuantityData.date_added}
                  onChange={handleItemQuantityAddedChange}
                  required
                />
              </CCol>
              <hr />
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {selectedItemQuantityId ? 'Update' : 'Submit form'}
                </CButton>
              </CCol>
            </CForm>

            <MaterialReactTable
              columns={itemSotckColumns}
              data={itemStock}
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
                    // console.info(FormatDate(row.original.date_added))

                    const dateString = row.original.date_added

                    // Convert the date string to a Date object
                    const date = new Date(dateString)
                    // Add one day to the Date object
                    date.setUTCDate(date.getUTCDate() + 1)

                    // Extract the updated year, month, and day parts after adding one day
                    const updatedYear = date.getUTCFullYear()
                    const updatedMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
                    const updatedDay = String(date.getUTCDate()).padStart(2, '0')

                    // Format the updated date in Y-m-d format
                    const updatedFormattedDate = `${updatedYear}-${updatedMonth}-${updatedDay}`

                    setFormItemQuantityData({
                      item_id: row.original.item_id,
                      quantity_added: row.original.quantity_added,
                      date_added: updatedFormattedDate,
                    })
                    setSelectedItemQuantityId(row.original.id)
                    // setNewDataFormModalVisible(true)
                    // setEditMode(true)
                  }}
                  sx={{ m: 0 }}
                >
                  <ListItemIcon>
                    <EditSharp />
                  </ListItemIcon>
                  Edit
                </MenuItem>,
              ]}
            />
          </>
        </CModalBody>
      </CModal>
    </CRow>
  )
}

export default Item
