import React , { Component } from 'react'
import Book from './Book'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'
import { DebounceInput } from 'react-debounce-input'

class SearchBooks extends Component {
  state = {
    books:[],
    showBooks:[],
    query:''
  }

  componentDidMount() {
  }

  updateQuery(query) {
    this.setState({ query: query.trim() })
  }

  search(query) {
    this.updateQuery(query)
    if(query) {
      BooksAPI.search(query)
      .then((searchedBooks) => {
        if(searchedBooks.error === "No results") {
          this.setState({books:[]})
        }
        searchedBooks = searchedBooks.filter(r => r.imageLinks)
        searchedBooks = searchedBooks.map(b => {
          b.shelf = this.findShelf(b)
          return b
        })
        let books = searchedBooks
        this.setState({ books })
      }).catch(err => {
        this.setState({books:[]})
      }) 
    } else {
      this.setState({
        books:[],
        query:''})
      }
    }

  findShelf = (b) => {
    return this.props.books.filter(book => b.id===book.id).length ? this.props.books.filter(book => b.id===book.id)[0].shelf : 'none'
  }



  render() {
    const {books,query} = this.state
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <DebounceInput  minLength={1} placeholder="Search by title or author" onChange={(e) => this.search(e.target.value)}/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books.length>0 ? 
              (books.map((book) => (
                <li key={book.id}>
                  <Book book={book} shelfUpdate={ this.props.shelfUpdate } />
                </li>)
              )):(query.length === 0) ?(<p>No books to display</p>) : (<p>No books found</p>)}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks