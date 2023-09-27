import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilFolder, cilTask } from '@coreui/icons'
import { CNavItem } from '@coreui/react'
const _nav = (userInfo) => {
  let items = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Item',
      to: '/item',
      icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Released Item(s)',
      to: '/released_item',
      icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Consumer',
      to: '/consumer',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'User',
      to: '/user',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
  ]

  if (userInfo.role_type === 'User') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Released Item(s)',
        to: '/released_item',
        icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Consumer',
        to: '/consumer',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  }
  return items
}

export default _nav
