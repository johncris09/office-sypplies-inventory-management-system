import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Item = React.lazy(() => import('./views/item/Item'))
const User = React.lazy(() => import('./views/user/User'))
const Borrower = React.lazy(() => import('./views/borrower/Borrower'))
const BorrowedItem = React.lazy(() => import('./views/borrowed_item/BorrowedItem'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/item', name: 'Item', element: Item },
  { path: '/consumer', name: 'Consumer', element: Borrower },
  { path: '/released_item', name: 'Released Item(s)', element: BorrowedItem },
  { path: '/user', name: 'User', element: User },
]

export default routes
