import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/npdev:collections'
import { Component } from 'react'
import { Loadable } from 'meteor/npdev:react-loadable'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import Loading from './ui/common/Loading'

const MainLayout = Loadable({
  loader: () => import('./ui/layouts/MainLayout'),
  loading: Loading
})
const Login = Loadable({
  loader: () => import('./ui/account/Login'),
  loading: Loading
})
const ForgotPassword = Loadable({
  loader: () => import('./ui/account/ForgotPassword'),
  loading: Loading
})

const NotFound = Loadable({
  loader: () => import('./ui/common/NotFound'),
  loading: Loading
})

const Page = Loadable({
  loader: () => import('./ui/pages/Page'),
  loading: Loading
})

// This is doing double duty. It protects the auth routes,
// but also prevents SSR from trying to render these
// routes.
const PrivateRoute = ({ render, ...props }) => {
  const { userId } = useTracker(() => ({
    userId: Meteor.isClient && Meteor.userId()
  }))
  return <Route render={
    (routeProps) => (userId
      ? render(Object.assign({ userId }, props, routeProps))
      : <Redirect to={{
        pathname: '/sign-in',
        state: { from: props.location }
      }} />)
  } />
}

const AdminApp = Loadable({
  loader: () => import('./ui/admin/AdminApp'),
  loading: Loading
})

export const App = (props) => {
  return <Switch>
    <Route path="/sign-in" render={(props) => (
      <MainLayout pageClass="page home" title="Sign In" {...props}>
        <Login mode="login" {...props} />
      </MainLayout>
    )} />
    <Route path="/sign-up" render={(props) => (
      <MainLayout pageClass="page sign-up" title="Sign Up" {...props}>
        <Login mode="sign-up" {...props} />
      </MainLayout>
    )} />
    <Route path="/forgot-password" render={(props) => (
      <MainLayout pageClass="page forgot-password" title="Forgot Password" {...props}>
        <ForgotPassword {...props} />
      </MainLayout>
    )} />
    <PrivateRoute path="/admin" render={(props) => (
      <AdminApp {...props} />
    )} />
    <Route path="/pages/:slug" render={(props) => (
      <MainLayout {...props}>
        <Page slug={props.match.params.slug} />
      </MainLayout>
    )} />
    <Route path="/" render={(props) => (
      <MainLayout {...props}>
        <div>Home Page &nbsp;|&nbsp; <Link to="/pages/about-us">About Us</Link></div>
      </MainLayout>
    )} />
    <Route render={(props) => (
      <MainLayout {...props} title="404 - Not Found">
        <NotFound {...props} />
      </MainLayout>
    )} />
  </Switch>
}
