import React, { useState } from 'react';
import * as d3 from 'd3';

// Define styles using plain CSS
const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px'
  },
  tabContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px'
  },
  tab: {
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    backgroundColor: '#e2e8f0'
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
    color: 'white'
  },
  bookshelfContainer: {
    marginTop: '16px'
  },
  bookshelfTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '24px'
  },
  bookshelfWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative'
  },
  book: {
    position: 'relative',
    margin: '0 4px 32px 4px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    borderRadius: '2px 5px 5px 2px',
    boxShadow: '3px 3px 5px rgba(0,0,0,0.2)',
    zIndex: 10
  },
  bookHover: {
    transform: 'translateY(16px)'
  },
  bookTitle: {
    position: 'absolute',
    transform: 'rotate(90deg) translateY(-100%)',
    transformOrigin: 'left top',
    top: '10px',
    left: '15px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.4)'
  },
  tooltip: {
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
    left: '50%',
    top: '0',
    backgroundColor: 'black',
    color: 'white',
    padding: '8px',
    borderRadius: '4px',
    width: '150px',
    fontSize: '12px',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none',
    zIndex: 50,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  tooltipVisible: {
    opacity: 1
  },
  tooltipTitle: {
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  tooltipAuthor: {
    color: '#ccc',
    marginBottom: '4px'
  },
  tooltipInfo: {
    marginTop: '4px'
  },
  tooltipGenre: {
    color: '#ccc',
    fontSize: '10px'
  },
  bookCover: {
    position: 'absolute',
    width: '60px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '2px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    opacity: 0,
    transition: 'all 0.3s ease',
    zIndex: 40,
    transform: 'translate(-50%, -110%)',
    left: '50%',
    top: '-10px'
  },
  bookCoverVisible: {
    opacity: 1,
    top: '-150px'
  },
  legendContainer: {
    marginTop: '140px',  // Increased to make room for covers
    paddingTop: '16px',
    borderTop: '1px solid #eee'
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center'
  },
  legendColor: {
    width: '16px',
    height: '16px',
    marginRight: '4px',
    borderRadius: '2px'
  },
  legendText: {
    fontSize: '12px'
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginTop: '8px'
  },
  descriptionText: {
    marginBottom: '4px'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '24px',
    margin: '0 auto',
    maxWidth: '1000px'
  },
  gridBook: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer'
  },
  gridBookHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  gridCover: {
    width: '120px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '4px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '12px'
  },
  gridTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '4px'
  },
  gridAuthor: {
    color: '#666',
    fontSize: '12px',
    marginBottom: '8px',
    textAlign: 'center'
  },
  gridCount: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};

const BookPopularityVisualization = () => {
  const [activeTab, setActiveTab] = useState('bookshelf');
  const [hoveredBook, setHoveredBook] = useState(null);
  
  // Updated book data with titles from your list and assigned genres
  const popularBooks = [
    { title: "The Frozen River", author: "Arial Lawhon", checkouts: 235, genre: "Fiction", coverUrl: "images/frozenriver.jpg" },
    { title: "The Women", author: "Kristin Hannah", checkouts: 193, genre: "Fiction", coverUrl: "images/thewomen.jpg" },
    { title: "James", author: "Percival Everett", checkouts: 189, genre: "Fiction", coverUrl: "images/james.jpg" },
    { title: "Remarkably Bright Creatures", author: "Shelby Van Pelt", checkouts: 153, genre: "Fiction", coverUrl: "images/creatures.jpg" },
    { title: "Solito", author: "Javier Zamora", checkouts: 146, genre: "Memoir", coverUrl: "images/solito.jpg" },
    { title: "West with Giraffes", author: "Lynda Rutledge", checkouts: 117, genre: "Fiction", coverUrl: "images/west.jpg" },
    { title: "The Heaven & Earth Grocery Store", author: "James McBride", checkouts: 112, genre: "Fiction", coverUrl: "images/heaven.jpg" },
    { title: "The Wedding People", author: "Alison Espach", checkouts: 105, genre: "Fiction", coverUrl: "images/weddingpeople.jpg" },
    { title: "The Anxious Generation", author: "Jonathan Haidt", checkouts: 98, genre: "Non-Fiction", coverUrl: "images/anxious.jpg" },
    { title: "The Lost Bookshop", author: "Evie Woods", checkouts: 91, genre: "Fiction", coverUrl: "images/lostbookshop.jpg" },
    { title: "First Lie Wins", author: "Ashley Elston", checkouts: 82, genre: "Fiction", coverUrl: "images/firstliewins.jpg" },
    { title: "Parable of the Sower", author: "Octavia E. Butler", checkouts: 80, genre: "Fiction", coverUrl: "images/parableofsower.jpg" },
    { title: "The God of the Woods", author: "Liz Moore", checkouts: 79, genre: "Fiction", coverUrl: "images/godofwoods.jpg" },
    { title: "The Borrowed Life of Frederick Fife", author: "Anna Johnston", checkouts: 79, genre: "Fiction", coverUrl: "images/borrowedlife.jpg" },
    { title: "The Briar Club", author: "Kate Quinn", checkouts: 79, genre: "Fiction", coverUrl: "images/briarclub.jpg" }
  ].sort((a, b) => b.checkouts - a.checkouts);
  
  // Expanded genre color palette
  const genreColors = {
    "Fiction": "#3182bd",
    "Memoir": "#74c476",
    "Non-Fiction": "#e6550d"
  };
  
  // Book Spine Visualization
  const BookshelfViz = () => {
    const maxCheckouts = Math.max(...popularBooks.map(book => book.checkouts));
    
    return (
      <div style={styles.bookshelfContainer}>
      
        <div style={styles.bookshelfWrapper}>
          {popularBooks.map((book, i) => {
            // Increase the minimum height to make spines more legible
            const height = 150 + (book.checkouts / maxCheckouts) * 250;
            const width = 30; // Slightly wider spines
            
            // Generate a random tilt between -5 and 5 degrees
            const tilt = (Math.random() * 8 - 4) * 0.5;
            
            // Book specific styles that depend on data
            const bookStyle = {
              ...styles.book,
              height: `${height}px`,
              width: `${width}px`,
              background: genreColors[book.genre] || "#ccc",
              transform: `rotate(${tilt}deg)`,
              ...(hoveredBook === i ? styles.bookHover : {})
            };
            
            const tooltipStyle = {
              ...styles.tooltip,
              ...(hoveredBook === i ? styles.tooltipVisible : {})
            };
            
            const bookTitleStyle = {
              ...styles.bookTitle,
              width: `${height - 20}px`
            };
            
            const bookCoverStyle = {
              ...styles.bookCover,
              ...(hoveredBook === i ? styles.bookCoverVisible : {})
            };
            
            return (
              <div 
                key={i}
                style={bookStyle}
                onMouseEnter={() => setHoveredBook(i)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div style={bookTitleStyle}>
                  {book.title.length > 20 ? book.title.substring(0, 18) + "..." : book.title}
                </div>
                
                <div style={tooltipStyle}>
                  <p style={styles.tooltipTitle}>{book.title}</p>
                  <p style={styles.tooltipAuthor}>by {book.author}</p>
                  <p style={styles.tooltipInfo}>{book.checkouts} checkouts</p>
              
                </div>
                
                {/* Book cover thumbnail */}
                <img 
                  src={book.coverUrl} 
                  alt={`Cover of ${book.title}`} 
                  style={bookCoverStyle}
                />
              </div>
            );
          })}
        </div>
        
        <div style={styles.legendContainer}>
          <div style={styles.legend}>
            {Object.entries(genreColors).map(([genre, color]) => {
              // Only include genres that are present in our data
              if (popularBooks.some(book => book.genre === genre)) {
                return (
                  <div key={genre} style={styles.legendItem}>
                    <div 
                      style={{
                        ...styles.legendColor,
                        backgroundColor: color
                      }}
                    ></div>
                    <span style={styles.legendText}>{genre}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div style={styles.description}>
            <p style={styles.descriptionText}>Taller spines indicate more checkouts.Hover over a spine to see cover image.</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Grid visualization with book covers
  const BookGridViz = () => {
    return (
      <div style={{padding: '20px'}}>
        <div style={styles.gridContainer}>
          {popularBooks.map((book, i) => {
            const gridBookStyle = {
              ...styles.gridBook,
              ...(hoveredBook === i ? styles.gridBookHover : {})
            };
            
            return (
              <div 
                key={i} 
                style={gridBookStyle}
                onMouseEnter={() => setHoveredBook(i)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <img 
                  src={book.coverUrl} 
                  alt={`Cover of ${book.title}`}
                  style={styles.gridCover}
                />
                <h4 style={styles.gridTitle}>{book.title}</h4>
                <p style={styles.gridAuthor}>{book.author}</p>
                <span style={styles.gridCount}>{book.checkouts} checkouts</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Top 15 loaned books</h1>
        <p style={styles.subtitle}>Michigan eLibrary Catalog: Jan.1 - March 18, 2025</p>
      </div>
      
      <div style={styles.tabContainer}>
        <button 
          style={{
            ...styles.tab,
            ...(activeTab === 'bookshelf' ? styles.activeTab : {})
          }} 
          onClick={() => setActiveTab('bookshelf')}
        >
          Book Shelf
        </button>
        <button 
          style={{
            ...styles.tab,
            ...(activeTab === 'grid' ? styles.activeTab : {})
          }} 
          onClick={() => setActiveTab('grid')}
        >
          Cover Grid
        </button>
      </div>
      
      {activeTab === 'bookshelf' && <BookshelfViz />}
      {activeTab === 'grid' && <BookGridViz />}
    </div>
  );
};

export default BookPopularityVisualization;
