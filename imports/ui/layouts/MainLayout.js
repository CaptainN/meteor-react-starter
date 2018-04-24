import { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet-async'

class MainLayout extends Component {
  static propTypes = {
    title: PropTypes.string
  }
  render () {
    const { children, title } = this.props
    const defaultTitle = 'Meteor Apollo React Starter'
    return <div className="main">
      <Helmet>
        <title>{
          (title)
            ? title + ' - ' + defaultTitle
            : defaultTitle
        }</title>
      </Helmet>
      <Link to="/admin">Admin</Link>
      <h1>User Tier</h1>
      {children}
    </div>
  }
}

export default MainLayout
