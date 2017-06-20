import React, { Component } from 'react';
import * as ws from './ws.js'; // -- api
import './App.css';

var maxArticles = 10;
var cards = [];

class Story {
  constructor(title, url, timestamp, score, author, karma) {
    this.title = title;
    this.url = url;
    this.timestamp = timestamp;
    this.score = score;
    this.author = author;
    this.karma = karma;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    var _this = this;

    ws.loadSingle('https://hacker-news.firebaseio.com/v0/topstories.json', processIds);

    function processIds(myData) {
      var stories = [];

      // Only get 10 stories
      var i = 0;
      var min, max, rndId;
      while (i < maxArticles) {
        min = Math.ceil(0);
        max = Math.floor(myData.data.length);
        rndId = Math.floor(Math.random() * (max - min)) + min;

        myData.data.splice(rndId, 1);

        stories.push(myData.data[rndId]);
        i++;
      }

      // Load data from next api
      ws.loadMultiple('https://hacker-news.firebaseio.com/v0/item/', stories, processStories);
    }

    function processStories(returnData) {
      var authors = [];

      for (var i = 0; i < returnData.length; i++) {
        authors.push(returnData[i].by);

        // Create card object
        cards.push(
          new Story(
            returnData[i].title,
            returnData[i].url,
            new Date(returnData[i].time),
            returnData[i].score,
            '',
            ''
          )
        );
      }

      // Load author data for each story from next api
      ws.loadMultiple('https://hacker-news.firebaseio.com/v0/user/', authors, processAuthors);
    }

    function processAuthors(returnData) {
      for (let i = 0; i < cards.length; i++) {
        cards[i].author = returnData[i].id;
        cards[i].karma = returnData[i].karma;
      }

      // Sorting
      for (var i = 0; i < cards.length-1; i++) {
        for (var j = i+1; j < cards.length; j++) {
          if (cards[i].score > cards[j].score) {
            var aux = cards[i];
            cards[i] = cards[j];
            cards[j] = aux;
          }
        }
      }
      _this.setState({posts:cards});
    }
  }

  render() {
    return (
      <div className="App">
          {this.state.posts.map(post =>
            <div className="card loaded" key={post.title}>
              <div className="score">Score <span>{post.score}</span></div>
              <h1>{post.title}</h1>
              <p><a href="{post.url}">{post.url}</a></p>
              <p>
                Published on&nbsp;
                  {post.timestamp.getDate()}/
                  {post.timestamp.getMonth()+1}/
                  {post.timestamp.getFullYear()}
                &nbsp;by {post.author}, {'\n'}
                Karma points: {post.karma}
              </p>
            </div>
          )}
      </div>
    );
  }
}

export default App;
