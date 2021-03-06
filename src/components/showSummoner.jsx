import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as actions from '../actions/summonerActions'

class Summoner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      summonerName: '',
    }
    this.handleSummonerID = this.handleSummonerID.bind(this)
  }

  componentDidMount() {
    console.log('WHAT IS MY NAME: ', this.props)
  }

  handleSummonerID(e) {
    e.preventDefault()
    let spinner = document.getElementsByClassName("spinner")[0]
    spinner.classList.add('active')
    axios.post('/findSummonerID', [this.state.summonerName])
    .then(response => {
      if(response.data === 'no summoner') {
        const spinner = document.getElementsByClassName("spinner")[0]
        spinner.classList.remove('active')
        document.getElementsByClassName("summonerNameInput")[0].value = 'Summoner not found, try again.'
      } else {
        this.props.getSummonerInfo(response.data);
        this.getProfileIcon();
      }
    })
    .catch((err) => {
      console.log('error in handleSummonerID')
    })
  }

  getProfileIcon() {
    axios.get('/getProfileIcon')
    .then((response) => {
      if(response.data.data[this.props.summonerInfo.profileIconId] !== undefined) {
        this.props.setSummonerProfilePic('http://ddragon.leagueoflegends.com/cdn/7.5.1/img/profileicon/' + response.data.data[this.props.summonerInfo.profileIconId].id + '.png');
        this.getRank();
      }
    })
    .catch((err) => {
      console.log('error in getProfileIcon')
    })
  }

  getRank() {
    axios.post('/getRank', [this.props.summonerInfo.id])
    .then((response) => {
      this.props.setSummonerRank(response.data[0]);
      this.getMostPlayedChamp();
    })
    .catch((err) => {
      console.log('error in getRank');
    })
  }

  getMostPlayedChamp() {
    axios.post('/getMostPlayedChamp', [this.props.summonerInfo.id])
    .then((response) => {
      this.props.setSummonerMostPlayedChamps(response.data)
      this.getMostPlayedChampPic();
    })
    .catch((err) => {
      console.log('error in getMostPlayedChamp: ', err);
    }) 
  }

  getMostPlayedChampPic() {
    let spinner = document.getElementsByClassName("spinner")[0];
    spinner.classList.remove('active');
    axios.post('/getMostPlayedChampPic', [this.props.summonerMostPlayedChamps[0].championId])
    .then((response) => {
      this.props.setSummonerMostPlayedChampPic('http://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + response.data.name + '_0.jpg');
      browserHistory.push('/summonerProfile');
    })
    .catch((err) => {
      console.log('error in getMostPlayedChampPic: ', err);
    })
  }

  render() {
    return (
      <div>
        <div className="summonerInputContainer">
          <h1 className="summonerInputHeader">POOP Name</h1>
          <form onSubmit={this.handleSummonerID}>
            <input className="summonerNameInput" onChange={(e) => {this.setState({summonerName: e.target.value})}} value={this.state.summonerName} type="text"/>
          </form>
        </div>
        <img className="spinner" src="http://www.shopfashionisland.com/images/spinner.gif" alt=""/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  summonerInfo: state.summonerInfo,
  summonerProfilePic: state.summonerProfilePic,
  summonerRank: state.summonerRank,
  summonerMostPlayedChamps: state.summonerMostPlayedChamps,
  summonerMostPlayedChampPic: state.summonerMostPlayedChampPic,
})

export default connect(mapStateToProps, actions)(Summoner)
