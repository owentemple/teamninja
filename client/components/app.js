"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Search = require('./search')
var SearchList = require('./searchlist')
var CampgroundList = require('./campgroundListView')
//
// The initial page component
//
class SearchBoxPage extends React.Component {
  constructor() {
    super();
    this.state = {
      searches: [
        { id: 1, searchData: 'Campground'}
      ],
      campsites: [
        { id: 1, campsite: 'Campsite Makersquare'}
      ],
      showCampgroundList: false,
    };
  }
//
// Renders the page
//
  render() {
    const campsites = this._getCampsites();
    const searches = this._getSearches();
    return (
      <div className='search-box'>
        <SearchList addSearch={this._addSearch.bind(this)} />
        <CampgroundList />
        <h3>Campgrounds</h3>
        <div className='campground-list'>
          {this.state.showCampgroundList ? <div className='campground-list'>{searches}</div> : null}
        </div>
        <Campsite />
        <h3>Campsites</h3>
        <div className='campsite-list'>
          {campsites}
        </div>
      </div>
    );
  }

_fetchCampSites(){
  $.ajax({
    method:"GET",
    url: 'http://localhost:4000/searchcs?cgId=820400',
    data:{},
    success: (data) => {
      console.log('campsites', data)
      let campsite ={
        id: this.state.campsites.length + 1,
        campsite: JSON.stringify(data)
      };
      this.setState({
        campsites: this.state.campsites.concat([campsite])
      });
    }
  })
}

//
//Gets campsite data
//
  _fetchCampData(value){
        value = JSON.parse(value)
        // console.log("value:", JSON.parse(value))
        let urlValue ='http://localhost:4000/searchcg?lat='+value.lat+'&lon='+value.lng+'&rad=100';
        console.log('urlValue:', urlValue)
        $.ajax({
          method:"GET",
          url: urlValue,
          data:{},
//        
// On success: prints campsite data to page then calls this.setState
//
        success: (data) => {       
        console.log('Second success', data)
        let search = {
          id: this.state.searches.length + 1,
          searchData: JSON.stringify(data)
        };
        this.setState({ 
          searches: this.state.searches.concat([search]),
          showCampgroundList: true,
        });
        this._fetchCampSites();
        }
      })
  }
//
// Call to Google's api
//
  _addSearch(value) {
    value = value.replace(" ", "");
    let urlValue = 'https://maps.googleapis.com/maps/api/geocode/json?address='+value+'&key= AIzaSyBHsN_BNT1GLrArFLeiNwkL6TJX7rmR3Lk';
    $.ajax({
      method:"GET",
      url: urlValue,
      data:{},
//
// On success: consoles the long and lat, then calls this._secondAjax
//      
       success: (data) => {
        let results = JSON.stringify(data.results[0].geometry.location)
        console.log('First success', data, results)
        //console.log('data', JSON.parse(data))
        console.log("data", results)
        this._fetchCampData(results);

      },
      error: function (status, error) {
        console.log('google query error')
        alert('Google query error', error);
      }
         })
  }
  _getCampsites() {
    return this.state.campsites.map((campsite) => {
      return (<Campsite
                campsite={campsite.campsite}
                key={campsite.id} />);
    })
  }

  _getSearches() {
    return this.state.searches.map((search) => {
      return (<Search
                searchData={search.searchData}
                key={search.id} />);
    })
  }
}
class Campsite extends React.Component {
//
// Renders the user's input to p tag and appends to the search-list
//
  render() {
    
    return(
      <div className="campsite-list">
        <p className="users-campsite">{this.props.campsite}</p>          
      </div>
    );
  }
}
 
// class CampsiteList extends React.Component ({
// //
// // Creates the input element and button element
// //
//   render: function (){
//     return (
//       <form className='search-list' onSubmit={this._handleSubmit.bind(this)}>
//         <div className='search-list-fields'>
//           <input placeholder="Street City State" ref={(value) => this._searchData = value}/>
//         </div>
//         <div className='search-list-actions'>
//           <button type='submit'>
//             submit
//           </button>
//         </div>
//       </form>
//     );
//   },
  
  // _handleSubmit: function(e) {
  //   e.preventDefault();

  //   this.props.addSearch(this._searchData.value);

  //   this._searchData.value = '';

    
  // }





ReactDOM.render(
  <SearchBoxPage />,  document.getElementById('app')
  );




