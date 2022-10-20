import './index.css'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'

export default class Home extends Component {
  state = {optionValue: 'ALL', listData: [], failureView: false, loader: true}

  opt = event => {
    this.setState({optionValue: event.target.value.toUpperCase()}, this.getData)
  }

  componentDidMount = () => {
    this.getData()
  }

  retry = () => {
    this.getData()
  }

  getData = async () => {
    const {optionValue} = this.state
    console.log(optionValue)
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${optionValue}`,
    )
    console.log(response)
    const respData = await response.json()
    console.log(respData)
    if (response.ok) {
      const data = respData.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({listData: data, failureView: false, loader: false})
    } else {
      this.setState({failureView: true, loader: false})
    }
  }

  render() {
    const {listData, failureView, loader} = this.state
    console.log(failureView)
    const {details} = this.props
    console.log(details)
    console.log(listData)

    return (
      <div>
        <Header />
        <div className="home-div">
          <select onChange={this.opt} className="select">
            {details.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {loader ? (
            <div testid="loader" className="loader">
              <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
            </div>
          ) : (
            <ul>
              {listData.map(each => (
                <li key={each.id}>
                  <img src={each.imageUrl} alt={each.name} />
                  <p className="li-h1">{each.name}</p>
                </li>
              ))}
            </ul>
          )}
          {failureView ? (
            <div className="failure-div">
              <img
                className="fail-img"
                src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
                alt="failure view"
              />
              <h1>Oops! Something Went Wrong</h1>
              <p>We cannot seem to find the page you are looking for</p>
              <button onClick={this.retry} type="button">
                Retry
              </button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
