import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CRow,
} from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import ip from './../../constant/ip'
import axios from 'axios'
import { MaterialReactTable } from 'material-react-table'
import { IconButton, Tooltip } from '@mui/material'
import { Delete } from '@mui/icons-material'
import FormatDate from 'src/helper/FormatDate'
import { CChartBar } from '@coreui/react-chartjs'

const Dashboard = ({ pageName, userInfo }) => {
  const navigate = useNavigate()
  const itemQuantityRefs = useRef([])
  const [itemData, setItemData] = useState([])
  const [borrowedItem, setBorrowedItem] = useState([])
  const [borrowerData, setBorrowerData] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [validated, setValidated] = useState(false)
  const [selectedBorrower, setSelectedBorrower] = useState('')
  const [quantityInput, setQuantityInput] = useState({})
  const [borrowerBorrowedItem, setBorrowerBorrowedItem] = useState([])
  const [itemQuantities, setItemQuantities] = useState({})
  const [chartItemBorrowedByDate, setChartItemBorrowedByDate] = useState([])
  const years = Array.from({ length: 3 }, (_, index) => 2023 - index)
  const currentDate = new Date()
  const currentMonthNumber = currentDate.getMonth() + 1

  const [filderData, setFilderData] = useState({
    item_id: '',
    month: currentMonthNumber,
    year: years[0],
  })

  // Array to hold the months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // State to hold the selected month
  useEffect(() => {
    // Check if the token is set in local storage or cookies
    const token = localStorage.getItem('token') // Assuming the token is stored in local storage

    if (!token) {
      // If the token is set, navigate to the dashboard
      navigate('/login', { replace: true })
    }
    fetchItem()
    fetchBorrower()
    fetchItemBorrowedByDate(filderData)
  }, [filderData])

  const handleItemQuantityRef = (index, ref) => {
    itemQuantityRefs.current[index] = ref
  }
  const fetchItemBorrowedByDate = async (filderData) => {
    try {
      const response = await axios.get(ip + 'transaction/fetchItemBorrowedByDate', {
        params: filderData,
      })
      const formattedData = response.data.map((item) => ({
        ...item,
        date_borrowed: FormatDate(item.date_borrowed),
      }))

      const borrowedItemByDate = Object.values(formattedData)
      const label = []
      const chartData = []
      let index = 0
      for (const item of borrowedItemByDate) {
        const { quantity, date_borrowed } = item
        label[index] = date_borrowed
        chartData[index] = quantity
        index++
      }

      setChartItemBorrowedByDate({
        labels: label,
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#799ff8',
            data: chartData,
          },
        ],
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const fetchItem = async () => {
    try {
      const response = await axios.get(ip + 'item/userItem')
      setItemData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const fetchBorrower = async () => {
    try {
      const response = await axios.get(ip + 'borrower')
      setBorrowerData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    try {
      if (!form.checkValidity()) {
        form.reportValidity()
      } else {
        // clear form after successful submission
        if (borrowedItem.length) {
          // Now, create borrowedItemsWithQuantities with the modified quantity
          const borrowedItemsWithQuantities = borrowedItem.map((item) => ({
            item_id: item.item_id,
            quantity: item.quantity,
            borrower: selectedBorrower,
          }))

          await axios.post(ip + 'transaction', borrowedItemsWithQuantities)

          Swal.fire({
            title: 'Success',
            text: 'Item Borrowed Successfully!',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
          }).then(async (result) => {
            if (result.isConfirmed) {
              setSelectedBorrower('')
              setBorrowedItem([])
              setRowSelection({})
            }
          })
        }

        // setValidated(true)
      }
    } catch (error) {
      console.error('There was an error')
      // Show error message
      // Swal.fire({
      //   title: 'Error!',
      //   html: GetErrorMessage(error),
      //   icon: 'error',
      // })
    }
  }

  const handleBorrowerChange = (e) => {
    const { value } = e.target
    setSelectedBorrower(value)
    fetchBorrowerBorrowedItem(value) // if
  }
  const fetchBorrowerBorrowedItem = async (borrower_id) => {
    try {
      const response = await axios.get(ip + 'transaction/getBorrowerBorrowedItem/' + borrower_id)
      const formattedData = response.data.map((item) => ({
        ...item,
        date_borrowed: FormatDate(item.date_borrowed),
      }))
      setBorrowerBorrowedItem(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  // Function to handle quantity changes for each item
  const handleQuantityChange = (rowNumber, inputName, quantity, item_id, availableStock) => {
    const input = itemQuantityRefs.current[rowNumber]
    if (quantity > availableStock) {
      console.error('Quantity Exceeds Available Stock')
      // Set the input value to 1
      quantity = 1
      input.value = 1
    }

    // Update the quantity in the "itemQuantities" state
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [inputName]: quantity,
    }))

    // Update the quantity in the "borrowedItem" array
    setBorrowedItem((prevBorrowedItems) =>
      prevBorrowedItems.map((item) =>
        item.item_id === item_id
          ? {
              ...item,
              quantity: quantity,
            }
          : item,
      ),
    )
  }

  const borrowedColumns = [
    {
      accessorKey: 'number',
      header: '#',
    },
    {
      accessorKey: 'item_name',
      header: 'Item',
    },
    {
      accessorKey: 'quantityInput',
      header: 'Quantity',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
    },
    {
      accessorKey: 'action',
      header: 'Action',
    },
  ]

  const columns = [
    {
      accessorKey: 'item_name',
      header: 'Item',
    },
    {
      accessorKey: 'total_quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilderData({ ...filderData, [name]: value })
  }

  return userInfo.role_type === 'User' ? (
    <>
      <CRow>
        <CCol md={7}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Borrowed Item(s)</strong>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <CCol md={12}>
                  <CFormSelect
                    feedbackInvalid="Borrower is required"
                    id="borrower"
                    label={
                      <>
                        Borrower
                        <span className="text-warning">
                          <strong>*</strong>
                        </span>
                      </>
                    }
                    name="borrower"
                    value={selectedBorrower}
                    onChange={handleBorrowerChange}
                    required
                  >
                    <option value="">Choose...</option>
                    {borrowerData.map((borrower) => (
                      <option key={borrower.id} value={borrower.id}>
                        {borrower.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <hr />

                {/* Borrowed Item list */}
                <MaterialReactTable
                  columns={borrowedColumns}
                  data={borrowedItem}
                  enableColumnActions={false}
                  enableColumnFilters={false}
                  enablePagination={false}
                  enableSorting={false}
                  enableBottomToolbar={false}
                  enableTopToolbar={false}
                  muiTableBodyRowProps={{ hover: false }}
                  initialState={{ density: 'compact' }}
                />
                <CCol xs={12}>
                  <CButton color="primary" type="submit" className="float-end">
                    Submit
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={5}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List of Items</strong>
            </CCardHeader>
            <CCardBody>
              <>
                {/* Item list */}
                <MaterialReactTable
                  columns={columns}
                  data={itemData}
                  initialState={{ density: 'compact' }}
                  positionToolbarAlertBanner="bottom"
                  muiTableBodyRowProps={({ row }) => ({
                    onClick: () => {
                      // Check if the item_id is already in borrowedItem array
                      const itemIndex = borrowedItem.findIndex(
                        (item) => item.item_id === row.original.item_id,
                      )
                      if (itemIndex !== -1) {
                        // If it's already in borrowedItem, remove it

                        const updatedBorrowedItem = borrowedItem.filter(
                          (item) => item.item_id !== row.original.item_id,
                        )
                        setBorrowedItem(updatedBorrowedItem)

                        // Adjust row numbers for the remaining items
                        const updatedBorrowedItemWithNumbers = updatedBorrowedItem.map(
                          (item, index) => ({
                            ...item,
                            number: index + 1,
                          }),
                        )

                        setBorrowedItem(updatedBorrowedItemWithNumbers)
                      } else {
                        // If not, add the item_name to the borrowedItem array
                        setBorrowedItem((prevBorrowedItems) => [
                          ...prevBorrowedItems,
                          {
                            number: borrowedItem.length + 1,
                            item_id: row.original.item_id,
                            item_name: row.original.item_name,
                            quantity: 1,
                            unit: row.original.unit,
                            quantityInput: (
                              <CFormInput
                                ref={(ref) => handleItemQuantityRef(row.id, ref)}
                                key={row.id}
                                size="sm"
                                className="text-center"
                                type="number"
                                id={`quantity-${row.id}`}
                                name={`quantity-${row.id}`} // Use item_name as the name
                                value={itemQuantities[row.id]}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    row.id,
                                    e.target.name,
                                    e.target.value,
                                    row.original.item_id,
                                    row.original.total_quantity,
                                  )
                                }
                                required
                              />
                            ),
                            action: (
                              <Tooltip arrow placement="right" title="Remove">
                                <IconButton
                                  color="error"
                                  size="sm"
                                  onClick={() => {
                                    // Remove the item from borrowedItem
                                    const updatedBorrowedItem = borrowedItem.filter(
                                      (item) => item.item_name !== row.original.item_name,
                                    )
                                    setBorrowedItem(updatedBorrowedItem)

                                    // Toggle the row selection status
                                    setRowSelection((prev) => ({
                                      ...prev,
                                      [row.id]: false,
                                    }))
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            ),
                          },
                        ])

                        // const input = itemQuantityRefs.current

                        // Add the quantity input to quantityInput state
                        setQuantityInput((prevQuantityInput) => ({
                          ...prevQuantityInput,
                          [row.original.item_name]: prevQuantityInput[row.original.item_name] || 1, // Default to 1 if not set
                        }))
                      }

                      // Toggle the row selection status
                      setRowSelection((prev) => ({
                        ...prev,
                        [row.id]: !prev[row.id],
                      }))
                    },
                    selected: rowSelection[row.id],
                    sx: {
                      cursor: 'pointer',
                    },
                  })}
                />
              </>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {selectedBorrower && borrowerBorrowedItem.length > 0 && (
        <CRow>
          <CCol md={7}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Borrower&apos;s Borrowed Item</strong>
              </CCardHeader>
              <CCardBody>
                {/* Borrower's Borrowed Item */}
                <MaterialReactTable
                  columns={borrower_borrowed_item_column}
                  data={borrowerBorrowedItem}
                  enableColumnActions={false}
                  enableColumnFilters={false}
                  enableTopToolbar={false}
                  initialState={{ density: 'compact' }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  ) : (
    <>
      <CRow>
        <CCol md={12}>
          <CCard className="mb-4">
            {/* <CCardHeader>
              <strong>Total Borrowed Item By Month </strong>
            </CCardHeader> */}
            <CCardBody>
              <CRow>
                <CCol sm={7}>
                  <h4 id="traffic" className="card-title mb-0">
                    Total Borrowed Item By Date
                  </h4>
                </CCol>
                <CCol sm={5} className="d-none d-md-block">
                  <CInputGroup size="sm">
                    <CFormSelect
                      name="item_id"
                      value={filderData.item_id}
                      size="sm"
                      onChange={handleFilterChange}
                    >
                      <option value="">Item</option>
                      {itemData.map((item) => (
                        <option key={item.item_id} value={item.item_id}>
                          {item.item_name}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormSelect
                      name="month"
                      value={filderData.month}
                      size="sm"
                      onChange={handleFilterChange}
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormSelect
                      name="year"
                      value={filderData.year}
                      size="sm"
                      onChange={handleFilterChange}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </CFormSelect>
                    {/* <CInputGroupText component="label" htmlFor="inputGroupSelect02">
                      Options
                    </CInputGroupText> */}
                  </CInputGroup>
                  {/* 
                  <CButtonGroup className="float-end me-3">
                    {['Day', 'Month', 'Year'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === 'Day'}
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup> */}
                </CCol>
              </CRow>

              <CChartBar height={150} data={chartItemBorrowedByDate} labels="dog-pound" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
