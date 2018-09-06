import React from 'react'
import makeLoadable from 'rmw-shell/lib/containers/MyLoadable'
import RestrictedRoute from 'rmw-shell/lib/containers/RestrictedRoute'

const MyLoadable = (opts, preloadComponents) => makeLoadable({ ...opts, firebase: () => import('./firebase') }, preloadComponents)

const AsyncDashboard = MyLoadable({ loader: () => import('../pages/Dashboard') })
const AsyncAbout = MyLoadable({ loader: () => import('../pages/About') })
const AsyncCompany = MyLoadable({ loader: () => import('../pages/Companies/Company') })
const AsyncCompanies = MyLoadable({ loader: () => import('../pages/Companies/Companies') }, [AsyncCompany])
const AsyncInvestible = MyLoadable({ loader: () => import('../pages/Investibles/InvestibleListItem') })
const AsyncInvestibles = MyLoadable({ loader: () => import('../pages/Investibles/Investibles') }, [AsyncInvestible])
const AsyncDocument = MyLoadable({ loader: () => import('../pages/Document') })
const AsyncCollection = MyLoadable({ loader: () => import('../pages/Collection') })
const AsyncLogin = MyLoadable({ loader: () => import('../pages/Login') })

const routes = [
  <RestrictedRoute type='private' path="/" exact component={AsyncDashboard} />,
  <RestrictedRoute type='private' path="/dashboard" exact component={AsyncDashboard} />,
  <RestrictedRoute type='private' path="/about" exact component={AsyncAbout} />,
  <RestrictedRoute type='private' path="/companies" exact component={AsyncCompanies} />,
  <RestrictedRoute type='private' path="/companies/edit/:uid" exact component={AsyncCompany} />,
  <RestrictedRoute type='private' path="/companies/create" exact component={AsyncCompany} />,
  <RestrictedRoute type='public' path="/investibles" exact component={AsyncInvestibles} />,
  <RestrictedRoute type='public' path="/investibles/edit/:uid" exact component={AsyncInvestible} />,
  <RestrictedRoute type='private' path="/document" exact component={AsyncDocument} />,
  <RestrictedRoute type='private' path="/collection" exact component={AsyncCollection} />,
  <RestrictedRoute type='public' path="/login" exact component={AsyncLogin} />
]


export default routes;