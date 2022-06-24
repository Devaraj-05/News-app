import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
    static defaultProps={
        country: 'in',
        pageSize: 9,
        category: 'general'
    }
    static propsTypes={
      country: PropTypes.string,
      pageSize: PropTypes.number,
      category: PropTypes.string,
    }
    CapitlizeString=(word) =>
    {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    constructor(props){
        super(props);
        this.state={
            articles : [],
            loading: false,
            page: 1
        }
        document.title =`${this.CapitlizeString(this.props.category)} -NewsMonkey`;
    }
    async updateNews(){
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=86b1f37e5cd24cbcacc044b79405fd24&page=${this.state.page}&pagesize=${this.props.pageSize}`
      this.setState({loading: true });
      let data=await fetch(url)
      let parseData=await data.json()
      console.log(parseData);
      this.setState({
        articles: parseData.articles,
        totalResults : parseData.totalResults,
        loading: false
      })
    }
    async componentDidMount(){
      this.updateNews();
    }
    handleNextClick= async()=>{
      this.setState({page: this.state.page+1})
      this.updateNews();
    }
    handlePrevClick=async ()=>{
      this.setState({page: this.state.page-1})
      this.updateNews();

    }
    
  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin: '35px 0'}}>News Monkey Top Headlines from {this.CapitlizeString(this.props.category)}</h1>
          {this.state.loading && <Spinner/>}
        <div className="row">
        {!this.state.loading && this.state.articles.map((element)=>{
              return <div className="col-md-4" key={element.url}>
              <NewsItem  title={element.title? element.title:""} description={element.description? element.description:""}
               imgurl={element.urlToImage ?element.urlToImage:"https://images.livemint.com/img/2022/03/18/600x338/applewatch-k3uE--621x414@LiveMint_1647608722835.jpg"}
              newsUrl={element.url}
              date={element.publishedAt}
              author={element.author}
              source={element.source.name}/>
          </div>
          })}
            
        </div>
        <div className="container d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr;  Previous</button>
        <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News
